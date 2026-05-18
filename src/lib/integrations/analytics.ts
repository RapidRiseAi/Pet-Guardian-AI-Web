import { env } from '@/lib/env';

export const analyticsConfig = {
  provider: 'posthog',
  key: env.posthogKey,
  enabled: Boolean(env.posthogKey),
};
