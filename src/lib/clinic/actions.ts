'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function getClinicContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: membership } = await supabase.from('clinic_memberships').select('clinic_id').eq('profile_id', user.id).eq('status', 'active').maybeSingle();
  return { supabase, user, clinicId: membership?.clinic_id ?? null };
}

export async function submitClinicAccessRequestAction(formData: FormData) {
  const { supabase, user, clinicId } = await getClinicContext();
  const petId = String(formData.get('petId') ?? '').trim();
  if (!petId || !clinicId) redirect('/app/clinic/requests?error=Clinic+membership+or+pet+missing');

  await supabase.from('access_requests').insert({
    pet_id: petId,
    requester_profile_id: user.id,
    requester_role: 'clinic',
    clinic_id: clinicId,
    requested_scopes: ['medical', 'vaccinations', 'recommendations'],
    reason: String(formData.get('reason') ?? '').trim() || null,
    state: 'pending',
  });

  revalidatePath('/app/clinic/requests');
  redirect('/app/clinic/requests?success=Request+submitted');
}

export async function createClinicVisitAction(formData: FormData) {
  const { supabase, user, clinicId } = await getClinicContext();
  const petId = String(formData.get('petId') ?? '').trim();
  if (!petId || !clinicId) redirect('/app/clinic/visits?error=Clinic+membership+or+pet+missing');

  const { data: visit } = await supabase.from('visit_records').insert({
    pet_id: petId,
    clinic_id: clinicId,
    recorded_by: user.id,
    reason: String(formData.get('reason') ?? '').trim() || null,
    diagnosis: String(formData.get('diagnosis') ?? '').trim() || null,
    treatment_notes: String(formData.get('treatmentNotes') ?? '').trim() || null,
    follow_up_at: String(formData.get('followUpAt') ?? '').trim() || null,
  }).select('id').single();

  if (String(formData.get('medicationName') ?? '').trim()) {
    await supabase.from('medications').insert({
      pet_id: petId,
      visit_record_id: visit?.id ?? null,
      prescribed_by_clinic_id: clinicId,
      created_by: user.id,
      name: String(formData.get('medicationName')),
      dosage: String(formData.get('medicationDosage') ?? '').trim() || null,
      frequency: String(formData.get('medicationFrequency') ?? '').trim() || null,
      instructions: String(formData.get('medicationInstructions') ?? '').trim() || null,
    });
  }

  if (String(formData.get('vaccineName') ?? '').trim()) {
    await supabase.from('vaccinations').insert({
      pet_id: petId,
      visit_record_id: visit?.id ?? null,
      administered_by_clinic_id: clinicId,
      created_by: user.id,
      vaccine_name: String(formData.get('vaccineName')),
      batch_number: String(formData.get('vaccineBatch') ?? '').trim() || null,
      administered_on: String(formData.get('administeredOn') ?? '').trim() || null,
      due_on: String(formData.get('vaccineDueOn') ?? '').trim() || null,
    });
  }

  if (String(formData.get('recommendationTitle') ?? '').trim()) {
    await supabase.from('recommendations').insert({
      pet_id: petId,
      visit_record_id: visit?.id ?? null,
      clinic_id: clinicId,
      created_by: user.id,
      title: String(formData.get('recommendationTitle')),
      details: String(formData.get('recommendationDetails') ?? '').trim() || null,
      due_at: String(formData.get('recommendationDueAt') ?? '').trim() || null,
    });
  }

  revalidatePath('/app/clinic/visits');
  revalidatePath('/app/clinic/patients');
  redirect('/app/clinic/visits?success=Visit+saved');
}
