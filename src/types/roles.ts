export type UserRole = 'owner' | 'sitter' | 'clinic' | 'admin';

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  roles?: UserRole[];
};

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
