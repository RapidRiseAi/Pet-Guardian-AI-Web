-- Prompt 4: authentication, onboarding, and account trust layer.

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists onboarding_step text not null default 'role',
  add column if not exists email_verified_at timestamptz,
  add column if not exists last_sign_in_at timestamptz;

create index if not exists profiles_onboarding_idx
  on public.profiles(role, status, onboarding_completed_at);

create or replace function public.role_from_auth_metadata(raw_role text)
returns public.app_role
language sql
immutable
as $$
  select case raw_role
    when 'owner' then 'owner'::public.app_role
    when 'sitter' then 'sitter'::public.app_role
    when 'clinic' then 'clinic'::public.app_role
    when 'admin' then 'admin'::public.app_role
    else 'owner'::public.app_role
  end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    role,
    status,
    full_name,
    display_name,
    email,
    phone,
    timezone,
    email_verified_at,
    last_sign_in_at,
    onboarding_step,
    metadata
  ) values (
    new.id,
    public.role_from_auth_metadata(new.raw_user_meta_data ->> 'role'),
    'active',
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    lower(new.email),
    nullif(new.phone, ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'timezone', ''), 'UTC'),
    new.email_confirmed_at,
    new.last_sign_in_at,
    'profile',
    jsonb_build_object(
      'signup_source', coalesce(new.raw_user_meta_data ->> 'signup_source', 'web'),
      'auth_provider', coalesce(new.raw_app_meta_data ->> 'provider', 'email')
    )
  )
  on conflict (id) do update set
    email = excluded.email,
    email_verified_at = coalesce(excluded.email_verified_at, public.profiles.email_verified_at),
    last_sign_in_at = coalesce(excluded.last_sign_in_at, public.profiles.last_sign_in_at),
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email_confirmed_at, last_sign_in_at on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.mark_onboarding_complete(
  selected_role public.app_role,
  selected_display_name text,
  selected_timezone text default 'UTC'
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if selected_role = 'admin' and not public.is_admin() then
    raise exception 'Admin onboarding must be granted by an existing admin' using errcode = '42501';
  end if;

  update public.profiles
  set
    role = selected_role,
    display_name = nullif(trim(selected_display_name), ''),
    timezone = coalesce(nullif(trim(selected_timezone), ''), timezone, 'UTC'),
    onboarding_step = 'complete',
    onboarding_completed_at = coalesce(onboarding_completed_at, now()),
    updated_at = now()
  where id = auth.uid()
  returning * into updated_profile;

  if updated_profile.id is null then
    raise exception 'Profile not found for authenticated user' using errcode = 'P0002';
  end if;

  return updated_profile;
end;
$$;

grant execute on function public.role_from_auth_metadata(text) to authenticated;
grant execute on function public.mark_onboarding_complete(public.app_role, text, text) to authenticated;

create or replace function public.create_onboarding_clinic(
  clinic_name text,
  clinic_email text default null,
  clinic_phone text default null
)
returns public.clinics
language plpgsql
security definer
set search_path = public
as $$
declare
  new_clinic public.clinics;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if (select role from public.profiles where id = auth.uid()) <> 'clinic' then
    raise exception 'Only clinic profiles can create onboarding clinics' using errcode = '42501';
  end if;

  insert into public.clinics (name, email, phone, verification_status, metadata)
  values (
    nullif(trim(clinic_name), ''),
    lower(nullif(trim(clinic_email), '')),
    nullif(trim(clinic_phone), ''),
    'pending',
    jsonb_build_object('created_from', 'onboarding')
  )
  returning * into new_clinic;

  insert into public.clinic_memberships (clinic_id, profile_id, role, status)
  values (new_clinic.id, auth.uid(), 'owner', 'active')
  on conflict (clinic_id, profile_id) do update set status = 'active', updated_at = now();

  return new_clinic;
end;
$$;

grant execute on function public.create_onboarding_clinic(text, text, text) to authenticated;
