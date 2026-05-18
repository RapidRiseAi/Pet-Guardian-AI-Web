'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mobileNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { shellIcons, type ShellIcon } from './icons';

function isActive(pathname: string, href: string) {
  if (href === '/app') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/[0.94] px-2 pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mobileNavItems.map((item) => {
          const Icon = shellIcons[item.icon as ShellIcon];
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'focus-ring flex min-h-14 flex-col items-center justify-center rounded-2xl text-xs font-medium text-muted-foreground transition duration-200 ease-premium',
                active && 'bg-primary/10 text-primary shadow-glow',
              )}
            >
              {Icon ? <Icon className="mb-1 size-5" /> : null}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
