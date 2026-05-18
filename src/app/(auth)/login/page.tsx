import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Welcome back</p>
      <h1 className="mt-3 text-3xl font-semibold">Log in to PetGuardian AI</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Supabase email auth will be connected in the authentication prompt.
      </p>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
          Email address
        </div>
        <div className="rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
          Password
        </div>
        <ButtonLink href="/app" className="w-full">
          Continue to app shell
        </ButtonLink>
      </div>
    </Card>
  );
}
