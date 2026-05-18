import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/roles';

export type SessionContext = {
  userId: string | null;
  email: string | null;
  role: UserRole | null;
  onboardingComplete: boolean;
  emailVerified: boolean;
  profile: {
    fullName: string | null;
    displayName: string | null;
    timezone: string | null;
    phone: string | null;
  } | null;
};

export function isAuthenticated(context: SessionContext) {
  return Boolean(context.userId);
}

export function hasRole(context: SessionContext, allowed: UserRole[]) {
  return Boolean(context.role && allowed.includes(context.role));
}

export function requireRole(context: SessionContext, allowed: UserRole[]) {
  if (!isAuthenticated(context)) {
    return { allowed: false, reason: 'Sign in to continue.' } as const;
  }

  if (!hasRole(context, allowed)) {
    return { allowed: false, reason: 'Your current role cannot access this workspace.' } as const;
  }

  return { allowed: true, reason: null } as const;
}

export function roleHomeHref(role: UserRole | null) {
  if (role === 'sitter') return '/app/sitter';
  if (role === 'clinic') return '/app/clinic';
  if (role === 'admin') return '/app/admin';
  return '/app';
}

export async function getSessionContext(): Promise<SessionContext> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      userId: null,
      email: null,
      role: null,
      onboardingComplete: false,
      emailVerified: false,
      profile: null,
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, display_name, phone, timezone, onboarding_completed_at, email_verified_at')
    .eq('id', user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? null,
    role: (profile?.role as UserRole | undefined) ?? null,
    onboardingComplete: Boolean(profile?.onboarding_completed_at),
    emailVerified: Boolean(user.email_confirmed_at ?? profile?.email_verified_at),
    profile: profile
      ? {
          fullName: profile.full_name,
          displayName: profile.display_name,
          timezone: profile.timezone,
          phone: profile.phone,
        }
      : null,
  };
}
