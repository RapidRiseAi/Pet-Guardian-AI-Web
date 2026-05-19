import { Badge } from '@/components/ui/badge';
import { Card, GlassCard } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="space-y-4">
      <GlassCard>
        <Badge tone="info">Billing-ready foundation</Badge>
        <h1 className="mt-3 text-3xl font-semibold">Plan and subscription placeholders</h1>
        <p className="mt-2 text-sm text-muted-foreground">This workspace is structured for future payment provider checkout, invoices, and billing sync without a redesign.</p>
      </GlassCard>
      <div className="grid gap-3 lg:grid-cols-2">
        <Card><p className="font-semibold">Current plan</p><p className="mt-2 text-sm text-muted-foreground">Plan: Starter (placeholder) • Renewal: Not configured</p></Card>
        <Card><p className="font-semibold">Payment method</p><p className="mt-2 text-sm text-muted-foreground">No payment method on file (placeholder for provider tokenized methods).</p></Card>
      </div>
      <Card><p className="font-semibold">Invoices</p><p className="mt-2 text-sm text-muted-foreground">Invoice list and status timeline will appear here after provider integration (draft/open/paid/failed).</p></Card>
    </div>
  );
}
