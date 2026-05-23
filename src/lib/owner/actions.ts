'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';
import { trackServerEvent } from '@/lib/integrations/analytics';

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return { supabase, user };
}

export async function createPetAction(formData: FormData) {
  const { user } = await requireUser();
  const admin = createSupabaseAdminClient();
  const name = String(formData.get('name') ?? '').trim();
  const species = String(formData.get('species') ?? '').trim();
  if (!name || !species) redirect('/app/pets/new?error=Name+and+species+are+required');

  const { error: ensureProfileError } = await admin.from('profiles').upsert({
    id: user.id,
    email: user.email ?? null,
    display_name: user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? user.email ?? 'PetGuardian user',
    full_name: user.user_metadata?.full_name ?? null,
    status: 'active',
    role: 'owner',
  }, { onConflict: 'id' });
  if (ensureProfileError) redirect('/app/pets/new?error=Could+not+prepare+your+profile');

  let householdId: string | null = null;
  const { data: households, error: householdsError } = await admin.from('households').select('id').eq('owner_profile_id', user.id).limit(1);
  if (householdsError) redirect('/app/pets/new?error=Could+not+load+household');
  householdId = households?.[0]?.id ?? null;

  if (!householdId) {
    const { error: householdInsertError } = await admin.from('households').insert({ owner_profile_id: user.id, name: `${name} household` });
    if (householdInsertError) redirect('/app/pets/new?error=Could+not+create+household');

    const { data: refreshedHouseholds, error: refreshedHouseholdsError } = await admin.from('households').select('id').eq('owner_profile_id', user.id).limit(1);
    if (refreshedHouseholdsError) redirect('/app/pets/new?error=Could+not+load+household');
    const resolvedHouseholdId = refreshedHouseholds?.[0]?.id ?? null;

    if (!resolvedHouseholdId) redirect('/app/pets/new?error=Could+not+create+household');

    const { error: householdMemberError } = await admin.from('household_members').upsert({
      household_id: resolvedHouseholdId,
      profile_id: user.id,
      role: 'owner',
      is_primary: true,
      accepted_at: new Date().toISOString(),
    }, { onConflict: 'household_id,profile_id' });
    if (householdMemberError) redirect('/app/pets/new?error=Could+not+link+household+owner');

    householdId = resolvedHouseholdId;
  }


  const { error: ensureHouseholdMemberError } = await admin.from('household_members').upsert({
    household_id: householdId,
    profile_id: user.id,
    role: 'owner',
    is_primary: true,
    accepted_at: new Date().toISOString(),
  }, { onConflict: 'household_id,profile_id' });
  if (ensureHouseholdMemberError) redirect('/app/pets/new?error=Could+not+link+household+owner');

  const { data: pet, error } = await admin.from('pets').insert({ household_id: householdId, primary_owner_id: user.id, name, species, breed: String(formData.get('breed') ?? '') || null, sex: String(formData.get('sex') ?? '') || null, microchip_number: String(formData.get('microchipNumber') ?? '') || null, summary: String(formData.get('summary') ?? '') || null }).select('id').single();
  if (error || !pet) {
    const hint = error?.code ? `%28${encodeURIComponent(error.code)}%29` : '';
    redirect(`/app/pets/new?error=Could+not+create+pet+profile${hint}`);
  }

  await admin.from('pet_care_profiles').upsert({ pet_id: pet.id, created_by: user.id, feeding_notes: String(formData.get('feedingNotes') ?? '') || null, walking_notes: String(formData.get('walkingNotes') ?? '') || null, medication_notes: String(formData.get('medicationNotes') ?? '') || null, behaviour_notes: String(formData.get('behaviourNotes') ?? '') || null, allergy_notes: String(formData.get('allergyNotes') ?? '') || null, emergency_notes: String(formData.get('emergencyNotes') ?? '') || null }, { onConflict: 'pet_id' });
  await admin.from('pet_medical_profiles').upsert({ pet_id: pet.id, created_by: user.id, chronic_conditions: String(formData.get('chronicConditions') ?? '') || null, allergies: String(formData.get('allergies') ?? '') || null, medical_notes: String(formData.get('medicalNotes') ?? '') || null }, { onConflict: 'pet_id' });

  trackServerEvent('pet_created', { petId: pet.id });
  revalidatePath('/app');
  revalidatePath('/app/pets');
  redirect(`/app/pets/${pet.id}`);
}
