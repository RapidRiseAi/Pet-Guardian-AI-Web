import Link from 'next/link';
import { appSidebarSections } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { shellIcons, type ShellIcon } from './icons';

export function Sidebar({ activeHref = '/app' }: { activeHref?: string }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-card/65 p-4 backdrop-blur-xl md:block">
      <Link href="/" className="focus-ring flex items-center gap-3 rounded-2xl p-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <shellIcons.paw className="size-5" />
        </div>
        <div>
          <p className="font-semibold">PetGuardian AI</p>
          <p className="text-xs text-muted-foreground">Care coordination</p>
        </div>
      </Link>
      <div className="mt-6 space-y-6">
        {appSidebarSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {section.title}
            </p>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const Icon = shellIcons[item.icon as ShellIcon];
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'focus-ring flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-muted-foreground transition',
                      active && 'bg-primary/12 text-primary',
                    )}
                  >
                    {Icon ? <Icon className="size-4" /> : null}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
