import { CalendarClock, FileText, PawPrint, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StatusTone } from '@/types/roles';

export function StatTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </Card>
  );
}

export function SegmentedControl({ options, active }: { options: string[]; active: string }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-full border border-border bg-secondary/60 p-1">
      {options.map((option) => (
        <button
          key={option}
          className={cn(
            'min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold text-muted-foreground transition',
            option === active && 'bg-primary text-primary-foreground shadow-glow',
          )}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function DrawerSheet({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-t-[2rem] border border-border bg-card p-5 shadow-panel md:rounded-2xl">
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted md:hidden" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function StepItem({ index, title, text }: { index: number; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {index}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export function TimelineItem({
  title,
  meta,
  tone = 'info',
}: {
  title: string;
  meta: string;
  tone?: StatusTone;
}) {
  return (
    <div className="flex gap-3 border-l border-border pl-4">
      <span className="-ml-[1.35rem] mt-1 size-2 rounded-full bg-primary" />
      <div>
        <Badge tone={tone}>{meta}</Badge>
        <p className="mt-2 font-medium">{title}</p>
      </div>
    </div>
  );
}

export function DocumentCard({ title, meta }: { title: string; meta: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
        <FileText className="size-5" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{meta}</p>
      </div>
    </Card>
  );
}

export function PetProfileCard({
  name,
  details,
  status,
}: {
  name: string;
  details: string;
  status: string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-gradient-to-br from-primary/20 via-secondary to-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-background/60 text-primary">
            <PawPrint className="size-7" />
          </div>
          <Badge tone="success">{status}</Badge>
        </div>
        <h3 className="mt-5 text-2xl font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{details}</p>
      </div>
    </Card>
  );
}

export function PermissionCard() {
  return (
    <Card className="border-primary/25 bg-primary/5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 size-5 text-primary" />
        <div>
          <p className="font-semibold">Permission-aware by default</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Owners control what sitters, clinics, assistants, and emergency viewers can see.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function ReminderCard() {
  return (
    <Card className="flex items-center gap-3 p-4">
      <CalendarClock className="size-5 text-warning" />
      <div>
        <p className="font-semibold">Medication reminder</p>
        <p className="text-sm text-muted-foreground">Due today at 18:00 • Email + in-app</p>
      </div>
    </Card>
  );
}
