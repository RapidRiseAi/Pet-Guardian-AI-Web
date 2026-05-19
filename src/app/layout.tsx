import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://petguardian.ai'),
  title: {
    default: 'PetGuardian AI',
    template: '%s | PetGuardian AI',
  },
  description: 'Premium pet care coordination, reminders, records, QR access, and trusted sharing.',
  applicationName: 'PetGuardian AI',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'PetGuardian AI',
    description: 'Your pet\'s care, history, and trusted access in one place.',
    type: 'website',
    url: 'https://petguardian.ai',
    siteName: 'PetGuardian AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetGuardian AI',
    description: 'Calm, trusted pet care coordination for owners, sitters, clinics, and admins.',
  },
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
