import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import {
  ChipTabs,
  PetProfileCard,
  ReminderCard,
  StickyActionBar,
  TimelineItem,
} from '@/components/ui/primitives';

export default function SitterPage() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="success">Sitter mobile shell</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
          Today&apos;s care tasks and pet instructions.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Sitter screens prioritize thumb-reachable actions, allowed details, and quick care logs on
          mobile while still fitting desktop side navigation.
        </p>
      </GlassCard>
      <ChipTabs items={['Today', 'Assigned pets', 'Incidents', 'Completed']} active="Today" />
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <PetProfileCard
          name="Max"
          details="Allowed: routine, food, emergency contact"
          status="Assigned"
        />
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Care queue</h2>
          <ReminderCard />
          <TimelineItem title="Morning walk logged with note" meta="Completed" tone="success" />
          <TimelineItem title="Evening medication requires confirmation" meta="Due" tone="warning" />
        </Card>
      </section>
      <StickyActionBar>
        <ButtonLink href="/app/sitter/logs" variant="secondary">
          View logs
        </ButtonLink>
        <ButtonLink href="/app/sitter/tasks">Start next task</ButtonLink>
      </StickyActionBar>
    </div>
  );
}
