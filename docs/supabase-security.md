# Supabase security model

Prompt 3 adds the production-oriented Supabase backbone for PetGuardian AI.

## Migration

- Core migration: `supabase/migrations/20260518150000_petguardian_core_schema.sql`
- Demo seed data: `supabase/seed.sql`

Apply locally with the Supabase CLI from the repository root:

```bash
supabase db reset
```

The seed creates four demo auth users with the password `PetGuardian-demo-123!`:

| Role | Email |
| --- | --- |
| Owner | `owner@petguardian.test` |
| Sitter | `sitter@petguardian.test` |
| Clinic | `clinic@petguardian.test` |
| Admin | `admin@petguardian.test` |

## Storage bucket strategy

Two buckets are created by the migration:

- `pet-files`: private bucket for documents, visit attachments, vaccination files, prescriptions, and clinical records. Object paths must start with a pet UUID, for example `{pet_id}/documents/rabies.pdf`.
- `pet-avatars`: public bucket for pet profile imagery. Object paths must also start with a pet UUID, for example `{pet_id}/avatars/profile.webp`.

Storage RLS uses `public.pet_id_from_storage_name(name)` plus the same pet access helpers as database tables, so file access follows the owner, sitter, clinic, and admin permission model rather than relying on public URLs.

## Access helpers

The migration defines security-definer helper functions to avoid duplicating sensitive access checks inside every policy:

- `public.current_app_role()` resolves the authenticated profile role.
- `public.is_admin()` gates admin operations.
- `public.is_household_member(household_id)` validates owner household membership.
- `public.owns_pet(pet_id)` checks owner/admin pet control.
- `public.has_sitter_assignment(pet_id, scope)` checks active sitter assignment windows and allowed scopes.
- `public.has_clinic_access(pet_id, scope)` checks active clinic grants, clinic membership, scopes, and expiry windows.
- `public.can_read_pet(pet_id)` and `public.can_write_clinic_record(pet_id)` compose common checks for RLS policies.
- `public.record_audit_event(...)` gives server code a controlled RPC for audit log writes.

## RLS intent

- Owners manage pets and related records through household membership.
- Sitters only read scoped care data for active assignments and can write care logs when `care_logs` is in scope.
- Clinics only read or write pet records through active grants tied to their clinic membership, allowed scopes, and duration.
- Admins have broad database access through `public.is_admin()`, while audit logs remain admin-readable only and support explicit reason metadata.

Soft delete is included only for entities where recovery/history matters: profiles, households, pets, pet photos, documents, contacts, reminders, visit records, medications, vaccinations, recommendations, clinics, and referral partners.
