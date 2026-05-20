'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { trackServerEvent } from '@/lib/integrations/analytics';

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return { supabase, user };
}

export async function createPetAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get('name') ?? '').trim();
  const species = String(formData.get('species') ?? '').trim();
  if (!name || !species) redirect('/app/pets/new?error=Name+and+species+are+required');

  let householdId: string | null = null;
  const { data: household } = await supabase.from('households').select('id').eq('owner_profile_id', user.id).maybeSingle();
  householdId = household?.id ?? null;

  if (!householdId) {
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email ?? null,
      display_name: user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? user.email ?? 'PetGuardian user',
      full_name: user.user_metadata?.full_name ?? null,
    }, { onConflict: 'id' });

    const { data: insertedHousehold, error: householdError } = await supabase.from('households').insert({ owner_profile_id: user.id, name: `${name} household` }).select('id').single();
    if (householdError || !insertedHousehold) redirect('/app/pets/new?error=Could+not+create+household');

    await supabase.from('household_members').upsert({
      household_id: insertedHousehold.id,
      profile_id: user.id,
      role: 'owner',
      is_primary: true,
      accepted_at: new Date().toISOString(),
    }, { onConflict: 'household_id,profile_id' });

    householdId = insertedHousehold.id;
  }

  const { data: pet, error } = await supabase.from('pets').insert({ household_id: householdId, primary_owner_id: user.id, name, species, breed: String(formData.get('breed') ?? '') || null, sex: String(formData.get('sex') ?? '') || null, microchip_number: String(formData.get('microchipNumber') ?? '') || null, summary: String(formData.get('summary') ?? '') || null }).select('id').single();
  if (error || !pet) redirect('/app/pets/new?error=Could+not+create+pet+profile');

  await supabase.from('pet_care_profiles').upsert({ pet_id: pet.id, created_by: user.id, feeding_notes: String(formData.get('feedingNotes') ?? '') || null, walking_notes: String(formData.get('walkingNotes') ?? '') || null, medication_notes: String(formData.get('medicationNotes') ?? '') || null, behaviour_notes: String(formData.get('behaviourNotes') ?? '') || null, allergy_notes: String(formData.get('allergyNotes') ?? '') || null, emergency_notes: String(formData.get('emergencyNotes') ?? '') || null }, { onConflict: 'pet_id' });
  await supabase.from('pet_medical_profiles').upsert({ pet_id: pet.id, created_by: user.id, chronic_conditions: String(formData.get('chronicConditions') ?? '') || null, allergies: String(formData.get('allergies') ?? '') || null, medical_notes: String(formData.get('medicalNotes') ?? '') || null }, { onConflict: 'pet_id' });

  trackServerEvent('pet_created', { petId: pet.id });
  revalidatePath('/app');
  revalidatePath('/app/pets');
  redirect(`/app/pets/${pet.id}`);
}
