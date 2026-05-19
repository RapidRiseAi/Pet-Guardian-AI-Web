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

Vercel variables let the deployed Next.js app talk to Supabase. They do **not** apply database migrations by themselves.

## Supabase GitHub integration versus GitHub Actions

There are two different ways migrations can be pushed from GitHub:

### Option A: Supabase Dashboard GitHub integration

If you connected this repository from **Supabase Dashboard > Project Settings > Integrations > GitHub Integration**, Supabase reads the committed `supabase/` directory from GitHub. Configure the integration with:

- **Repository:** this repo.
- **Working directory:** `.` because the `supabase/` folder is at the repository root.
- **Automatic branching:** optional; creates Supabase preview branches for GitHub branches/PRs.
- **Deploy to production:** enable this if you want migrations applied automatically when changes land on your configured production branch.

With this managed Supabase integration, you usually do **not** need GitHub repository secrets just to run migrations. The target database is the Supabase project where you enabled the integration, regardless of which Google account owns that Supabase project. New migration files in `supabase/migrations` are what Supabase applies; `supabase/seed.sql` is for preview/local seed data and is not merged into production by default.

### Option B: Your own GitHub Actions workflow

This repo currently does not include a GitHub Actions workflow that runs `supabase db push`. If you add one later, store these as GitHub repository secrets:

| Secret | Purpose |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token for `supabase link` / `supabase db push`. |
| `SUPABASE_PROJECT_REF` | Target Supabase project reference. |
| `SUPABASE_DB_PASSWORD` | Database password used by the CLI for remote migrations. |

For local development, run `supabase db reset` after linking your project or using the local Supabase stack.

## Storage RLS note

Do not run `alter table storage.objects enable row level security` in project migrations. Supabase owns and manages the Storage schema/table, and attempting to alter it can fail with `ERROR: must be owner of table objects (SQLSTATE 42501)`. The project migration only creates Storage policies for the `pet-files` and `pet-avatars` buckets; Supabase already has RLS enabled for `storage.objects`.

## `example.supabase.co` fetch failures

If sign-up/sign-in throws `getaddrinfo ENOTFOUND example.supabase.co`, the deployment is using the old placeholder fallback instead of your real Supabase project URL. Verify these in **Vercel Project Settings > Environment Variables** for the exact environment you are deploying (`Production`, `Preview`, and/or `Development`):

- `NEXT_PUBLIC_SUPABASE_URL` should look like `https://<your-project-ref>.supabase.co`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be the anon public key from the same Supabase project.
- After changing environment variables, redeploy the Vercel deployment; old builds do not automatically pick up new values.

The app no longer falls back to `https://example.supabase.co`; missing Supabase variables now produce a clearer configuration error instead of a DNS failure.
