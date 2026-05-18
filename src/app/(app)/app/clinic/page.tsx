import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { OperationalTable, SplitPane, StatTile, TimelineItem } from '@/components/ui/primitives';
import { PermissionBanner } from '@/components/ui/states';

const rows = [
  { Patient: 'Max', Owner: 'Xander B.', Access: 'Approved 14d', Next: 'Vaccination review' },
  { Patient: 'Luna', Owner: 'A. Naidoo', Access: 'Requested', Next: 'Awaiting owner' },
  { Patient: 'Bella', Owner: 'M. Jacobs', Access: 'Expires today', Next: 'Follow-up note' },
];

export default function ClinicPage() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="info">Clinic shell</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
          Request access, review approved history, and log visits.
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Clinic workspaces use denser desktop layouts, patient tables, sticky side panels, and
          permission language that makes owner approval clear.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/app/clinic/requests">Review requests</ButtonLink>
          <ButtonLink href="/app/clinic/visits" variant="secondary">
            Log a visit
          </ButtonLink>
        </div>
      </GlassCard>

      <section className="grid gap-4 md:grid-cols-3">
        <StatTile label="Requests" value="8" detail="3 awaiting owner approval" tone="warning" />
        <StatTile label="Patients" value="42" detail="Approved active records" tone="success" />
        <StatTile label="Follow-ups" value="12" detail="Next 14 days" tone="info" />
      </section>

      <SplitPane
        main={<OperationalTable columns={['Patient', 'Owner', 'Access', 'Next']} rows={rows} />}
        aside={
          <>
            <PermissionBanner
              title="Owner-approved access only"
              description="Clinic users see only records with an active grant and every visit write is auditable."
            />
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Recent clinical activity</h2>
              <TimelineItem title="Visit note drafted for Max" meta="Visit" tone="info" />
              <TimelineItem
                title="Access request sent to Luna's owner"
                meta="Request"
                tone="warning"
              />
            </Card>
          </>
        }
      />
    </div>
  );
}
