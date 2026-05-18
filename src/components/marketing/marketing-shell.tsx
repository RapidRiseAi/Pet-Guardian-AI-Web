import Link from 'next/link';
import type { ReactNode } from 'react';
import { PawPrint } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';

const links = [
  ['How it works', '/how-it-works'],
  ['Owners', '/for-owners'],
  ['Sitters', '/for-sitters'],
  ['Clinics', '/for-clinics'],
  ['Pricing', '/pricing'],
  ['FAQ', '/faq'],
];

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="safe-top sticky top-0 z-50 border-b border-border bg-background/[0.78] px-4 pb-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="focus-ring flex items-center gap-3 rounded-2xl">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <PawPrint className="size-5" />
            </span>
            <span className="font-semibold">PetGuardian AI</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ButtonLink href="/login" variant="ghost" className="hidden sm:inline-flex">
              Log in
            </ButtonLink>
            <ButtonLink href="/signup">Start</ButtonLink>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
