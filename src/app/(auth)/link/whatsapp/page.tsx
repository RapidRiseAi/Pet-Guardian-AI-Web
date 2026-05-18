import { MessageCircle, ShieldCheck } from 'lucide-react';
import { initiateWhatsAppLinkAction } from '@/lib/auth/actions';
import { getSessionContext } from '@/lib/auth/guards';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type WhatsAppLinkPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WhatsAppLinkPage({ searchParams }: WhatsAppLinkPageProps) {
  const context = await getSessionContext();
  const params = (await searchParams) ?? {};
  const error = first(params.error);
  const success = first(params.success);

  return (
    <Card className="w-full max-w-lg">
      <Badge tone="info">Account linking preparation</Badge>
      <div className="mt-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessageCircle className="size-7" />
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em]">Link WhatsApp securely</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Generate a short-lived linking code before any WhatsApp number can access reminders or pet data through the assistant.
      </p>
      {error ? <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? <p className="mt-4 rounded-2xl border border-success/30 bg-success/5 p-3 text-sm text-success">{success}</p> : null}
      <div className="mt-5 rounded-2xl border border-border bg-secondary p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-1 size-5 text-primary" />
          <div>
            <p className="font-semibold">Privacy rule</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Unlinked numbers will never receive pet records, reminders, or emergency contacts.
            </p>
          </div>
        </div>
      </div>
      {context.userId ? (
        <form action={initiateWhatsAppLinkAction} className="mt-6 space-y-4">
          <input type="hidden" name="source" value="/link/whatsapp" />
          <label className="block text-sm font-medium">
            WhatsApp number
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-foreground outline-none transition focus:border-primary" name="phoneNumber" type="tel" defaultValue={context.profile?.phone ?? ''} placeholder="+15550001001" required />
          </label>
          <Button className="w-full" type="submit">Create linking code</Button>
        </form>
      ) : (
        <ButtonLink href="/login?next=/link/whatsapp" className="mt-6 w-full">Log in to link WhatsApp</ButtonLink>
      )}
    </Card>
  );
}
