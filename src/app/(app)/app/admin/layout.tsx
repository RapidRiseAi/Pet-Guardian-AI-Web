import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth/guards';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const context = await getSessionContext();
  if (!context.userId) redirect('/login');
  if (context.role !== 'admin') redirect('/app');
  return <>{children}</>;
}
