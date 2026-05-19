import type { NavItem, UserRole } from '@/types/roles';

export type NavSection = {
  title: string;
  role?: UserRole;
  density?: 'comfortable' | 'operational';
  items: NavItem[];
};

export const mobileNavItems: NavItem[] = [
  { label: 'Home', href: '/app', icon: 'home', roles: ['owner', 'sitter'] },
  { label: 'Pets', href: '/app/pets', icon: 'paw', roles: ['owner', 'sitter'] },
  { label: 'Tasks', href: '/app/sitter/tasks', icon: 'clipboard', roles: ['sitter'] },
  { label: 'Assistant', href: '/app/assistant', icon: 'sparkles' },
  { label: 'Account', href: '/app/account', icon: 'user' },
];

export const appSidebarSections: NavSection[] = [
  {
    title: 'Owner workspace',
    role: 'owner',
    density: 'comfortable',
    items: [
      { label: 'Dashboard', href: '/app', icon: 'home' },
      { label: 'Pets', href: '/app/pets', icon: 'paw' },
      { label: 'Reminders', href: '/app/reminders', icon: 'bell' },
      { label: 'Assistant', href: '/app/assistant', icon: 'sparkles' },
    ],
  },
  {
    title: 'Sitter workspace',
    role: 'sitter',
    density: 'comfortable',
    items: [
      { label: 'Overview', href: '/app/sitter', icon: 'home' },
      { label: 'Assigned pets', href: '/app/sitter/assigned-pets', icon: 'paw' },
      { label: 'Care tasks', href: '/app/sitter/tasks', icon: 'clipboard' },
      { label: 'Care logs', href: '/app/sitter/logs', icon: 'inbox' },
    ],
  },
  {
    title: 'Clinic workspace',
    role: 'clinic',
    density: 'operational',
    items: [
      { label: 'Clinic home', href: '/app/clinic', icon: 'stethoscope' },
      { label: 'Requests', href: '/app/clinic/requests', icon: 'inbox' },
      { label: 'Patients', href: '/app/clinic/patients', icon: 'paw' },
      { label: 'Visits', href: '/app/clinic/visits', icon: 'clipboard' },
    ],
  },
  {
    title: 'Admin operations',
    role: 'admin',
    density: 'operational',
    items: [
      { label: 'Admin home', href: '/app/admin', icon: 'shield' },
      { label: 'Users', href: '/app/admin/users', icon: 'user' },
      { label: 'Pets', href: '/app/admin/pets', icon: 'paw' },
      { label: 'Partners', href: '/app/admin/partners', icon: 'stethoscope' },
      { label: 'Referrals', href: '/app/admin/referrals', icon: 'sparkles' },
      { label: 'Audit', href: '/app/admin/audit', icon: 'clipboard' },
      { label: 'Content', href: '/app/admin/content', icon: 'settings' },
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

export const roleWorkspaceMeta: Record<
  UserRole,
  { label: string; eyebrow: string; description: string; homeHref: string }
> = {
  owner: {
    label: 'Owner workspace',
    eyebrow: 'Mobile-first care command centre',
    description: 'Profiles, routines, reminders, documents, QR sharing, and trusted access.',
    homeHref: '/app',
  },
  sitter: {
    label: 'Sitter workspace',
    eyebrow: 'Thumb-ready care execution',
    description: 'Assigned pets, allowed care details, due tasks, logs, and incident notes.',
    homeHref: '/app/sitter',
  },
  clinic: {
    label: 'Clinic workspace',
    eyebrow: 'Desktop patient access review',
    description:
      'Owner-approved requests, patient summaries, visits, recommendations, and follow-ups.',
    homeHref: '/app/clinic',
  },
  admin: {
    label: 'Admin operations',
    eyebrow: 'Dense operational control',
    description: 'Users, partners, referrals, moderation, billing settings, support, and audit trails.',
    homeHref: '/app/admin',
  },
};
