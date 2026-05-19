'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function getUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return { supabase, user };
}

export async function createSitterGrantAction(formData: FormData) {
  const { supabase, user } = await getUser();
  const petId = String(formData.get('petId') ?? '');
  const sitterProfileId = String(formData.get('sitterProfileId') ?? '');
  const scopes = String(formData.get('scopes') ?? 'care,contacts,reminders').split(',').map((s) => s.trim()).filter(Boolean);
  const expiresAt = String(formData.get('expiresAt') ?? '').trim();

  const { data: assignment } = await supabase.from('sitter_assignments').insert({ pet_id: petId, sitter_profile_id: sitterProfileId, assigned_by: user.id, status: 'active', allowed_scopes: scopes }).select('id').single();

  await supabase.from('access_grants').insert({
    pet_id: petId,
    owner_profile_id: user.id,
    grantee_profile_id: sitterProfileId,
    sitter_assignment_id: assignment?.id ?? null,
    access_role: 'sitter',
    status: 'active',
    scopes,
    granted_by: user.id,
    expires_at: expiresAt || null,
  });

  revalidatePath(`/app/pets/${petId}/sharing`);
  redirect(`/app/pets/${petId}/sharing?success=Sitter+access+granted`);
}

export async function reviewAccessRequestAction(formData: FormData) {
  const { supabase, user } = await getUser();
  const requestId = String(formData.get('requestId') ?? '');
  const decision = String(formData.get('decision') ?? 'rejected');
  const petId = String(formData.get('petId') ?? '');

  const { data: request } = await supabase.from('access_requests').select('*').eq('id', requestId).single();
  if (!request) redirect(`/app/pets/${petId}/sharing?error=Request+not+found`);

  await supabase.from('access_requests').update({ state: decision, decision_by: user.id, decision_at: new Date().toISOString() }).eq('id', requestId);

  if (decision === 'approved') {
    await supabase.from('access_grants').insert({
      pet_id: request.pet_id,
      owner_profile_id: user.id,
      clinic_id: request.clinic_id,
      access_role: request.requester_role,
      status: 'active',
      scopes: request.requested_scopes,
      granted_by: user.id,
      expires_at: request.expires_at,
    });
  }

  revalidatePath(`/app/pets/${petId}/sharing`);
  redirect(`/app/pets/${petId}/sharing?success=Request+${decision}`);
}

export async function revokeGrantAction(formData: FormData) {
  const { supabase } = await getUser();
  const grantId = String(formData.get('grantId') ?? '');
  const petId = String(formData.get('petId') ?? '');

  await supabase.from('access_grants').update({ status: 'revoked', revoked_at: new Date().toISOString() }).eq('id', grantId);
  revalidatePath(`/app/pets/${petId}/sharing`);
  redirect(`/app/pets/${petId}/sharing?success=Access+revoked`);
}
