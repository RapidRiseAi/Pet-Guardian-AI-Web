# Production Launch Checklist

- [ ] Vercel project env vars set for Production and Preview.
- [ ] Supabase GitHub integration branch and working directory verified.
- [ ] Resend domain verified, `EMAIL_FROM` configured.
- [ ] Botpress webhook secret and bot ID configured.
- [ ] WhatsApp channel verified (Botpress or Meta direct path).
- [ ] Sentry DSN configured and test error observed.
- [ ] Cron secret configured and `/api/cron/reminders` job scheduled.
- [ ] RLS smoke checks run with owner/sitter/clinic/admin test users.
- [ ] Signup referral source tracking validated with `?ref=` link.
- [ ] Marketing metadata, OpenGraph, and Twitter cards validated.
- [ ] Accessibility checks performed (keyboard nav, labels, contrast).
- [ ] Final seed/demo mode validated for internal preview environment.
