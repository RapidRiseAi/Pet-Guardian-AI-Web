import { MessageCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function WhatsAppLinkPage() {
  return (
    <Card className="w-full max-w-lg">
      <Badge tone="info">Account linking preparation</Badge>
      <div className="mt-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessageCircle className="size-7" />
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em]">Link WhatsApp securely</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        This route is ready for the WhatsApp linking flow. The production flow will verify a signed
        code from the web app before any WhatsApp number can access private pet data.
      </p>
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
      <ButtonLink href="/signup" className="mt-6 w-full">
        Create account first
      </ButtonLink>
    </Card>
  );
}
