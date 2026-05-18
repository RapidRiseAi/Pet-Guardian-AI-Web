import { CalendarClock, FileText, PawPrint, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StatusTone } from '@/types/roles';

export function StatTile({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  detail: string;
  tone?: StatusTone;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <Badge tone={tone}>{tone === 'neutral' ? 'Live' : tone}</Badge>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{value}</p>
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
            'min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold text-muted-foreground transition duration-200 ease-premium hover:text-foreground',
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

export function ChipTabs({ items, active }: { items: string[]; active: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={cn(
            'focus-ring min-h-10 shrink-0 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground',
            item === active && 'border-primary/40 bg-primary/10 text-primary',
          )}
        >
          {item}
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

export function StickyActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="safe-bottom sticky bottom-0 z-20 -mx-4 mt-6 border-t border-border bg-background/[0.92] px-4 pt-3 backdrop-blur-xl md:static md:mx-0 md:rounded-2xl md:border md:bg-card/80 md:p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">{children}</div>
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

export function DocumentCard({
  title,
  meta,
  tone = 'info',
}: {
  title: string;
  meta: string;
  tone?: StatusTone;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
        <FileText className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{meta}</p>
      </div>
      <Badge tone={tone}>Scoped</Badge>
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
        <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">{name}</h3>
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
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Medication reminder</p>
        <p className="text-sm text-muted-foreground">Due today at 18:00 • Email + in-app</p>
      </div>
      <Badge tone="warning">Due</Badge>
    </Card>
  );
}

export function SplitPane({ main, aside }: { main: ReactNode; aside: ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="min-w-0 space-y-4">{main}</div>
      <aside className="space-y-4 lg:sticky lg:top-28">{aside}</aside>
    </div>
  );
}

export function OperationalTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Record<string, string>>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/[0.92] shadow-soft">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="bg-secondary/70 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={Object.values(row).join('-')} className="transition hover:bg-secondary/40">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3 text-muted-foreground">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 p-3 md:hidden">
        {rows.map((row) => (
          <div
            key={Object.values(row).join('-')}
            className="rounded-2xl border border-border bg-secondary/45 p-4"
          >
            {columns.map((column) => (
              <div key={column} className="flex items-start justify-between gap-4 py-1 text-sm">
                <span className="text-muted-foreground">{column}</span>
                <span className="text-right font-medium">{row[column]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileActionPreview() {
  return (
    <StickyActionBar>
      <Button variant="secondary">Save draft</Button>
      <Button>Continue</Button>
    </StickyActionBar>
  );
}
