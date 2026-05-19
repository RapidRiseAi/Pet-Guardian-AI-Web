import Link from 'next/link';
import { signInAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const error = first(params.error);
  const success = first(params.success);
  const next = first(params.next) ?? '/app';

  return (
    <Card className="w-full max-w-md">
      <Badge tone="info">Secure email sign-in</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Log in to PetGuardian AI</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Continue to your role-aware workspace with Supabase-backed session handling.
      </p>
      {error ? <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? <p className="mt-4 rounded-2xl border border-success/30 bg-success/5 p-3 text-sm text-success">{success}</p> : null}
      <form action={signInAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm font-medium">
          Email address
          <input
            className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <Button className="w-full" type="submit">Continue securely</Button>
      </form>
      <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <Link className="transition hover:text-foreground" href="/reset-password">Forgot password?</Link>
        <Link className="transition hover:text-foreground" href="/signup">Create account</Link>
      </div>
    </Card>
  );
}
