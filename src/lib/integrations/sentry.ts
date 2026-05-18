import { env } from '@/lib/env';

export const sentryConfig = {
  dsn: env.sentryDsn,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1,
  enabled: Boolean(env.sentryDsn),
};
