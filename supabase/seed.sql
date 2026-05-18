-- Demo seed data for local Supabase development.
-- Password for all demo auth users is: PetGuardian-demo-123!

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'owner@petguardian.test', crypt('PetGuardian-demo-123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Xander Blumenthal"}', now(), now()),
  ('00000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sitter@petguardian.test', crypt('PetGuardian-demo-123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Maya Jacobs"}', now(), now()),
  ('00000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'clinic@petguardian.test', crypt('PetGuardian-demo-123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr Priya Naidoo"}', now(), now()),
  ('00000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@petguardian.test', crypt('PetGuardian-demo-123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"PetGuardian Admin"}', now(), now())
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  updated_at = now();

insert into public.profiles (id, role, status, full_name, display_name, email, phone, timezone)
values
  ('00000000-0000-4000-8000-000000000001', 'owner', 'active', 'Xander Blumenthal', 'Xander', 'owner@petguardian.test', '+15550001001', 'Africa/Johannesburg'),
  ('00000000-0000-4000-8000-000000000002', 'sitter', 'active', 'Maya Jacobs', 'Maya', 'sitter@petguardian.test', '+15550001002', 'Africa/Johannesburg'),
  ('00000000-0000-4000-8000-000000000003', 'clinic', 'active', 'Dr Priya Naidoo', 'Dr Priya', 'clinic@petguardian.test', '+15550001003', 'Africa/Johannesburg'),
  ('00000000-0000-4000-8000-000000000004', 'admin', 'active', 'PetGuardian Admin', 'Admin', 'admin@petguardian.test', '+15550001004', 'UTC')
on conflict (id) do update set
  role = excluded.role,
  status = excluded.status,
  full_name = excluded.full_name,
  display_name = excluded.display_name,
  phone = excluded.phone,
  updated_at = now();

insert into public.plan_settings (id, plan_key, display_name, price_cents, currency, limits, features, is_active)
values
  ('10000000-0000-4000-8000-000000000001', 'starter', 'Starter', 0, 'USD', '{"pets": 2, "documents": 25, "household_members": 2}', '{"qr": true, "reminders": true, "assistant": true}', true),
  ('10000000-0000-4000-8000-000000000002', 'guardian', 'Guardian', 999, 'USD', '{"pets": 8, "documents": 250, "household_members": 5}', '{"qr": true, "reminders": true, "assistant": true, "clinic_access": true}', true)
on conflict (plan_key) do update set
  display_name = excluded.display_name,
  price_cents = excluded.price_cents,
  limits = excluded.limits,
  features = excluded.features,
  updated_at = now();

insert into public.households (id, name, slug, owner_profile_id, plan_key)
values ('20000000-0000-4000-8000-000000000001', 'Blumenthal Household', 'blumenthal-household', '00000000-0000-4000-8000-000000000001', 'guardian')
on conflict (id) do update set name = excluded.name, plan_key = excluded.plan_key, updated_at = now();

insert into public.household_members (id, household_id, profile_id, role, is_primary, accepted_at)
values ('21000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'owner', true, now())
on conflict (household_id, profile_id) do update set role = excluded.role, is_primary = excluded.is_primary, updated_at = now();

insert into public.clinics (id, name, slug, email, phone, verification_status, address)
values ('30000000-0000-4000-8000-000000000001', 'Cape Town Companion Vet', 'cape-town-companion-vet', 'frontdesk@companionvet.test', '+15550002001', 'approved', '{"city":"Cape Town","country":"ZA"}')
on conflict (id) do update set name = excluded.name, verification_status = excluded.verification_status, updated_at = now();

insert into public.clinic_memberships (id, clinic_id, profile_id, role, status)
values ('31000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'veterinarian', 'active')
on conflict (clinic_id, profile_id) do update set role = excluded.role, status = excluded.status, updated_at = now();

insert into public.pets (id, household_id, primary_owner_id, name, species, breed, sex, date_of_birth, microchip_number, status, summary)
values
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Max', 'Dog', 'Golden Retriever', 'male', '2019-04-12', '933000000000001', 'active', 'Calm, food-motivated, needs evening medication with food.'),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Luna', 'Cat', 'Domestic Shorthair', 'female', '2021-09-03', '933000000000002', 'active', 'Indoor cat. Nervous around strangers; prefers quiet handling.')
on conflict (id) do update set summary = excluded.summary, updated_at = now();

insert into public.pet_care_profiles (pet_id, feeding_notes, medication_notes, walking_notes, behaviour_notes, allergy_notes, emergency_notes, created_by)
values
  ('40000000-0000-4000-8000-000000000001', 'Two cups of dry food at 07:00 and 18:00.', 'Give joint supplement with dinner.', '30 minute walk after breakfast.', 'Friendly, avoid dog parks when crowded.', 'No known food allergies.', 'Emergency contact is Xander first, then Cape Town Companion Vet.', '00000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000002', 'Wet food at 08:00 and 19:00; dry food available.', null, null, 'Hide-and-wait approach works best.', 'Sensitive stomach.', 'Use carrier in hallway cupboard.', '00000000-0000-4000-8000-000000000001')
on conflict (pet_id) do update set feeding_notes = excluded.feeding_notes, updated_at = now();

insert into public.pet_medical_profiles (pet_id, primary_vet_clinic_id, insurance_provider, policy_number, chronic_conditions, allergies, spayed_neutered, medical_notes, created_by)
values
  ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Guardian Pet Cover', 'GPC-MAX-001', 'Mild hip dysplasia.', 'None known.', true, 'Annual mobility checks recommended.', '00000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', null, null, null, 'Sensitive stomach.', true, 'Routine wellness monitoring.', '00000000-0000-4000-8000-000000000001')
on conflict (pet_id) do update set medical_notes = excluded.medical_notes, updated_at = now();

insert into public.pet_contacts (id, pet_id, contact_type, name, relationship, phone, email, is_primary, visible_to_sitter, visible_to_clinic)
values
  ('50000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'owner', 'Xander Blumenthal', 'Owner', '+15550001001', 'owner@petguardian.test', true, true, true),
  ('50000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', 'vet', 'Cape Town Companion Vet', 'Primary clinic', '+15550002001', 'frontdesk@companionvet.test', false, true, true)
on conflict (id) do update set phone = excluded.phone, updated_at = now();

insert into public.sitter_assignments (id, pet_id, sitter_profile_id, assigned_by, status, allowed_scopes, starts_at, ends_at, notes)
values ('60000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'active', array['care','contacts','reminders','care_logs','medications','documents'], now() - interval '1 day', now() + interval '14 days', 'Demo sitter assignment for Max.')
on conflict (id) do update set status = excluded.status, allowed_scopes = excluded.allowed_scopes, updated_at = now();

insert into public.access_grants (id, pet_id, owner_profile_id, grantee_profile_id, sitter_assignment_id, access_role, status, scopes, starts_at, expires_at, granted_by)
values ('61000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000001', 'sitter', 'active', array['care','contacts','reminders','care_logs','medications','documents'], now() - interval '1 day', now() + interval '14 days', '00000000-0000-4000-8000-000000000001')
on conflict (id) do update set status = excluded.status, scopes = excluded.scopes, updated_at = now();

insert into public.access_grants (id, pet_id, owner_profile_id, clinic_id, access_role, status, scopes, starts_at, expires_at, granted_by)
values ('61000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'clinic', 'active', array['care','contacts','emergency','medical','documents','visits','vaccinations','recommendations','write','medical_write'], now() - interval '1 day', now() + interval '30 days', '00000000-0000-4000-8000-000000000001')
on conflict (id) do update set status = excluded.status, scopes = excluded.scopes, updated_at = now();

insert into public.clinic_pet_links (id, clinic_id, pet_id, access_grant_id, status, linked_by, starts_at, expires_at)
values ('62000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '61000000-0000-4000-8000-000000000002', 'active', '00000000-0000-4000-8000-000000000001', now() - interval '1 day', now() + interval '30 days')
on conflict (id) do update set status = excluded.status, updated_at = now();

insert into public.pet_documents (id, pet_id, uploaded_by, document_type, title, description, storage_bucket, storage_path, mime_type, visible_to_sitter, visible_to_clinic, expires_at)
values ('70000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'vaccination', 'Rabies certificate', 'Demo vaccination document metadata. File must be uploaded separately in local storage.', 'pet-files', '40000000-0000-4000-8000-000000000001/documents/rabies-certificate.pdf', 'application/pdf', false, true, now() + interval '11 months')
on conflict (id) do update set title = excluded.title, updated_at = now();

insert into public.reminders (id, pet_id, created_by, reminder_type, status, title, instructions, due_at, timezone, visible_to_sitter, channels)
values ('80000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'medication', 'scheduled', 'Evening supplement', 'Give with dinner.', now() + interval '6 hours', 'Africa/Johannesburg', true, array['in_app','email']::public.notification_channel[])
on conflict (id) do update set due_at = excluded.due_at, updated_at = now();

insert into public.medications (id, pet_id, prescribed_by_clinic_id, created_by, name, dosage, frequency, instructions, starts_on, status, visible_to_sitter)
values ('90000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'Joint supplement', '1 tablet', 'Daily with dinner', 'Give with food and water.', current_date - interval '30 days', 'active', true)
on conflict (id) do update set instructions = excluded.instructions, updated_at = now();

insert into public.vaccinations (id, pet_id, clinic_id, created_by, vaccine_name, administered_on, due_on, status, document_id)
values ('91000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'Rabies', current_date - interval '30 days', current_date + interval '11 months', 'current', '70000000-0000-4000-8000-000000000001')
on conflict (id) do update set due_on = excluded.due_on, updated_at = now();

insert into public.visit_records (id, pet_id, clinic_id, access_grant_id, recorded_by, status, visited_at, reason, diagnosis, treatment_notes, follow_up_at)
values ('92000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '61000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000003', 'completed', now() - interval '30 days', 'Annual checkup', 'Healthy with mild hip stiffness.', 'Continue supplement; monitor mobility.', now() + interval '6 months')
on conflict (id) do update set treatment_notes = excluded.treatment_notes, updated_at = now();

insert into public.recommendations (id, pet_id, visit_record_id, clinic_id, created_by, title, body, status, due_at)
values ('93000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '92000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'Mobility check-in', 'Book a follow-up mobility check within six months.', 'open', now() + interval '6 months')
on conflict (id) do update set body = excluded.body, updated_at = now();

insert into public.care_logs (id, pet_id, sitter_assignment_id, logged_by, log_type, title, notes, occurred_at)
values ('94000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'feeding', 'Breakfast completed', 'Ate all food and drank water.', now() - interval '2 hours')
on conflict (id) do update set notes = excluded.notes, updated_at = now();

insert into public.notifications (id, recipient_profile_id, actor_profile_id, pet_id, channel, status, title, body, action_url)
values ('95000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', 'in_app', 'unread', 'Breakfast logged', 'Maya logged breakfast for Max.', '/app/pets/40000000-0000-4000-8000-000000000001/timeline')
on conflict (id) do update set body = excluded.body, updated_at = now();

insert into public.notification_preferences (profile_id, channel, enabled)
values
  ('00000000-0000-4000-8000-000000000001', 'in_app', true),
  ('00000000-0000-4000-8000-000000000001', 'email', true),
  ('00000000-0000-4000-8000-000000000002', 'in_app', true),
  ('00000000-0000-4000-8000-000000000003', 'in_app', true)
on conflict (profile_id, channel) do update set enabled = excluded.enabled, updated_at = now();

insert into public.referral_partners (id, profile_id, name, partner_type, code, status, commission_config)
values ('96000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'Launch Partner Demo', 'clinic_network', 'LAUNCHDEMO', 'active', '{"type":"flat","amount_cents":1000}')
on conflict (code) do update set status = excluded.status, updated_at = now();

insert into public.referrals (id, referral_partner_id, referred_profile_id, household_id, code, status, converted_at)
values ('97000000-0000-4000-8000-000000000001', '96000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'LAUNCHDEMO', 'converted', now())
on conflict (id) do update set status = excluded.status, updated_at = now();

insert into public.whatsapp_links (id, profile_id, phone_number, whatsapp_user_id, status, verified_at)
values ('98000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '+15550001001', 'whatsapp-demo-owner', 'active', now())
on conflict (id) do update set status = excluded.status, updated_at = now();

insert into public.audit_logs (actor_profile_id, actor_role, action, entity_table, entity_id, pet_id, household_id, reason, metadata)
values ('00000000-0000-4000-8000-000000000004', 'admin', 'seed.demo_data_created', 'pets', '40000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Local development seed', '{"source":"supabase/seed.sql"}');
