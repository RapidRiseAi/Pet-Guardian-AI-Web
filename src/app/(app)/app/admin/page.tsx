import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { OperationalTable, SplitPane, StatTile, TimelineItem } from '@/components/ui/primitives';
import { PermissionBanner } from '@/components/ui/states';

const rows = [
  { Queue: 'Partner approvals', Count: '5', Owner: 'Operations', Risk: 'Medium' },
  { Queue: 'Support escalations', Count: '2', Owner: 'Admin', Risk: 'High' },
  { Queue: 'Referral payouts', Count: '18', Owner: 'Growth', Risk: 'Low' },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="warning">Admin operations shell</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
          Dense operational control without sacrificing trust.
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Admin pages use desktop-first tables, batch-ready navigation, audit prompts, and visible
          permission boundaries for support actions.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/app/admin/users">Manage users</ButtonLink>
          <ButtonLink href="/app/admin/audit" variant="secondary">
            Open audit log
          </ButtonLink>
        </div>
      </GlassCard>

      <section className="grid gap-4 md:grid-cols-4">
        <StatTile label="Users" value="1.2k" detail="Active accounts" tone="success" />
        <StatTile label="Partners" value="37" detail="Clinics and sitters" tone="info" />
        <StatTile label="Flags" value="7" detail="Needs moderation" tone="warning" />
        <StatTile label="Audits" value="98" detail="Events today" />
      </section>

      <SplitPane
        main={<OperationalTable columns={['Queue', 'Count', 'Owner', 'Risk']} rows={rows} />}
        aside={
          <>
            <PermissionBanner
              title="Support access is escalated"
              description="Admin tools should require explicit reason capture before sensitive pet or user data is opened."
            />
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Audit highlights</h2>
              <TimelineItem title="Clinic partner moved to review" meta="Partner" tone="warning" />
              <TimelineItem title="Referral rule draft updated" meta="Growth" tone="info" />
            </Card>
          </>
        }
      />
    </div>
  );
}
