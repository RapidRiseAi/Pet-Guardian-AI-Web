# Authentication and onboarding flows

Prompt 4 wires the first account trust layer into the app.

## Routes

- `/signup` creates a Supabase email/password account and stores intended role metadata (`owner`, `sitter`, or `clinic`).
- `/login` signs in with Supabase Auth and redirects either to onboarding or the role home workspace.
- `/reset-password` sends a Supabase password reset email.
- `/update-password` accepts Supabase recovery sessions from `/auth/callback` and updates the password.
- `/auth/callback` exchanges Supabase email verification/recovery codes and redirects to the requested next route.
- `/onboarding` completes role-aware setup.
- `/link/whatsapp` prepares a short-lived WhatsApp account-linking code.
- `/app/account` manages profile, notification preferences, security controls, sign-out, and connected channels.

## Role-aware onboarding

Owners get a default household if one does not exist and are sent straight to `/app/pets/new` so they can add their first pet immediately. Sitters complete an assignment-ready profile and land on `/app/sitter`. Clinics provide clinic details, create a pending clinic profile via the secure `create_onboarding_clinic` RPC, and land on `/app/clinic` for approval-state UX.

## Session protection

`src/middleware.ts` protects `/app/*`, refreshes Supabase sessions, redirects anonymous users to `/login`, and sends authenticated users with incomplete onboarding to `/onboarding`. The protected app layout repeats the server-side session/onboarding checks so direct server renders remain guarded.

## Database support

`supabase/migrations/20260518170000_auth_onboarding.sql` adds onboarding fields to `profiles`, creates an auth trigger that mirrors Supabase Auth users into `public.profiles`, and adds RPCs for completing onboarding and creating clinic onboarding records.
