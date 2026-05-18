import type { UserRole } from '@/types/roles';

export type SessionContext = {
  userId: string | null;
  role: UserRole | null;
  onboardingComplete: boolean;
};

export function isAuthenticated(context: SessionContext) {
  return Boolean(context.userId);
}

export function hasRole(context: SessionContext, allowed: UserRole[]) {
  return Boolean(context.role && allowed.includes(context.role));
}

export function requireRole(context: SessionContext, allowed: UserRole[]) {
  if (!isAuthenticated(context)) {
    return { allowed: false, reason: 'Sign in to continue.' } as const;
  }

  if (!hasRole(context, allowed)) {
    return { allowed: false, reason: 'Your current role cannot access this workspace.' } as const;
  }

  return { allowed: true, reason: null } as const;
}
