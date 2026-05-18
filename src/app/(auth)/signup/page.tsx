import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Create account</p>
      <h1 className="mt-3 text-3xl font-semibold">Set up your pet profile in a few minutes.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Role-aware onboarding and email verification will be connected in prompt 4.
      </p>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
          Full name
        </div>
        <div className="rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
          Email address
        </div>
        <ButtonLink href="/app/pets/new" className="w-full">
          Start with your first pet
        </ButtonLink>
      </div>
    </Card>
  );
}
