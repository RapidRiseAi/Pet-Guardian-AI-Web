import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { PetProfileCard, ReminderCard, StatTile, TimelineItem } from '@/components/ui/primitives';

export default function AppPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <GlassCard>
          <Badge tone="success">Owner dashboard foundation</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
            Today&apos;s care, records, and access.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The base app shell is ready for authenticated owner, sitter, clinic, and admin
            workflows.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/app/pets/new">Add first pet</ButtonLink>
            <ButtonLink href="/app/_ui" variant="secondary">
              View UI kit
            </ButtonLink>
          </div>
        </GlassCard>
        <PetProfileCard name="Max" details="Care profile preview • QR ready" status="Protected" />
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <StatTile label="Reminders" value="4" detail="Due this week" />
        <StatTile label="Access" value="2" detail="Active grants" />
        <StatTile label="Documents" value="12" detail="Secure files" />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold">Upcoming</h2>
          <ReminderCard />
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <TimelineItem title="QR card prepared for controlled sharing" meta="System" />
          <TimelineItem
            title="App shell installed with mobile bottom navigation"
            meta="Foundation"
            tone="success"
          />
        </Card>
      </section>
    </div>
  );
}
