import type { ReactNode } from 'react';
import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden border-r border-border bg-card/40 p-10 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <PawPrint className="size-5" />
          </span>
          PetGuardian AI
        </Link>
        <div>
          <p className="max-w-xl text-5xl font-semibold leading-tight">
            Your pet's care, history, and trusted access in one place.
          </p>
          <p className="mt-5 max-w-lg text-muted-foreground">
            A calm, permission-aware home for routines, records, reminders, QR sharing, and
            partners.
          </p>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        {children}
      </section>
    </main>
  );
}
