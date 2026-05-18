import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import {
  DocumentCard,
  PetProfileCard,
  SegmentedControl,
  StatTile,
  TimelineItem,
} from '@/components/ui/primitives';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PermissionBanner,
  SuccessState,
} from '@/components/ui/states';

export function UiKitShowcase() {
  return (
    <div className="space-y-8">
      <section>
        <Badge tone="info">Internal showcase</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">PetGuardian UI kit</h1>
        <p className="mt-2 text-muted-foreground">
          Reusable primitives for the mobile-first premium care platform.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        <StatTile label="Pets" value="2" detail="Profiles ready" />
        <StatTile label="Due" value="4" detail="Today" />
        <StatTile label="Grants" value="3" detail="Active shares" />
        <StatTile label="Docs" value="18" detail="Organised files" />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <PetProfileCard
          name="Max"
          details="Golden Retriever • 6 years • Microchip saved"
          status="Complete"
        />
        <GlassCard className="space-y-4">
          <SegmentedControl
            options={['Overview', 'Care', 'Medical', 'Sharing']}
            active="Overview"
          />
          <div className="flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
          </div>
          <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </GlassCard>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <DocumentCard title="Prescription" meta="PDF • private medical record" />
          <TimelineItem title="Clinic access approved for 14 days" meta="Access" tone="success" />
          <TimelineItem title="Medication reminder missed" meta="Overdue" tone="warning" />
        </Card>
        <div className="space-y-4">
          <LoadingState />
          <SuccessState title="Saved" description="Your pet care profile has been updated." />
          <ErrorState title="Could not save" description="Check your connection and try again." />
          <PermissionBanner
            title="Permission required"
            description="This role cannot access private medical files."
          />
        </div>
      </section>
      <EmptyState
        title="No pets yet"
        description="Create your first pet profile to unlock care coordination."
        actionHref="/app/pets/new"
        actionLabel="Add pet"
      />
      <ButtonLink href="/app">Back to dashboard</ButtonLink>
    </div>
  );
}
