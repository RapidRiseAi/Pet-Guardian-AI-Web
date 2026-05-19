export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { completeOnboardingAction } from '@/lib/auth/actions';
import { getSessionContext } from '@/lib/auth/guards';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';

type OnboardingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const context = await getSessionContext();
  if (!context.userId) redirect('/login?next=/onboarding');

  const params = (await searchParams) ?? {};
  const error = first(params.error);
  const defaultName = context.profile?.displayName ?? context.profile?.fullName ?? '';
  const defaultRole = context.role && context.role !== 'admin' ? context.role : 'owner';

  return (
    <div className="w-full max-w-5xl space-y-5 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-5 lg:space-y-0">
      <GlassCard>
        <Badge tone="info">First-time setup</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Build your trusted care workspace.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          PetGuardian branches onboarding by role: owners go straight to first pet setup, sitters prepare an assignment-ready profile, and clinics start an approval workflow.
        </p>
        <div className="mt-6 space-y-3 text-sm text-muted-foreground">
          <p className="rounded-2xl border border-border bg-secondary/70 p-3">Email: {context.email}</p>
          <p className="rounded-2xl border border-border bg-secondary/70 p-3">Verification: {context.emailVerified ? 'Verified' : 'Pending verification'}</p>
        </div>
      </GlassCard>
      <Card>
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">Complete profile</h2>
        {error ? <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
        <form action={completeOnboardingAction} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Display name
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="displayName" defaultValue={defaultName} required />
          </label>
          <label className="block text-sm font-medium">
            Time zone
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="timezone" defaultValue={context.profile?.timezone ?? 'UTC'} required />
          </label>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Workspace type</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ['owner', 'Owner', 'Add your first pet now.'],
                ['sitter', 'Sitter', 'Prepare for assigned care.'],
                ['clinic', 'Clinic', 'Start approval profile.'],
              ].map(([value, label, detail]) => (
                <label key={value} className="rounded-2xl border border-border bg-secondary p-3 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <input name="role" type="radio" value={value} defaultChecked={value === defaultRole} />
                    {label}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="rounded-2xl border border-border bg-secondary/60 p-4">
            <p className="text-sm font-semibold">Clinic details</p>
            <p className="mt-1 text-xs text-muted-foreground">Only required if you choose clinic.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="min-h-11 rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary" name="clinicName" placeholder="Clinic name" />
              <input className="min-h-11 rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary" name="clinicPhone" placeholder="Clinic phone" />
              <input className="min-h-11 rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary sm:col-span-2" name="clinicEmail" type="email" placeholder="Clinic email" />
            </div>
          </div>
          <Button className="w-full" type="submit">Finish onboarding</Button>
        </form>
      </Card>
    </div>
  );
}
