import { updatePasswordAction } from '@/lib/auth/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type UpdatePasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const params = (await searchParams) ?? {};
  const error = first(params.error);

  return (
    <Card className="w-full max-w-md">
      <Badge tone="success">Secure update</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Choose a new password</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Use a strong password before returning to your care workspace.
      </p>
      {error ? <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
      <form action={updatePasswordAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          New password
          <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="password" type="password" autoComplete="new-password" minLength={12} required />
        </label>
        <label className="block text-sm font-medium">
          Confirm password
          <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required />
        </label>
        <Button className="w-full" type="submit">Update password</Button>
      </form>
    </Card>
  );
}
