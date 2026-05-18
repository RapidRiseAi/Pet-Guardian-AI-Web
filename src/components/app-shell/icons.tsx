import {
  Bell,
  ClipboardList,
  CreditCard,
  Home,
  Inbox,
  PawPrint,
  Settings,
  Shield,
  Sparkles,
  Stethoscope,
  User,
} from 'lucide-react';

export const shellIcons = {
  bell: Bell,
  clipboard: ClipboardList,
  'credit-card': CreditCard,
  home: Home,
  inbox: Inbox,
  paw: PawPrint,
  settings: Settings,
  shield: Shield,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  user: User,
} as const;

export type ShellIcon = keyof typeof shellIcons;
