'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appSidebarSections, roleWorkspaceMeta } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { shellIcons, type ShellIcon } from './icons';

function isActive(pathname: string, href: string) {
  if (href === '/app') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-card/70 p-4 backdrop-blur-xl md:flex md:flex-col">
      <Link href="/" className="focus-ring flex items-center gap-3 rounded-2xl p-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <shellIcons.paw className="size-5" />
        </div>
        <div>
          <p className="font-semibold">PetGuardian AI</p>
          <p className="text-xs text-muted-foreground">Care coordination</p>
        </div>
      </Link>
      <div className="mt-5 rounded-3xl border border-primary/20 bg-primary/10 p-3">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Role-safe shell</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {Object.values(roleWorkspaceMeta)
            .map((role) => role.label.split(' ')[0])
            .join(' • ')}
        </p>
      </div>
      <div className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
        {appSidebarSections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center justify-between px-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {section.title}
              </p>
              {section.density ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                  {section.density === 'operational' ? 'Dense' : 'Mobile'}
                </span>
              ) : null}
            </div>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const Icon = shellIcons[item.icon as ShellIcon];
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'focus-ring flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-muted-foreground transition duration-200 ease-premium hover:bg-secondary/70 hover:text-foreground',
                      active && 'bg-primary/10 text-primary shadow-lift',
                    )}
                  >
                    {Icon ? <Icon className="size-4" /> : null}
                    <span className="flex-1">{item.label}</span>
                    {active ? <span className="size-1.5 rounded-full bg-primary" /> : null}
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
