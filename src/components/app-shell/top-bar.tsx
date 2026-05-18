import { Bell, Search, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TopBar({ title = 'Owner workspace' }: { title?: string }) {
  return (
    <header className="safe-top sticky top-0 z-40 border-b border-border bg-background/82 px-4 pb-3 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            PetGuardian AI
          </p>
          <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
        </div>
        <div className="hidden min-h-11 items-center gap-2 rounded-full border border-border bg-secondary px-4 text-sm text-muted-foreground lg:flex">
          <Search className="size-4" />
          Search pets, reminders, access
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="success" className="hidden sm:inline-flex">
            <ShieldCheck className="mr-1 size-3" /> Role-safe
          </Badge>
          <button
            className="focus-ring flex size-11 items-center justify-center rounded-full border border-border bg-secondary"
            type="button"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
