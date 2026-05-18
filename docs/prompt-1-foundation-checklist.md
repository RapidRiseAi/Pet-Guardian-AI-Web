# Prompt 1 Foundation Checklist

This checklist maps Prompt 1 requirements to the current scaffold and gives a practical review list for PetGuardian AI before moving to Prompt 2.

## Implemented in this foundation

- Next.js 15 App Router project with TypeScript, strict mode, path aliases, scripts, and Vercel config.
- Tailwind CSS, global theme variables, shadcn-style `components.json`, Prettier, and ESLint configuration.
- Manifest-based PWA foundation with theme color, app icons, safe-area styling, and an install prompt component for browsers that emit `beforeinstallprompt`.
- Route groups for public marketing, auth/linking, protected app workspaces, and admin routes under the protected app shell.
- Base app shell with mobile bottom navigation, desktop sidebar, contextual top bar, and installable-app affordance.
- Reusable UI primitives for badges, buttons, cards, stat tiles, empty/error/loading/success states, permission banners, pet cards, document cards, segmented controls, drawer sheets, and timeline items.
- Environment helpers, required variable validation script, Supabase client factories, role guard utilities, and placeholder integration config for Resend, Sentry, analytics, and Botpress.
- README setup instructions, environment variable guidance, route map, PWA notes, and implementation guardrails.

## What to verify manually

1. In Vercel, confirm the project framework is Next.js and the build command is `npm run build`.
2. In Vercel, add required environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_BASE_URL`, and `NEXT_PUBLIC_APP_BASE_URL`.
3. Run `npm run env:check` locally after creating `.env.local`.
4. Run `npm install`, `npm run lint`, `npm run typecheck`, and `npm run build` in an environment with registry access.
5. Visit `/`, `/login`, `/signup`, `/link/whatsapp`, `/app`, `/app/_ui`, `/app/pets`, `/app/clinic`, `/app/sitter`, and `/app/admin`.
6. On a mobile viewport, confirm the bottom navigation and safe-area spacing are visible.
7. On a desktop viewport, confirm the sidebar and top bar are visible.
8. Open `/manifest.webmanifest` and confirm the manifest loads.
9. Confirm no service worker is registered yet; offline caching is intentionally deferred until requirements are defined.

## Not part of Prompt 1

The database schema, RLS policies, real Supabase Auth flows, pet CRUD, reminders, document uploads, QR sharing, sitter logs, clinic visits, notifications, Botpress tools, WhatsApp webhook handling, and admin data tables begin in later prompts.
