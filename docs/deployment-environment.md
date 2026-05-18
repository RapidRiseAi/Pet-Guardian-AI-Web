# Deployment and Supabase environment variables

## Vercel app variables

The Next.js app needs these variables in Vercel for production and preview deployments:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public Supabase project URL used by browser and server clients. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key used with RLS-protected client/session calls. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes for server-only admin flows | Service-role key for trusted server operations only. Never expose to the browser. |
| `APP_BASE_URL` | Yes | Canonical app URL used for auth email redirects and transactional links. |
| `NEXT_PUBLIC_APP_BASE_URL` | Recommended | Public canonical app URL for client-visible links. |
| `RESEND_API_KEY` | Later notification flows | Transactional email provider key. |
| `EMAIL_FROM` / `EMAIL_REPLY_TO` | Later notification flows | Sender and reply-to email configuration. |
| `BOTPRESS_WEBHOOK_SECRET` / `BOTPRESS_BOT_ID` | Later assistant flows | Botpress assistant verification/configuration. |
| `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` / `WHATSAPP_VERIFY_TOKEN` | Only if using direct Meta WhatsApp | WhatsApp Business API credentials. |
| `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_AUTH_TOKEN` | Optional | Error monitoring and release automation. |
| `POSTHOG_KEY` | Optional | Product analytics. |
| `CRON_SECRET` | Later background jobs | Protects cron routes. |

## Supabase migrations in GitHub CI

Supabase SQL migrations do **not** need to be placed in Vercel. They must be applied with the Supabase CLI or a Supabase-connected CI job. If you run migrations from GitHub Actions, store these as GitHub repository secrets:

| Secret | Purpose |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token for `supabase link` / `supabase db push`. |
| `SUPABASE_PROJECT_REF` | Target Supabase project reference. |
| `SUPABASE_DB_PASSWORD` | Database password used by the CLI for remote migrations. |

For local development, run `supabase db reset` after linking your project or using the local Supabase stack.

## Storage RLS note

Do not run `alter table storage.objects enable row level security` in project migrations. Supabase owns and manages the Storage schema/table, and attempting to alter it can fail with `ERROR: must be owner of table objects (SQLSTATE 42501)`. The project migration only creates Storage policies for the `pet-files` and `pet-avatars` buckets; Supabase already has RLS enabled for `storage.objects`.
