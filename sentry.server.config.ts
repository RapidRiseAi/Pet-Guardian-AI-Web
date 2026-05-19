import * as Sentry from '@sentry/nextjs';
import { sentryConfig } from '@/lib/integrations/sentry';

if (sentryConfig.enabled) {
  Sentry.init({
    dsn: sentryConfig.dsn,
    tracesSampleRate: sentryConfig.tracesSampleRate,
  });
}
