import { designTokens } from '@/config/design-tokens';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import {
  ChipTabs,
  DocumentCard,
  DrawerSheet,
  MobileActionPreview,
  OperationalTable,
  PermissionCard,
  PetProfileCard,
  SegmentedControl,
  SplitPane,
  StatTile,
  StepItem,
  TimelineItem,
} from '@/components/ui/primitives';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PermissionBanner,
  SuccessState,
} from '@/components/ui/states';

const adminRows = [
  { Name: 'Cape Town Vet', Role: 'Clinic', Status: 'Pending review', Updated: '2h ago' },
  { Name: 'Maya Jacobs', Role: 'Sitter', Status: 'Active', Updated: 'Today' },
  { Name: 'Support override', Role: 'Admin', Status: 'Audit required', Updated: 'Yesterday' },
];

export function UiKitShowcase() {
  return (
    <div className="space-y-8">
      <section>
        <Badge tone="info">Internal showcase</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">PetGuardian UI kit</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Reusable primitives for the mobile-first premium care platform, including the denser
          clinic and admin desktop patterns.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(designTokens.colors).slice(0, 12).map(([name, value]) => (
          <Card key={name} className="p-4">
            <div className="h-14 rounded-2xl border border-white/10" style={{ background: value }} />
            <p className="mt-3 text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatTile label="Pets" value="2" detail="Profiles ready" tone="success" />
        <StatTile label="Due" value="4" detail="Today" tone="warning" />
        <StatTile label="Grants" value="3" detail="Active shares" tone="info" />
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
          <ChipTabs items={['Timeline', 'Documents', 'QR', 'Permissions']} active="Timeline" />
          <div className="flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </GlassCard>
      </section>

      <SplitPane
        main={
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold">Mobile-first care stack</h2>
            <DocumentCard title="Prescription" meta="PDF • private medical record" />
            <TimelineItem title="Clinic access approved for 14 days" meta="Access" tone="success" />
            <TimelineItem title="Medication reminder missed" meta="Overdue" tone="warning" />
            <MobileActionPreview />
          </Card>
        }
        aside={
          <>
            <PermissionCard />
            <DrawerSheet title="Full-screen sheet pattern">
              <div className="space-y-3">
                <StepItem index={1} title="Confirm role" text="Owner, sitter, clinic, or admin." />
                <StepItem index={2} title="Review scope" text="Show exactly what will be shared." />
              </div>
            </DrawerSheet>
          </>
        }
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Operational table pattern</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Clinic and admin pages use dense tables on desktop and readable cards on mobile.
          </p>
        </div>
        <OperationalTable columns={['Name', 'Role', 'Status', 'Updated']} rows={adminRows} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <LoadingState />
          <SuccessState title="Saved" description="Your pet care profile has been updated." />
          <ErrorState title="Could not save" description="Check your connection and try again." />
          <PermissionBanner
            title="Permission required"
            description="This role cannot access private medical files. Request owner approval first."
          />
        </div>
        <EmptyState
          title="No pets yet"
          description="Create your first pet profile to unlock care coordination. Empty states include guidance and a safe next action."
          actionHref="/app/pets/new"
          actionLabel="Add pet"
        />
      </section>

      <ButtonLink href="/app">Back to dashboard</ButtonLink>
    </div>
  );
}
