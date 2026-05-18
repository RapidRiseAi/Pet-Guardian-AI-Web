import { env } from '@/lib/env';

export const resendConfig = {
  apiKey: env.resendApiKey,
  from: env.emailFrom,
  replyTo: env.emailReplyTo,
  enabled: Boolean(env.resendApiKey),
};
