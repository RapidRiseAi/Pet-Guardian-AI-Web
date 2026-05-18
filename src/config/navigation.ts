import type { NavItem } from '@/types/roles';

export const mobileNavItems: NavItem[] = [
  { label: 'Home', href: '/app', icon: 'home' },
  { label: 'Pets', href: '/app/pets', icon: 'paw' },
  { label: 'Reminders', href: '/app/reminders', icon: 'bell' },
  { label: 'Assistant', href: '/app/assistant', icon: 'sparkles' },
  { label: 'Account', href: '/app/account', icon: 'user' },
];

export const appSidebarSections = [
  {
    title: 'Owner workspace',
    items: [
      { label: 'Dashboard', href: '/app', icon: 'home' },
      { label: 'Pets', href: '/app/pets', icon: 'paw' },
      { label: 'Reminders', href: '/app/reminders', icon: 'bell' },
      { label: 'Assistant', href: '/app/assistant', icon: 'sparkles' },
    ],
  },
  {
    title: 'Partner workspaces',
    items: [
      { label: 'Sitter', href: '/app/sitter', icon: 'clipboard' },
      { label: 'Clinic', href: '/app/clinic', icon: 'stethoscope' },
      { label: 'Admin', href: '/app/admin', icon: 'shield' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Notifications', href: '/app/notifications', icon: 'inbox' },
      { label: 'Billing', href: '/app/billing', icon: 'credit-card' },
      { label: 'Settings', href: '/app/settings', icon: 'settings' },
    ],
  },
];
