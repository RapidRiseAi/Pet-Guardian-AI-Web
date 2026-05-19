export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { Bell, Link2, LockKeyhole, UserRound } from 'lucide-react';
import {
  initiateWhatsAppLinkAction,
  signOutAction,
  updateNotificationPreferencesAction,
  updateProfileAction,
} from '@/lib/auth/actions';
import { getSessionContext } from '@/lib/auth/guards';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';

type AccountPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const context = await getSessionContext();
  if (!context.userId) redirect('/login');

  const supabase = await createSupabaseServerClient();
  const [{ data: preferences }, { data: whatsappLinks }] = await Promise.all([
    supabase.from('notification_preferences').select('channel, enabled').eq('profile_id', context.userId),
    supabase.from('whatsapp_links').select('phone_number, status, verified_at, created_at').eq('profile_id', context.userId),
  ]);

  const params = (await searchParams) ?? {};
  const error = first(params.error);
  const success = first(params.success);
  const enabled = new Map(
    ((preferences ?? []) as Array<{ channel: string; enabled: boolean }>).map((pref) => [
      pref.channel,
      pref.enabled,
    ]),
  );

  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="success">Account trust layer</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Profile, security, and connected channels.</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Manage identity, notification preferences, password recovery, sign-out, and WhatsApp linking from one mobile-first account surface.
        </p>
      </GlassCard>

      {error ? <p className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? <p className="rounded-2xl border border-success/30 bg-success/5 p-3 text-sm text-success">{success}</p> : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="flex items-center gap-3">
            <UserRound className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Profile info</h2>
          </div>
          <form action={updateProfileAction} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Full name
              <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="fullName" defaultValue={context.profile?.fullName ?? ''} />
            </label>
            <label className="block text-sm font-medium">
              Display name
              <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="displayName" defaultValue={context.profile?.displayName ?? ''} />
            </label>
            <label className="block text-sm font-medium">
              Phone
              <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="phone" type="tel" defaultValue={context.profile?.phone ?? ''} />
            </label>
            <label className="block text-sm font-medium">
              Time zone
              <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="timezone" defaultValue={context.profile?.timezone ?? 'UTC'} />
            </label>
            <Button className="sm:col-span-2" type="submit">Save profile</Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Bell className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Notification preferences</h2>
          </div>
          <form action={updateNotificationPreferencesAction} className="mt-5 space-y-3">
            {[
              ['in_app', 'In-app notifications', 'Reminders, approvals, and updates inside PetGuardian.'],
              ['email', 'Email', 'Transactional care reminders, invites, and security messages.'],
              ['whatsapp', 'WhatsApp', 'Assistant reminders after secure linking is complete.'],
            ].map(([name, label, detail]) => (
              <label key={name} className="flex items-start gap-3 rounded-2xl border border-border bg-secondary p-3 text-sm">
                <input name={name} type="checkbox" defaultChecked={enabled.get(name) ?? name === 'in_app'} className="mt-1" />
                <span>
                  <span className="block font-semibold">{label}</span>
                  <span className="text-muted-foreground">{detail}</span>
                </span>
              </label>
            ))}
            <Button className="w-full" type="submit">Save preferences</Button>
          </form>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <LockKeyhole className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Security controls</h2>
          </div>
          <div className="mt-5 space-y-3">
            <p className="rounded-2xl border border-border bg-secondary p-3 text-sm text-muted-foreground">Email: {context.email} • {context.emailVerified ? 'verified' : 'verification pending'}</p>
            <ButtonLink href="/reset-password" variant="secondary" className="w-full">Send password reset email</ButtonLink>
            <form action={signOutAction}>
              <Button className="w-full" variant="danger" type="submit">Sign out</Button>
            </form>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Link2 className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Connected channels</h2>
          </div>
          <div className="mt-5 space-y-3">
            {(whatsappLinks ?? []).length > 0 ? (
              (whatsappLinks as Array<{ phone_number: string; status: string; verified_at: string | null; created_at: string }> | null)?.map((link) => (
                <div key={`${link.phone_number}-${link.created_at}`} className="rounded-2xl border border-border bg-secondary p-3 text-sm">
                  <p className="font-semibold">WhatsApp {link.phone_number}</p>
                  <p className="text-muted-foreground">Status: {link.status}{link.verified_at ? ' • verified' : ' • awaiting verification'}</p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-border bg-secondary p-3 text-sm text-muted-foreground">No WhatsApp number linked yet.</p>
            )}
            <form action={initiateWhatsAppLinkAction} className="space-y-3">
              <input type="hidden" name="source" value="/app/account" />
              <input className="min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="phoneNumber" type="tel" placeholder="+15550001001" defaultValue={context.profile?.phone ?? ''} />
              <Button className="w-full" type="submit">Create WhatsApp link code</Button>
            </form>
          </div>
        </Card>
      </section>
    </div>
  );
}
