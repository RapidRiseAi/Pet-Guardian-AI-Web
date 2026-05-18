-- PetGuardian AI core domain model, storage strategy, and Row Level Security.
-- Prompt 3: Supabase schema, storage, and permission architecture.

create extension if not exists pgcrypto;

-- Enums ----------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('owner', 'sitter', 'clinic', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.profile_status as enum ('active', 'invited', 'suspended', 'deleted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.pet_status as enum ('active', 'archived', 'deceased');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_state as enum ('draft', 'pending', 'approved', 'declined', 'cancelled', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.grant_status as enum ('active', 'paused', 'revoked', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.assignment_status as enum ('pending', 'active', 'paused', 'completed', 'revoked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.reminder_type as enum ('feeding', 'medication', 'vaccination', 'grooming', 'appointment', 'task', 'custom');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.reminder_status as enum ('scheduled', 'paused', 'completed', 'cancelled', 'overdue');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.delivery_status as enum ('queued', 'sent', 'delivered', 'failed', 'skipped');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_type as enum ('vaccination', 'prescription', 'insurance', 'lab_result', 'invoice', 'photo_id', 'care_note', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_channel as enum ('in_app', 'email', 'whatsapp', 'sms', 'push');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_status as enum ('unread', 'read', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contact_type as enum ('owner', 'emergency', 'vet', 'sitter', 'clinic', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.visit_status as enum ('scheduled', 'completed', 'cancelled', 'follow_up_required');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.medication_status as enum ('active', 'paused', 'completed', 'discontinued');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.vaccination_status as enum ('current', 'due_soon', 'overdue', 'exempt', 'unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.recommendation_status as enum ('open', 'accepted', 'declined', 'completed', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.referral_status as enum ('draft', 'active', 'paused', 'converted', 'paid', 'cancelled');
exception when duplicate_object then null; end $$;

-- Utility functions ----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

-- Core identity and ownership ------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'owner',
  status public.profile_status not null default 'active',
  full_name text,
  display_name text,
  email text,
  phone text,
  avatar_url text,
  locale text not null default 'en',
  timezone text not null default 'UTC',
  marketing_consent boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint profiles_email_lowercase check (email is null or email = lower(email))
);

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  owner_profile_id uuid not null references public.profiles(id) on delete restrict,
  plan_key text not null default 'starter',
  billing_customer_id text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null default 'owner',
  is_primary boolean not null default false,
  invited_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, profile_id)
);

create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  email text,
  phone text,
  website text,
  address jsonb not null default '{}'::jsonb,
  verification_status public.request_state not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.clinic_memberships (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  status public.profile_status not null default 'active',
  invited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clinic_id, profile_id)
);

-- Pet records ----------------------------------------------------------------
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  primary_owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  species text not null,
  breed text,
  sex text,
  date_of_birth date,
  microchip_number text,
  status public.pet_status not null default 'active',
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.pet_photos (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  storage_bucket text not null default 'pet-avatars',
  storage_path text not null,
  alt_text text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (storage_bucket, storage_path)
);

create table if not exists public.pet_care_profiles (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null unique references public.pets(id) on delete cascade,
  feeding_notes text,
  medication_notes text,
  walking_notes text,
  behaviour_notes text,
  allergy_notes text,
  emergency_notes text,
  sitter_visibility jsonb not null default '{"feeding": true, "walking": true, "medication": true, "emergency": true}'::jsonb,
  clinic_visibility jsonb not null default '{"emergency": true, "medication": true}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_medical_profiles (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null unique references public.pets(id) on delete cascade,
  primary_vet_clinic_id uuid references public.clinics(id) on delete set null,
  insurance_provider text,
  policy_number text,
  chronic_conditions text,
  allergies text,
  blood_type text,
  spayed_neutered boolean,
  medical_notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_documents (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  document_type public.document_type not null default 'other',
  title text not null,
  description text,
  storage_bucket text not null default 'pet-files',
  storage_path text not null,
  mime_type text,
  file_size_bytes bigint,
  visible_to_sitter boolean not null default false,
  visible_to_clinic boolean not null default true,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (storage_bucket, storage_path)
);

create table if not exists public.pet_contacts (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  contact_type public.contact_type not null,
  name text not null,
  relationship text,
  phone text,
  email text,
  address text,
  is_primary boolean not null default false,
  visible_to_sitter boolean not null default true,
  visible_to_clinic boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Scheduling and notifications ----------------------------------------------
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  reminder_type public.reminder_type not null,
  status public.reminder_status not null default 'scheduled',
  title text not null,
  instructions text,
  due_at timestamptz not null,
  recurrence_rule text,
  timezone text not null default 'UTC',
  visible_to_sitter boolean not null default false,
  channels public.notification_channel[] not null default array['in_app']::public.notification_channel[],
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.reminder_deliveries (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.reminders(id) on delete cascade,
  recipient_profile_id uuid references public.profiles(id) on delete set null,
  channel public.notification_channel not null,
  status public.delivery_status not null default 'queued',
  provider_message_id text,
  scheduled_for timestamptz not null,
  delivered_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_profile_id uuid not null references public.profiles(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  pet_id uuid references public.pets(id) on delete cascade,
  channel public.notification_channel not null default 'in_app',
  status public.notification_status not null default 'unread',
  title text not null,
  body text,
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  channel public.notification_channel not null,
  enabled boolean not null default true,
  quiet_hours jsonb not null default '{}'::jsonb,
  reminder_types public.reminder_type[] not null default array['feeding','medication','vaccination','grooming','appointment','task','custom']::public.reminder_type[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, channel)
);

-- Access, sitter, and clinic workflows --------------------------------------
create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  requester_profile_id uuid not null references public.profiles(id) on delete cascade,
  requester_role public.app_role not null,
  clinic_id uuid references public.clinics(id) on delete cascade,
  state public.request_state not null default 'pending',
  requested_scopes text[] not null default array['care'],
  message text,
  decision_by uuid references public.profiles(id) on delete set null,
  decision_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint access_requests_scope_nonempty check (array_length(requested_scopes, 1) > 0),
  constraint access_requests_clinic_role_requires_clinic check (requester_role <> 'clinic' or clinic_id is not null)
);

create table if not exists public.sitter_assignments (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  sitter_profile_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  status public.assignment_status not null default 'pending',
  allowed_scopes text[] not null default array['care','contacts','reminders'],
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sitter_assignments_scope_nonempty check (array_length(allowed_scopes, 1) > 0)
);

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_profile_id uuid not null references public.profiles(id) on delete restrict,
  grantee_profile_id uuid references public.profiles(id) on delete cascade,
  clinic_id uuid references public.clinics(id) on delete cascade,
  sitter_assignment_id uuid references public.sitter_assignments(id) on delete cascade,
  access_role public.app_role not null,
  status public.grant_status not null default 'active',
  scopes text[] not null default array['care'],
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  granted_by uuid not null references public.profiles(id) on delete restrict,
  revoked_by uuid references public.profiles(id) on delete set null,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint access_grants_scope_nonempty check (array_length(scopes, 1) > 0),
  constraint access_grants_grantee_target check (grantee_profile_id is not null or clinic_id is not null or sitter_assignment_id is not null)
);

create table if not exists public.clinic_pet_links (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  access_grant_id uuid references public.access_grants(id) on delete set null,
  status public.grant_status not null default 'active',
  linked_by uuid references public.profiles(id) on delete set null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clinic_id, pet_id, access_grant_id)
);

create table if not exists public.care_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  sitter_assignment_id uuid references public.sitter_assignments(id) on delete set null,
  logged_by uuid not null references public.profiles(id) on delete restrict,
  log_type public.reminder_type not null default 'task',
  title text not null,
  notes text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Medical workflow -----------------------------------------------------------
create table if not exists public.visit_records (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  clinic_id uuid references public.clinics(id) on delete set null,
  access_grant_id uuid references public.access_grants(id) on delete set null,
  recorded_by uuid not null references public.profiles(id) on delete restrict,
  status public.visit_status not null default 'completed',
  visited_at timestamptz not null default now(),
  reason text,
  diagnosis text,
  treatment_notes text,
  follow_up_at timestamptz,
  attachments jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  visit_record_id uuid references public.visit_records(id) on delete set null,
  prescribed_by_clinic_id uuid references public.clinics(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  dosage text,
  frequency text,
  instructions text,
  starts_on date,
  ends_on date,
  status public.medication_status not null default 'active',
  visible_to_sitter boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  visit_record_id uuid references public.visit_records(id) on delete set null,
  clinic_id uuid references public.clinics(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  vaccine_name text not null,
  administered_on date,
  due_on date,
  status public.vaccination_status not null default 'unknown',
  document_id uuid references public.pet_documents(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  visit_record_id uuid references public.visit_records(id) on delete set null,
  clinic_id uuid references public.clinics(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  body text not null,
  status public.recommendation_status not null default 'open',
  due_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Growth, WhatsApp, billing, and audit --------------------------------------
create table if not exists public.referral_partners (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  partner_type text not null default 'general',
  code text not null unique,
  status public.referral_status not null default 'active',
  commission_config jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referral_partner_id uuid not null references public.referral_partners(id) on delete cascade,
  referred_profile_id uuid references public.profiles(id) on delete set null,
  household_id uuid references public.households(id) on delete set null,
  code text not null,
  status public.referral_status not null default 'draft',
  converted_at timestamptz,
  payout_amount_cents integer,
  payout_currency text not null default 'USD',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  phone_number text not null,
  whatsapp_user_id text,
  status public.profile_status not null default 'invited',
  verified_at timestamptz,
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, phone_number),
  unique (whatsapp_user_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  actor_role public.app_role,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  pet_id uuid references public.pets(id) on delete set null,
  household_id uuid references public.households(id) on delete set null,
  reason text,
  ip_address inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.plan_settings (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique,
  display_name text not null,
  price_cents integer,
  currency text not null default 'USD',
  limits jsonb not null default '{}'::jsonb,
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated-at triggers --------------------------------------------------------
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles','households','household_members','clinics','clinic_memberships','pets','pet_photos',
    'pet_care_profiles','pet_medical_profiles','pet_documents','pet_contacts','reminders',
    'reminder_deliveries','notifications','notification_preferences','access_requests',
    'sitter_assignments','access_grants','clinic_pet_links','care_logs','visit_records',
    'medications','vaccinations','recommendations','referral_partners','referrals','whatsapp_links',
    'plan_settings'
  ] loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

-- Security-definer access helpers -------------------------------------------
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and status = 'active' limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role = 'admin' and status = 'active' from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(exists (
    select 1
    from public.households h
    join public.profiles p on p.id = h.owner_profile_id
    where h.id = target_household_id
      and h.owner_profile_id = auth.uid()
      and p.status = 'active'
  ), false)
  or coalesce(exists (
    select 1
    from public.household_members hm
    join public.profiles p on p.id = hm.profile_id
    where hm.household_id = target_household_id
      and hm.profile_id = auth.uid()
      and hm.role = 'owner'
      and p.status = 'active'
  ), false)
  or public.is_admin();
$$;

create or replace function public.owns_pet(target_pet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(exists (
    select 1
    from public.pets p
    where p.id = target_pet_id
      and p.deleted_at is null
      and public.is_household_member(p.household_id)
  ), false) or public.is_admin();
$$;

create or replace function public.has_sitter_assignment(target_pet_id uuid, target_scope text default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(exists (
    select 1
    from public.sitter_assignments sa
    join public.profiles p on p.id = sa.sitter_profile_id
    where sa.pet_id = target_pet_id
      and sa.sitter_profile_id = auth.uid()
      and sa.status = 'active'
      and sa.starts_at <= now()
      and (sa.ends_at is null or sa.ends_at > now())
      and p.status = 'active'
      and (target_scope is null or target_scope = any(sa.allowed_scopes))
  ), false);
$$;

create or replace function public.profile_clinic_ids(target_profile_id uuid default auth.uid())
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select cm.clinic_id
  from public.clinic_memberships cm
  join public.profiles p on p.id = cm.profile_id
  where cm.profile_id = target_profile_id
    and cm.status = 'active'
    and p.status = 'active';
$$;

create or replace function public.has_clinic_access(target_pet_id uuid, target_scope text default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(exists (
    select 1
    from public.access_grants ag
    where ag.pet_id = target_pet_id
      and ag.status = 'active'
      and ag.access_role = 'clinic'
      and ag.starts_at <= now()
      and (ag.expires_at is null or ag.expires_at > now())
      and ag.clinic_id in (select public.profile_clinic_ids(auth.uid()))
      and (target_scope is null or target_scope = any(ag.scopes))
  ), false);
$$;

create or replace function public.can_read_pet(target_pet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.owns_pet(target_pet_id)
    or public.has_sitter_assignment(target_pet_id, null)
    or public.has_clinic_access(target_pet_id, null)
    or public.is_admin();
$$;

create or replace function public.can_write_clinic_record(target_pet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_clinic_access(target_pet_id, 'write')
    or public.has_clinic_access(target_pet_id, 'medical_write')
    or public.is_admin();
$$;

create or replace function public.record_audit_event(
  action text,
  entity_table text,
  entity_id uuid default null,
  pet_id uuid default null,
  household_id uuid default null,
  reason text default null,
  metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.audit_logs (
    actor_profile_id,
    actor_role,
    action,
    entity_table,
    entity_id,
    pet_id,
    household_id,
    reason,
    metadata
  ) values (
    auth.uid(),
    public.current_app_role(),
    action,
    entity_table,
    entity_id,
    pet_id,
    household_id,
    reason,
    coalesce(metadata, '{}'::jsonb)
  ) returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.pet_id_from_storage_name(object_name text)
returns uuid
language sql
stable
as $$
  select case
    when split_part(object_name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then split_part(object_name, '/', 1)::uuid
    else null
  end;
$$;

-- Indexes --------------------------------------------------------------------
create index if not exists profiles_role_status_idx on public.profiles(role, status);
create index if not exists households_owner_idx on public.households(owner_profile_id);
create index if not exists household_members_profile_idx on public.household_members(profile_id);
create index if not exists household_members_household_role_idx on public.household_members(household_id, role);
create index if not exists clinics_verification_idx on public.clinics(verification_status);
create index if not exists clinic_memberships_profile_idx on public.clinic_memberships(profile_id, status);
create index if not exists clinic_memberships_clinic_idx on public.clinic_memberships(clinic_id, status);
create index if not exists pets_household_status_idx on public.pets(household_id, status) where deleted_at is null;
create index if not exists pets_primary_owner_idx on public.pets(primary_owner_id);
create index if not exists pet_documents_pet_type_idx on public.pet_documents(pet_id, document_type) where deleted_at is null;
create index if not exists pet_documents_expiry_idx on public.pet_documents(expires_at) where expires_at is not null and deleted_at is null;
create index if not exists pet_contacts_pet_type_idx on public.pet_contacts(pet_id, contact_type) where deleted_at is null;
create index if not exists reminders_pet_due_idx on public.reminders(pet_id, due_at, status) where deleted_at is null;
create index if not exists reminder_deliveries_due_idx on public.reminder_deliveries(scheduled_for, status);
create index if not exists notifications_recipient_status_idx on public.notifications(recipient_profile_id, status, created_at desc);
create index if not exists access_requests_pet_state_idx on public.access_requests(pet_id, state);
create index if not exists access_requests_requester_idx on public.access_requests(requester_profile_id, state);
create index if not exists sitter_assignments_pet_sitter_idx on public.sitter_assignments(pet_id, sitter_profile_id, status);
create index if not exists access_grants_pet_role_status_idx on public.access_grants(pet_id, access_role, status);
create index if not exists access_grants_clinic_active_idx on public.access_grants(clinic_id, pet_id) where status = 'active';
create index if not exists clinic_pet_links_clinic_status_idx on public.clinic_pet_links(clinic_id, status);
create index if not exists care_logs_pet_occurred_idx on public.care_logs(pet_id, occurred_at desc);
create index if not exists visit_records_pet_visited_idx on public.visit_records(pet_id, visited_at desc) where deleted_at is null;
create index if not exists medications_pet_status_idx on public.medications(pet_id, status) where deleted_at is null;
create index if not exists vaccinations_pet_due_idx on public.vaccinations(pet_id, due_on, status) where deleted_at is null;
create index if not exists recommendations_pet_status_idx on public.recommendations(pet_id, status) where deleted_at is null;
create index if not exists referrals_partner_status_idx on public.referrals(referral_partner_id, status);
create index if not exists whatsapp_links_profile_status_idx on public.whatsapp_links(profile_id, status);
create index if not exists audit_logs_actor_created_idx on public.audit_logs(actor_profile_id, created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_table, entity_id);
create index if not exists audit_logs_pet_idx on public.audit_logs(pet_id, created_at desc);

-- Storage buckets ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('pet-files', 'pet-files', false, 26214400, array['application/pdf','image/jpeg','image/png','image/webp','text/plain']::text[]),
  ('pet-avatars', 'pet-avatars', true, 5242880, array['image/jpeg','image/png','image/webp']::text[])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Enable RLS -----------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.clinics enable row level security;
alter table public.clinic_memberships enable row level security;
alter table public.pets enable row level security;
alter table public.pet_photos enable row level security;
alter table public.pet_care_profiles enable row level security;
alter table public.pet_medical_profiles enable row level security;
alter table public.pet_documents enable row level security;
alter table public.pet_contacts enable row level security;
alter table public.reminders enable row level security;
alter table public.reminder_deliveries enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.access_requests enable row level security;
alter table public.sitter_assignments enable row level security;
alter table public.access_grants enable row level security;
alter table public.clinic_pet_links enable row level security;
alter table public.care_logs enable row level security;
alter table public.visit_records enable row level security;
alter table public.medications enable row level security;
alter table public.vaccinations enable row level security;
alter table public.recommendations enable row level security;
alter table public.referral_partners enable row level security;
alter table public.referrals enable row level security;
alter table public.whatsapp_links enable row level security;
alter table public.audit_logs enable row level security;
alter table public.plan_settings enable row level security;

-- RLS policies: identity -----------------------------------------------------
create policy "profiles_select_self_related_or_admin" on public.profiles
  for select using (
    id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.household_members hm_self join public.household_members hm_target on hm_target.household_id = hm_self.household_id where hm_self.profile_id = auth.uid() and hm_target.profile_id = profiles.id)
    or exists (select 1 from public.sitter_assignments sa where sa.sitter_profile_id = profiles.id and public.owns_pet(sa.pet_id))
    or exists (select 1 from public.clinic_memberships cm where cm.profile_id = profiles.id and cm.clinic_id in (select public.profile_clinic_ids(auth.uid())))
  );

create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_self_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "profiles_delete_admin_only" on public.profiles
  for delete using (public.is_admin());

create policy "households_select_members" on public.households
  for select using (public.is_household_member(id));

create policy "households_insert_owner" on public.households
  for insert with check (owner_profile_id = auth.uid() or public.is_admin());

create policy "households_update_owner" on public.households
  for update using (public.is_household_member(id)) with check (public.is_household_member(id));

create policy "households_delete_admin_only" on public.households
  for delete using (public.is_admin());

create policy "household_members_select_members" on public.household_members
  for select using (public.is_household_member(household_id) or profile_id = auth.uid());

create policy "household_members_insert_owner" on public.household_members
  for insert with check (public.is_household_member(household_id) or public.is_admin());

create policy "household_members_update_owner" on public.household_members
  for update using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));

create policy "household_members_delete_owner" on public.household_members
  for delete using (public.is_household_member(household_id));

-- RLS policies: clinics ------------------------------------------------------
create policy "clinics_select_members_or_linked_owners" on public.clinics
  for select using (
    public.is_admin()
    or id in (select public.profile_clinic_ids(auth.uid()))
    or exists (select 1 from public.access_grants ag where ag.clinic_id = clinics.id and ag.status = 'active' and public.owns_pet(ag.pet_id))
  );

create policy "clinics_insert_authenticated" on public.clinics
  for insert with check (auth.uid() is not null);

create policy "clinics_update_members_or_admin" on public.clinics
  for update using (public.is_admin() or id in (select public.profile_clinic_ids(auth.uid()))) with check (public.is_admin() or id in (select public.profile_clinic_ids(auth.uid())));

create policy "clinics_delete_admin_only" on public.clinics
  for delete using (public.is_admin());

create policy "clinic_memberships_select_member_or_admin" on public.clinic_memberships
  for select using (public.is_admin() or profile_id = auth.uid() or clinic_id in (select public.profile_clinic_ids(auth.uid())));

create policy "clinic_memberships_insert_admin_or_clinic_member" on public.clinic_memberships
  for insert with check (public.is_admin() or clinic_id in (select public.profile_clinic_ids(auth.uid())));

create policy "clinic_memberships_update_admin_or_clinic_member" on public.clinic_memberships
  for update using (public.is_admin() or clinic_id in (select public.profile_clinic_ids(auth.uid()))) with check (public.is_admin() or clinic_id in (select public.profile_clinic_ids(auth.uid())));

create policy "clinic_memberships_delete_admin_only" on public.clinic_memberships
  for delete using (public.is_admin());

-- RLS policies: pet profile data --------------------------------------------
create policy "pets_select_authorized" on public.pets
  for select using (public.can_read_pet(id));

create policy "pets_insert_owner" on public.pets
  for insert with check (public.is_household_member(household_id) and primary_owner_id = auth.uid());

create policy "pets_update_owner_or_admin" on public.pets
  for update using (public.owns_pet(id)) with check (public.owns_pet(id));

create policy "pets_delete_admin_only" on public.pets
  for delete using (public.is_admin());

create policy "pet_photos_select_authorized" on public.pet_photos
  for select using (public.can_read_pet(pet_id));

create policy "pet_photos_insert_owner" on public.pet_photos
  for insert with check (public.owns_pet(pet_id) and uploaded_by = auth.uid());

create policy "pet_photos_update_owner" on public.pet_photos
  for update using (public.owns_pet(pet_id)) with check (public.owns_pet(pet_id));

create policy "pet_photos_delete_owner" on public.pet_photos
  for delete using (public.owns_pet(pet_id));

create policy "pet_care_profiles_select_scoped" on public.pet_care_profiles
  for select using (public.owns_pet(pet_id) or public.has_sitter_assignment(pet_id, 'care') or public.has_clinic_access(pet_id, 'care') or public.is_admin());

create policy "pet_care_profiles_insert_owner" on public.pet_care_profiles
  for insert with check (public.owns_pet(pet_id));

create policy "pet_care_profiles_update_owner" on public.pet_care_profiles
  for update using (public.owns_pet(pet_id)) with check (public.owns_pet(pet_id));

create policy "pet_care_profiles_delete_owner" on public.pet_care_profiles
  for delete using (public.owns_pet(pet_id));

create policy "pet_medical_profiles_select_scoped" on public.pet_medical_profiles
  for select using (public.owns_pet(pet_id) or public.has_clinic_access(pet_id, 'medical') or public.has_clinic_access(pet_id, 'medical_write') or public.is_admin());

create policy "pet_medical_profiles_insert_owner" on public.pet_medical_profiles
  for insert with check (public.owns_pet(pet_id));

create policy "pet_medical_profiles_update_owner_or_clinic_write" on public.pet_medical_profiles
  for update using (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) with check (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id));

create policy "pet_medical_profiles_delete_owner" on public.pet_medical_profiles
  for delete using (public.owns_pet(pet_id));

create policy "pet_documents_select_scoped" on public.pet_documents
  for select using (
    public.owns_pet(pet_id)
    or (visible_to_sitter and public.has_sitter_assignment(pet_id, 'documents'))
    or (visible_to_clinic and (public.has_clinic_access(pet_id, 'documents') or public.has_clinic_access(pet_id, 'medical')))
    or public.is_admin()
  );

create policy "pet_documents_insert_owner_or_clinic_write" on public.pet_documents
  for insert with check ((public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) and uploaded_by = auth.uid());

create policy "pet_documents_update_owner_or_uploader_clinic_write" on public.pet_documents
  for update using (public.owns_pet(pet_id) or (uploaded_by = auth.uid() and public.can_write_clinic_record(pet_id))) with check (public.owns_pet(pet_id) or (uploaded_by = auth.uid() and public.can_write_clinic_record(pet_id)));

create policy "pet_documents_delete_owner" on public.pet_documents
  for delete using (public.owns_pet(pet_id));

create policy "pet_contacts_select_scoped" on public.pet_contacts
  for select using (
    public.owns_pet(pet_id)
    or (visible_to_sitter and public.has_sitter_assignment(pet_id, 'contacts'))
    or (visible_to_clinic and (public.has_clinic_access(pet_id, 'contacts') or public.has_clinic_access(pet_id, 'emergency')))
    or public.is_admin()
  );

create policy "pet_contacts_insert_owner" on public.pet_contacts
  for insert with check (public.owns_pet(pet_id));

create policy "pet_contacts_update_owner" on public.pet_contacts
  for update using (public.owns_pet(pet_id)) with check (public.owns_pet(pet_id));

create policy "pet_contacts_delete_owner" on public.pet_contacts
  for delete using (public.owns_pet(pet_id));

-- RLS policies: reminders and notifications ---------------------------------
create policy "reminders_select_scoped" on public.reminders
  for select using (public.owns_pet(pet_id) or (visible_to_sitter and public.has_sitter_assignment(pet_id, 'reminders')) or public.is_admin());

create policy "reminders_insert_owner" on public.reminders
  for insert with check (public.owns_pet(pet_id) and created_by = auth.uid());

create policy "reminders_update_owner" on public.reminders
  for update using (public.owns_pet(pet_id)) with check (public.owns_pet(pet_id));

create policy "reminders_delete_owner" on public.reminders
  for delete using (public.owns_pet(pet_id));

create policy "reminder_deliveries_select_recipient_or_owner" on public.reminder_deliveries
  for select using (recipient_profile_id = auth.uid() or public.is_admin() or exists (select 1 from public.reminders r where r.id = reminder_deliveries.reminder_id and public.owns_pet(r.pet_id)));

create policy "reminder_deliveries_insert_service_or_owner" on public.reminder_deliveries
  for insert with check (public.is_admin() or exists (select 1 from public.reminders r where r.id = reminder_deliveries.reminder_id and public.owns_pet(r.pet_id)));

create policy "reminder_deliveries_update_service_or_recipient" on public.reminder_deliveries
  for update using (public.is_admin() or recipient_profile_id = auth.uid()) with check (public.is_admin() or recipient_profile_id = auth.uid());

create policy "notifications_select_recipient" on public.notifications
  for select using (recipient_profile_id = auth.uid() or public.is_admin());

create policy "notifications_insert_admin_or_actor" on public.notifications
  for insert with check (public.is_admin() or actor_profile_id = auth.uid());

create policy "notifications_update_recipient" on public.notifications
  for update using (recipient_profile_id = auth.uid() or public.is_admin()) with check (recipient_profile_id = auth.uid() or public.is_admin());

create policy "notification_preferences_select_own" on public.notification_preferences
  for select using (profile_id = auth.uid() or public.is_admin());

create policy "notification_preferences_insert_own" on public.notification_preferences
  for insert with check (profile_id = auth.uid() or public.is_admin());

create policy "notification_preferences_update_own" on public.notification_preferences
  for update using (profile_id = auth.uid() or public.is_admin()) with check (profile_id = auth.uid() or public.is_admin());

-- RLS policies: access and care workflows -----------------------------------
create policy "access_requests_select_involved" on public.access_requests
  for select using (requester_profile_id = auth.uid() or public.owns_pet(pet_id) or (clinic_id is not null and clinic_id in (select public.profile_clinic_ids(auth.uid()))) or public.is_admin());

create policy "access_requests_insert_authenticated" on public.access_requests
  for insert with check (
    requester_profile_id = auth.uid()
    and auth.uid() is not null
    and requester_role = public.current_app_role()
    and (clinic_id is null or clinic_id in (select public.profile_clinic_ids(auth.uid())))
  );

create policy "access_requests_update_involved" on public.access_requests
  for update using (requester_profile_id = auth.uid() or public.owns_pet(pet_id) or public.is_admin()) with check (requester_profile_id = auth.uid() or public.owns_pet(pet_id) or public.is_admin());

create policy "sitter_assignments_select_involved" on public.sitter_assignments
  for select using (sitter_profile_id = auth.uid() or public.owns_pet(pet_id) or public.is_admin());

create policy "sitter_assignments_insert_owner" on public.sitter_assignments
  for insert with check (public.owns_pet(pet_id) and assigned_by = auth.uid());

create policy "sitter_assignments_update_owner_or_admin" on public.sitter_assignments
  for update using (public.owns_pet(pet_id) or public.is_admin()) with check (public.owns_pet(pet_id) or public.is_admin());

create policy "sitter_assignments_delete_owner" on public.sitter_assignments
  for delete using (public.owns_pet(pet_id));

create policy "access_grants_select_involved" on public.access_grants
  for select using (public.owns_pet(pet_id) or grantee_profile_id = auth.uid() or (clinic_id is not null and clinic_id in (select public.profile_clinic_ids(auth.uid()))) or public.is_admin());

create policy "access_grants_insert_owner" on public.access_grants
  for insert with check (public.owns_pet(pet_id) and granted_by = auth.uid());

create policy "access_grants_update_owner" on public.access_grants
  for update using (public.owns_pet(pet_id) or public.is_admin()) with check (public.owns_pet(pet_id) or public.is_admin());

create policy "clinic_pet_links_select_involved" on public.clinic_pet_links
  for select using (public.owns_pet(pet_id) or clinic_id in (select public.profile_clinic_ids(auth.uid())) or public.is_admin());

create policy "clinic_pet_links_insert_owner_or_clinic" on public.clinic_pet_links
  for insert with check (public.owns_pet(pet_id) or (clinic_id in (select public.profile_clinic_ids(auth.uid())) and public.has_clinic_access(pet_id, null)) or public.is_admin());

create policy "clinic_pet_links_update_owner_or_clinic" on public.clinic_pet_links
  for update using (public.owns_pet(pet_id) or clinic_id in (select public.profile_clinic_ids(auth.uid())) or public.is_admin()) with check (public.owns_pet(pet_id) or clinic_id in (select public.profile_clinic_ids(auth.uid())) or public.is_admin());

create policy "care_logs_select_scoped" on public.care_logs
  for select using (public.owns_pet(pet_id) or logged_by = auth.uid() or public.has_sitter_assignment(pet_id, 'care_logs') or public.is_admin());

create policy "care_logs_insert_assigned_sitter_or_owner" on public.care_logs
  for insert with check ((public.has_sitter_assignment(pet_id, 'care_logs') or public.owns_pet(pet_id)) and logged_by = auth.uid());

create policy "care_logs_update_author_or_owner" on public.care_logs
  for update using (logged_by = auth.uid() or public.owns_pet(pet_id) or public.is_admin()) with check (logged_by = auth.uid() or public.owns_pet(pet_id) or public.is_admin());

-- RLS policies: medical workflows -------------------------------------------
create policy "visit_records_select_scoped" on public.visit_records
  for select using (public.owns_pet(pet_id) or public.has_clinic_access(pet_id, 'visits') or public.has_clinic_access(pet_id, 'medical') or public.is_admin());

create policy "visit_records_insert_owner_or_clinic_write" on public.visit_records
  for insert with check ((public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) and recorded_by = auth.uid());

create policy "visit_records_update_owner_or_clinic_write" on public.visit_records
  for update using (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) with check (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id));

create policy "medications_select_scoped" on public.medications
  for select using (public.owns_pet(pet_id) or (visible_to_sitter and public.has_sitter_assignment(pet_id, 'medications')) or public.has_clinic_access(pet_id, 'medical') or public.is_admin());

create policy "medications_insert_owner_or_clinic_write" on public.medications
  for insert with check ((public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) and created_by = auth.uid());

create policy "medications_update_owner_or_clinic_write" on public.medications
  for update using (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) with check (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id));

create policy "vaccinations_select_scoped" on public.vaccinations
  for select using (public.owns_pet(pet_id) or public.has_clinic_access(pet_id, 'vaccinations') or public.has_clinic_access(pet_id, 'medical') or public.is_admin());

create policy "vaccinations_insert_owner_or_clinic_write" on public.vaccinations
  for insert with check ((public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) and created_by = auth.uid());

create policy "vaccinations_update_owner_or_clinic_write" on public.vaccinations
  for update using (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) with check (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id));

create policy "recommendations_select_scoped" on public.recommendations
  for select using (public.owns_pet(pet_id) or public.has_clinic_access(pet_id, 'recommendations') or public.has_clinic_access(pet_id, 'medical') or public.is_admin());

create policy "recommendations_insert_owner_or_clinic_write" on public.recommendations
  for insert with check ((public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) and created_by = auth.uid());

create policy "recommendations_update_owner_or_clinic_write" on public.recommendations
  for update using (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id)) with check (public.owns_pet(pet_id) or public.can_write_clinic_record(pet_id));

-- RLS policies: operations ---------------------------------------------------
create policy "referral_partners_select_admin_or_partner" on public.referral_partners
  for select using (public.is_admin() or profile_id = auth.uid() or status = 'active');

create policy "referral_partners_admin_write" on public.referral_partners
  for all using (public.is_admin()) with check (public.is_admin());

create policy "referrals_select_involved" on public.referrals
  for select using (public.is_admin() or referred_profile_id = auth.uid() or exists (select 1 from public.referral_partners rp where rp.id = referrals.referral_partner_id and rp.profile_id = auth.uid()));

create policy "referrals_insert_authenticated" on public.referrals
  for insert with check (auth.uid() is not null);

create policy "referrals_update_admin_or_partner" on public.referrals
  for update using (public.is_admin() or exists (select 1 from public.referral_partners rp where rp.id = referrals.referral_partner_id and rp.profile_id = auth.uid())) with check (public.is_admin() or exists (select 1 from public.referral_partners rp where rp.id = referrals.referral_partner_id and rp.profile_id = auth.uid()));

create policy "whatsapp_links_select_own" on public.whatsapp_links
  for select using (profile_id = auth.uid() or public.is_admin());

create policy "whatsapp_links_insert_own" on public.whatsapp_links
  for insert with check (profile_id = auth.uid() or public.is_admin());

create policy "whatsapp_links_update_own" on public.whatsapp_links
  for update using (profile_id = auth.uid() or public.is_admin()) with check (profile_id = auth.uid() or public.is_admin());

create policy "audit_logs_select_admin_only" on public.audit_logs
  for select using (public.is_admin());

create policy "audit_logs_insert_authenticated" on public.audit_logs
  for insert with check (auth.uid() is not null or public.is_admin());

create policy "plan_settings_select_authenticated" on public.plan_settings
  for select using (auth.uid() is not null or is_active);

create policy "plan_settings_admin_write" on public.plan_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- Storage RLS ----------------------------------------------------------------
create policy "pet_files_select_scoped" on storage.objects
  for select using (
    bucket_id = 'pet-files'
    and public.pet_id_from_storage_name(name) is not null
    and (
      public.owns_pet(public.pet_id_from_storage_name(name))
      or public.has_sitter_assignment(public.pet_id_from_storage_name(name), 'documents')
      or public.has_clinic_access(public.pet_id_from_storage_name(name), 'documents')
      or public.has_clinic_access(public.pet_id_from_storage_name(name), 'medical')
      or public.is_admin()
    )
  );

create policy "pet_files_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'pet-files'
    and public.pet_id_from_storage_name(name) is not null
    and (public.owns_pet(public.pet_id_from_storage_name(name)) or public.can_write_clinic_record(public.pet_id_from_storage_name(name)))
  );

create policy "pet_files_owner_update" on storage.objects
  for update using (
    bucket_id = 'pet-files'
    and public.pet_id_from_storage_name(name) is not null
    and (public.owns_pet(public.pet_id_from_storage_name(name)) or public.can_write_clinic_record(public.pet_id_from_storage_name(name)))
  ) with check (
    bucket_id = 'pet-files'
    and public.pet_id_from_storage_name(name) is not null
    and (public.owns_pet(public.pet_id_from_storage_name(name)) or public.can_write_clinic_record(public.pet_id_from_storage_name(name)))
  );

create policy "pet_files_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'pet-files'
    and public.pet_id_from_storage_name(name) is not null
    and public.owns_pet(public.pet_id_from_storage_name(name))
  );

create policy "pet_avatars_public_read" on storage.objects
  for select using (bucket_id = 'pet-avatars');

create policy "pet_avatars_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'pet-avatars'
    and public.pet_id_from_storage_name(name) is not null
    and public.owns_pet(public.pet_id_from_storage_name(name))
  );

create policy "pet_avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'pet-avatars'
    and public.pet_id_from_storage_name(name) is not null
    and public.owns_pet(public.pet_id_from_storage_name(name))
  ) with check (
    bucket_id = 'pet-avatars'
    and public.pet_id_from_storage_name(name) is not null
    and public.owns_pet(public.pet_id_from_storage_name(name))
  );

create policy "pet_avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'pet-avatars'
    and public.pet_id_from_storage_name(name) is not null
    and public.owns_pet(public.pet_id_from_storage_name(name))
  );

-- Grants ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_household_member(uuid) to authenticated;
grant execute on function public.owns_pet(uuid) to authenticated;
grant execute on function public.has_sitter_assignment(uuid, text) to authenticated;
grant execute on function public.profile_clinic_ids(uuid) to authenticated;
grant execute on function public.has_clinic_access(uuid, text) to authenticated;
grant execute on function public.can_read_pet(uuid) to authenticated;
grant execute on function public.can_write_clinic_record(uuid) to authenticated;
grant execute on function public.record_audit_event(text, text, uuid, uuid, uuid, text, jsonb) to authenticated;
