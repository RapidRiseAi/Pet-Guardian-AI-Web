'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { env } from '@/lib/env';
import { roleHomeHref } from '@/lib/auth/guards';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/roles';

const passwordHelp = 'Use at least 12 characters with a mix of letters and numbers.';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function authRedirect(pathname: string, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  redirect(`${pathname}?${search.toString()}`);
}

function isValidRole(role: string): role is UserRole {
  return role === 'owner' || role === 'sitter' || role === 'clinic' || role === 'admin';
}

function validatePassword(password: string) {
  return password.length >= 12 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

export async function signInAction(formData: FormData) {
  const email = value(formData, 'email').toLowerCase();
  const password = value(formData, 'password');
  const next = value(formData, 'next') || '/app';

  if (!email || !password) {
    authRedirect('/login', { error: 'Enter your email and password.', next });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    authRedirect('/login', { error: error?.message ?? 'Could not sign in.', next });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed_at')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed_at) redirect('/onboarding');

  redirect(next.startsWith('/') ? next : roleHomeHref((profile.role as UserRole | null) ?? null));
}

export async function signUpAction(formData: FormData) {
  const fullName = value(formData, 'fullName');
  const email = value(formData, 'email').toLowerCase();
  const password = value(formData, 'password');
  const role = value(formData, 'role') || 'owner';

  if (!fullName || !email || !password) {
    authRedirect('/signup', { error: 'Full name, email, and password are required.' });
  }

  if (!isValidRole(role) || role === 'admin') {
    authRedirect('/signup', { error: 'Choose owner, sitter, or clinic for self-service sign-up.' });
  }

  if (!validatePassword(password)) {
    authRedirect('/signup', { error: passwordHelp });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.appBaseUrl}/auth/callback?next=/onboarding`,
      data: {
        full_name: fullName,
        display_name: fullName.split(' ')[0] ?? fullName,
        role,
        signup_source: 'web',
      },
    },
  });

  if (error) {
    authRedirect('/signup', { error: error.message });
  }

  if (data.session && data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      display_name: fullName.split(' ')[0] ?? fullName,
      role,
      onboarding_step: 'profile',
    });
    redirect('/onboarding');
  }

  authRedirect('/signup', {
    success: 'Check your email to verify your account, then continue onboarding.',
    email,
  });
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login?success=Signed%20out%20securely.');
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = value(formData, 'email').toLowerCase();

  if (!email) {
    authRedirect('/reset-password', { error: 'Enter the email address on your account.' });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.appBaseUrl}/auth/callback?next=/update-password`,
  });

  if (error) {
    authRedirect('/reset-password', { error: error.message });
  }

  authRedirect('/reset-password', {
    success: 'If an account exists for that email, a secure reset link has been sent.',
  });
}

export async function updatePasswordAction(formData: FormData) {
  const password = value(formData, 'password');
  const confirmPassword = value(formData, 'confirmPassword');

  if (!validatePassword(password)) {
    authRedirect('/update-password', { error: passwordHelp });
  }

  if (password !== confirmPassword) {
    authRedirect('/update-password', { error: 'Passwords do not match.' });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    authRedirect('/update-password', { error: error.message });
  }

  redirect('/app/account?success=Password%20updated.');
}

