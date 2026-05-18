import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { assertPublicEnv } from '@/lib/env';
import './globals.css';

assertPublicEnv();

export const metadata: Metadata = {
  title: {
    default: 'PetGuardian AI',
    template: '%s | PetGuardian AI',
  },
  description: 'Premium pet care coordination, reminders, records, QR access, and trusted sharing.',
  applicationName: 'PetGuardian AI',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PetGuardian AI',
  },
};

export const viewport: Viewport = {
  themeColor: '#081111',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
