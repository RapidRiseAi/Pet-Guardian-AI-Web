import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell/app-shell';
import { getSessionContext } from '@/lib/auth/guards';

export default async function ProtectedAppLayout({ children }: { children: ReactNode }) {
  const context = await getSessionContext();

  if (!context.userId) redirect('/login');
  if (!context.onboardingComplete) redirect('/onboarding');

  return <AppShell>{children}</AppShell>;
}
