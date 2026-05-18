import Link from 'next/link';
import { requestPasswordResetAction } from '@/lib/auth/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ResetPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = (await searchParams) ?? {};
  const error = first(params.error);
  const success = first(params.success);

  return (
    <Card className="w-full max-w-md">
      <Badge tone="warning">Password recovery</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Reset your password</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        We&apos;ll send a secure Supabase reset link if the email belongs to a PetGuardian account.
      </p>
      {error ? <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? <p className="mt-4 rounded-2xl border border-success/30 bg-success/5 p-3 text-sm text-success">{success}</p> : null}
      <form action={requestPasswordResetAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Email address
          <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="email" type="email" autoComplete="email" required />
        </label>
        <Button className="w-full" type="submit">Send reset link</Button>
      </form>
      <Link className="mt-5 block text-sm text-muted-foreground transition hover:text-foreground" href="/login">Back to login</Link>
    </Card>
  );
}
