import { env } from '@/lib/env';

export const botpressConfig = {
  botId: env.botpressBotId,
  webhookSecret: env.botpressWebhookSecret,
  enabled: Boolean(env.botpressBotId),
};
