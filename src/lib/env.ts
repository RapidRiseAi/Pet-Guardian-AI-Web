const requiredPublicEnv = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;
const requiredServerEnv = ['SUPABASE_SERVICE_ROLE_KEY', 'APP_BASE_URL'] as const;

export type PublicEnvKey = (typeof requiredPublicEnv)[number];
export type ServerEnvKey = (typeof requiredServerEnv)[number];

function missing(keys: readonly string[]) {
  return keys.filter((key) => !process.env[key]);
}

export function assertPublicEnv() {
  const missingKeys = missing(requiredPublicEnv);
  if (missingKeys.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required public environment variables: ${missingKeys.join(', ')}`);
  }
}

export function assertServerEnv() {
  const missingKeys = missing([...requiredPublicEnv, ...requiredServerEnv]);
  if (missingKeys.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required server environment variables: ${missingKeys.join(', ')}`);
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'demo-anon-key',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? 'PetGuardian AI <hello@example.com>',
  emailReplyTo: process.env.EMAIL_REPLY_TO,
  botpressWebhookSecret: process.env.BOTPRESS_WEBHOOK_SECRET,
  botpressBotId: process.env.BOTPRESS_BOT_ID,
  appBaseUrl:
    process.env.APP_BASE_URL ?? process.env.NEXT_PUBLIC_APP_BASE_URL ?? 'http://localhost:3000',
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  posthogKey: process.env.POSTHOG_KEY,
  cronSecret: process.env.CRON_SECRET,
};
