import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'APP_BASE_URL',
];

const optional = [
  'DATABASE_URL',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'EMAIL_REPLY_TO',
  'BOTPRESS_WEBHOOK_SECRET',
  'BOTPRESS_BOT_ID',
  'WHATSAPP_ACCESS_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
  'WHATSAPP_VERIFY_TOKEN',
  'NEXT_PUBLIC_APP_BASE_URL',
  'NEXT_PUBLIC_SENTRY_DSN',
  'SENTRY_AUTH_TOKEN',
  'POSTHOG_KEY',
  'CRON_SECRET',
  'STORAGE_BUCKET_PUBLIC_URL',
];

function loadDotEnvFile(filename) {
  const filepath = resolve(process.cwd(), filename);
  if (!existsSync(filepath)) return;

  const lines = readFileSync(filepath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadDotEnvFile('.env.local');
loadDotEnvFile('.env');

const missingRequired = required.filter((key) => !process.env[key]);
const missingOptional = optional.filter((key) => !process.env[key]);

if (missingRequired.length > 0) {
  console.error('Missing required PetGuardian AI environment variables:');
  for (const key of missingRequired) console.error(`- ${key}`);
  console.error(
    '\nAdd them in Vercel Project Settings → Environment Variables or local .env.local.',
  );
  process.exit(1);
}

console.log('Required PetGuardian AI environment variables are present.');
if (missingOptional.length > 0) {
  console.log(`Optional variables not set yet: ${missingOptional.join(', ')}`);
}
