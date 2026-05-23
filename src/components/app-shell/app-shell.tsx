import type { ReactNode } from 'react';
import type { UserRole } from '@/types/roles';
import { BottomNav } from './bottom-nav';
import { InstallPrompt } from './install-prompt';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

export function AppShell({
  children,
  title,
  role,
}: {
  children: ReactNode;
  title?: string;
  role: UserRole | null;
}) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar role={role} />
      <div className="min-w-0 flex-1 pb-[var(--safe-bottom-nav)] md:pb-0">
        <TopBar title={title} />
        <main className="mx-auto max-w-[96rem] px-4 py-6 md:px-8 md:py-8">
          <InstallPrompt />
          {children}
        </main>
      </div>
      <BottomNav role={role} />
    </div>
  );
}
