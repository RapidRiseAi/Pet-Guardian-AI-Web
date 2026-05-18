'use client';

import { Bell, Search, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { roleWorkspaceMeta } from '@/config/navigation';
import type { UserRole } from '@/types/roles';

function getRoleFromPath(pathname: string): UserRole {
  if (pathname.startsWith('/app/admin')) return 'admin';
  if (pathname.startsWith('/app/clinic')) return 'clinic';
  if (pathname.startsWith('/app/sitter')) return 'sitter';
  return 'owner';
}

export function TopBar({ title }: { title?: string }) {
  const pathname = usePathname();
  const role = getRoleFromPath(pathname);
  const meta = roleWorkspaceMeta[role];
  const searchPlaceholder =
    role === 'admin'
      ? 'Search users, partners, audit events'
      : role === 'clinic'
        ? 'Search patients, requests, visits'
        : 'Search pets, reminders, access';

  return (
    <header className="safe-top sticky top-0 z-40 border-b border-border bg-background/[0.84] px-4 pb-3 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {meta.eyebrow}
          </p>
          <h1 className="truncate text-lg font-semibold md:text-2xl">{title ?? meta.label}</h1>
        </div>
        <div className="hidden min-h-11 min-w-[18rem] items-center gap-2 rounded-full border border-border bg-secondary px-4 text-sm text-muted-foreground lg:flex">
          <Search className="size-4" />
          {searchPlaceholder}
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="success" className="hidden sm:inline-flex">
            <ShieldCheck className="mr-1 size-3" /> {meta.label}
          </Badge>
          <button
            className="focus-ring flex size-11 items-center justify-center rounded-full border border-border bg-secondary transition hover:bg-secondary/80"
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
