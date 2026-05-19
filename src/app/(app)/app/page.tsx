import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { PetProfileCard, ReminderCard, StatTile, TimelineItem } from '@/components/ui/primitives';

export default function AppPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <GlassCard>
          <Badge tone="success">Owner command center</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Today&apos;s care, reminders, and trusted access.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Review upcoming reminders, pending requests, and recent care updates without leaving your home workspace.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ButtonLink href="/app/pets/new">Add first pet</ButtonLink>
            <ButtonLink href="/app/assistant" variant="secondary">Open assistant</ButtonLink>
          </div>
        </GlassCard>
        <PetProfileCard name="Max" details="Medication reminder at 18:00 • QR ready" status="Protected" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Reminders" value="4" detail="Due this week" />
        <StatTile label="Pending requests" value="2" detail="Clinic approvals" tone="warning" />
        <StatTile label="Active grants" value="3" detail="Sitter + clinic" tone="success" />
        <StatTile label="Documents" value="12" detail="Secure files" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold">Upcoming reminders</h2>
          <ReminderCard />
          <ButtonLink href="/app/reminders" variant="secondary">Manage reminders</ButtonLink>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Recent timeline</h2>
          <TimelineItem title="Clinic access request pending for Max" meta="Access" tone="warning" />
          <TimelineItem title="Evening feeding reminder acknowledged" meta="Reminder" tone="success" />
          <TimelineItem title="QR access card reviewed" meta="Security" />
        </Card>
      </section>
    </div>
  );
}
