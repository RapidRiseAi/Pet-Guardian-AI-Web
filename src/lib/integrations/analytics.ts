import { env } from '@/lib/env';

export const analyticsConfig = {
  provider: 'posthog',
  key: env.posthogKey,
  enabled: Boolean(env.posthogKey),
};

export function trackServerEvent(event: string, properties: Record<string, unknown> = {}) {
  if (!analyticsConfig.enabled) return;
  console.info('[analytics]', event, properties);
}