export async function resendVerificationAction(formData: FormData) {
  const email = value(formData, 'email').toLowerCase();

  if (!email) {
    authRedirect('/signup', { error: 'Enter your email to resend verification.' });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${env.appBaseUrl}/auth/callback?next=/onboarding` },
  });

  if (error) {
    authRedirect('/signup', { error: error.message, email });
  }

  authRedirect('/signup', { success: 'Verification email resent.', email });
}

export async function completeOnboardingAction(formData: FormData) {
  const role = value(formData, 'role') || 'owner';
  const displayName = value(formData, 'displayName');
  const timezone = value(formData, 'timezone') || 'UTC';
  const clinicName = value(formData, 'clinicName');
  const clinicEmail = value(formData, 'clinicEmail');
  const clinicPhone = value(formData, 'clinicPhone');

  if (!isValidRole(role) || role === 'admin') {
    authRedirect('/onboarding', { error: 'Choose owner, sitter, or clinic to continue.' });
  }

  if (!displayName) {
    authRedirect('/onboarding', { error: 'Add the name you want shown in PetGuardian.' });
  }

  if (role === 'clinic' && !clinicName) {
    authRedirect('/onboarding', { error: 'Add your clinic name to request clinic access.' });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?error=Sign%20in%20to%20finish%20onboarding.');

  const { error } = await supabase.rpc('mark_onboarding_complete', {
    selected_role: role,
    selected_display_name: displayName,
    selected_timezone: timezone,
  });

  if (error) {
    authRedirect('/onboarding', { error: error.message });
  }

  if (role === 'owner') {
    const { data: existingHousehold } = await supabase
      .from('households')
      .select('id')
      .eq('owner_profile_id', user.id)
      .maybeSingle();

    if (!existingHousehold) {
      const { data: household } = await supabase
        .from('households')
        .insert({
          name: `${displayName}'s household`,
          owner_profile_id: user.id,
          plan_key: 'starter',
        })
        .select('id')
        .single();

      if (household) {
        await supabase.from('household_members').insert({
          household_id: household.id,
          profile_id: user.id,
          role: 'owner',
          is_primary: true,
          accepted_at: new Date().toISOString(),
        });
      }
    }

    redirect('/app/pets/new?welcome=1');
  }

  if (role === 'clinic') {
    const { error: clinicError } = await supabase.rpc('create_onboarding_clinic', {
      clinic_name: clinicName,
      clinic_email: clinicEmail || null,
      clinic_phone: clinicPhone || null,
    });

    if (clinicError) {
      authRedirect('/onboarding', { error: clinicError.message });
    }

    redirect('/app/clinic?onboarding=clinic-pending');
  }

  redirect('/app/sitter?onboarding=profile-complete');
}

export async function updateProfileAction(formData: FormData) {
  const fullName = value(formData, 'fullName');
  const displayName = value(formData, 'displayName');
  const phone = value(formData, 'phone');
  const timezone = value(formData, 'timezone') || 'UTC';

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, display_name: displayName, phone, timezone })
    .eq('id', user.id);

  if (error) {
    authRedirect('/app/account', { error: error.message });
  }

  revalidatePath('/app/account');
  authRedirect('/app/account', { success: 'Profile updated.' });
}

export async function updateNotificationPreferencesAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const channels = ['in_app', 'email', 'whatsapp'] as const;
  const rows = channels.map((channel) => ({
    profile_id: user.id,
    channel,
    enabled: formData.get(channel) === 'on',
  }));

  const { error } = await supabase.from('notification_preferences').upsert(rows, {
    onConflict: 'profile_id,channel',
  });

  if (error) {
    authRedirect('/app/account', { error: error.message });
  }

  revalidatePath('/app/account');
  authRedirect('/app/account', { success: 'Notification preferences saved.' });
}

export async function initiateWhatsAppLinkAction(formData: FormData) {
  const phoneNumber = value(formData, 'phoneNumber');
  const source = value(formData, 'source') || '/link/whatsapp';

  if (!phoneNumber) {
    authRedirect(source, { error: 'Enter the WhatsApp number to link.' });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=${encodeURIComponent(source)}`);

  const linkCode = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 8)
    .toUpperCase();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { error } = await supabase.from('whatsapp_links').upsert(
    {
      profile_id: user.id,
      phone_number: phoneNumber,
      status: 'invited',
      metadata: { link_code: linkCode, expires_at: expiresAt, source: 'web' },
    },
    { onConflict: 'profile_id,phone_number' },
  );

  if (error) {
    authRedirect(source, { error: error.message });
  }

  authRedirect(source, {
    success: `Link code ${linkCode} created. Send it to the PetGuardian WhatsApp assistant within 15 minutes.`,
  });
}
