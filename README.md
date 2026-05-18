# PetGuardian AI Web

PetGuardian AI is a production-minded, mobile-first web platform for pet care coordination, trusted sharing, reminders, documents, QR access, and role-aware assistant workflows.

## Product direction

The phase 1 experience is designed as a premium installable PWA before a native app. Owners and sitters get a thumb-friendly app-like shell, while clinics and admins get denser desktop workspaces with side navigation, status visibility, and room for tables and split panes.

Core roles:

- **Owner**: manages pets, care records, medical information, reminders, documents, QR cards, and access grants.
- **Sitter**: sees only assigned pets and approved care scope, then logs actions and incidents.
- **Clinic**: requests owner-approved access, reviews allowed history, and logs visits.
- **Admin**: manages platform operations, partners, referrals, support actions, and audit logs.

## Stack

- Next.js 15 App Router with TypeScript
- Tailwind CSS with shadcn-style primitives
- Supabase Auth, Postgres, Storage, RLS, and RPC foundations
- Resend transactional email configuration
- Botpress and WhatsApp integration placeholders
- Sentry and PostHog/Plausible-style analytics placeholders
- Vercel hosting and manifest-based PWA install support

## Folder architecture

```txt
src/
  app/                    # Next.js App Router route groups
    (public)/             # Marketing routes
    (auth)/               # Login/signup shells
    (app)/app/            # Authenticated owner, sitter, clinic, admin routes
  components/
    app-shell/            # Mobile bottom nav, desktop sidebar, top bar
    marketing/            # Public site shell and conversion sections
    showcase/             # Internal UI kit route
    ui/                   # Reusable primitives and states
  config/                 # Navigation and design tokens
  lib/
    auth/                 # Role/session guard helpers
    integrations/         # Resend, Sentry, analytics, Botpress config
    supabase/             # Supabase client factories
  types/                  # Shared TypeScript types
```

## Environment variables

Copy `.env.example` to `.env.local` and fill the values for your local or deployed environment.

Required for production boot:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_BASE_URL`

Optional or integration-specific:

- `DATABASE_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`
- `BOTPRESS_WEBHOOK_SECRET`
- `BOTPRESS_BOT_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_VERIFY_TOKEN`
- `NEXT_PUBLIC_APP_BASE_URL`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `POSTHOG_KEY`
- `CRON_SECRET`
- `STORAGE_BUCKET_PUBLIC_URL`

Environment validation helpers are available for runtime server actions, API routes, middleware, and integration entry points. They are intentionally not called from global layouts during static builds, so Vercel can build scaffold and marketing routes before Supabase keys are configured.

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. Use `npm run env:check` to verify required runtime variables before running production-like flows.

Useful checks:

```bash
npm run env:check
npm run lint
npm run typecheck
npm run build
```

## Current foundation routes

Public:

- `/`
- `/how-it-works`
- `/for-owners`
- `/for-sitters`
- `/for-clinics`
- `/pricing`
- `/faq`
- `/contact`

Auth:

- `/login`
- `/signup`
- `/link/whatsapp`

App:

- `/app`
- `/app/_ui`
- `/app/pets`
- `/app/pets/new`
- `/app/pets/[petId]`
- `/app/pets/[petId]/care`
- `/app/pets/[petId]/medical`
- `/app/pets/[petId]/documents`
- `/app/pets/[petId]/sharing`
- `/app/pets/[petId]/qr`
- `/app/pets/[petId]/timeline`
- `/app/reminders`
- `/app/assistant`
- `/app/notifications`
- `/app/account`
- `/app/billing`
- `/app/settings`
- `/app/sitter`
- `/app/sitter/assigned-pets`
- `/app/sitter/tasks`
- `/app/sitter/logs`
- `/app/clinic`
- `/app/clinic/requests`
- `/app/clinic/patients`
- `/app/clinic/visits`
- `/app/admin`
- `/app/admin/users`
- `/app/admin/pets`
- `/app/admin/partners`
- `/app/admin/referrals`
- `/app/admin/audit`
- `/app/admin/content`

## PWA notes

The app includes a manifest, theme color, placeholder icons, safe-area spacing utilities, an install prompt component, and an app shell designed for installable mobile use. A service worker can be added later once offline caching requirements are defined; the initial scaffold avoids Workbox/`next-pwa` so Vercel deployments stay simple and warning-free.

## Implementation guardrails

- Keep schema changes in `supabase/migrations`.
- Never add secrets to Git.
- Enforce permissions at the database and server layer, not only in client navigation.
- Keep assistant and WhatsApp access behind secure endpoints that resolve verified user context and role scope.
- Every production route should eventually include loading, empty, error, success, and permission-denied states.

## Prompt 1 completion check

See `docs/prompt-1-foundation-checklist.md` for the foundation audit checklist and manual verification steps before continuing to Prompt 2.
