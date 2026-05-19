# Deployment Runbook

## Stack targets
- **Frontend**: Next.js on Vercel.
- **Database/Auth/Storage**: Supabase.
- **Emails**: Resend.
- **Assistant**: Botpress (+ WhatsApp link path).
- **Observability**: Sentry.

## Deploy sequence
1. Merge to production branch.
2. Confirm Supabase migrations applied (GitHub integration or CI push).
3. Deploy Vercel build and verify health pages.
4. Trigger cron endpoint with `x-cron-secret` in staging.
5. Validate notifications, reminders, and audit logging.

## Required environment variables
Use `docs/deployment-environment.md` as source of truth. Ensure production and preview parity for all auth- and routing-critical variables.

## Post-deploy QA
- Sign-up/login/onboarding happy path.
- Owner creates pet and reminder.
- Sitter can only read assigned data.
- Clinic access request and visit logging.
- Admin audit event capture.
