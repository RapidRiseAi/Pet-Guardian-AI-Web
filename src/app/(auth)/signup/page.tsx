import { resendVerificationAction, signUpAction } from '@/lib/auth/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type SignupPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const error = first(params.error);
  const success = first(params.success);
  const email = first(params.email) ?? '';
  const referralSource = first(params.ref) ?? '';

  return (
    <Card className="w-full max-w-md">
      <Badge tone="success">Mobile-first onboarding</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Set up your care account.</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Owners can add a pet immediately. Sitters complete a profile for assignments. Clinics start an approval-ready profile.
      </p>
      {error ? <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? (
        <div className="mt-4 rounded-2xl border border-success/30 bg-success/5 p-3 text-sm text-success">
          <p>{success}</p>
          <form action={resendVerificationAction} className="mt-3 flex gap-2">
            <input type="hidden" name="email" value={email} />
            <Button size="sm" variant="secondary" type="submit">Resend verification</Button>
          </form>
        </div>
      ) : null}
      <form action={signUpAction} className="mt-6 space-y-4">
        <input type="hidden" name="referralSource" value={referralSource} />
        <label className="block text-sm font-medium">
          Full name
          <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="fullName" autoComplete="name" required />
        </label>
        <label className="block text-sm font-medium">
          Email address
          <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="email" type="email" autoComplete="email" defaultValue={email} required />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="password" type="password" autoComplete="new-password" minLength={12} required />
          <span className="mt-1 block text-xs text-muted-foreground">At least 12 characters with letters and numbers.</span>
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">I am joining as</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ['owner', 'Owner'],
              ['sitter', 'Sitter'],
              ['clinic', 'Clinic'],
            ].map(([value, label]) => (
              <label key={value} className="flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-secondary px-3 text-sm">
                <input name="role" type="radio" value={value} defaultChecked={value === 'owner'} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <Button className="w-full" type="submit">Create secure account</Button>
      </form>
    </Card>
  );
}
