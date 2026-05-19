'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function logSitterCareAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const petId = String(formData.get('petId') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  if (!petId || !title) redirect('/app/sitter/tasks?error=Missing+pet+or+task+title');

  const logType = (String(formData.get('logType') ?? 'task') as 'feeding' | 'medication' | 'task' | 'custom' | 'grooming' | 'appointment' | 'vaccination');
  const notes = String(formData.get('notes') ?? '').trim() || null;
  const status = String(formData.get('status') ?? 'completed');
  const reason = String(formData.get('reason') ?? '').trim();
  const incident = String(formData.get('incident') ?? 'false') === 'true';
  const photoUrl = String(formData.get('photoUrl') ?? '').trim();

  const { data: assignment } = await supabase.from('sitter_assignments').select('id').eq('pet_id', petId).eq('sitter_profile_id', user.id).eq('status', 'active').maybeSingle();

  await supabase.from('care_logs').insert({
    pet_id: petId,
    sitter_assignment_id: assignment?.id ?? null,
    logged_by: user.id,
    log_type: logType,
    title,
    notes,
    metadata: { status, unable_reason: status === 'unable' ? reason : null, incident, photo_url: photoUrl || null },
  });

  revalidatePath('/app/sitter');
  revalidatePath('/app/sitter/tasks');
  revalidatePath('/app/sitter/logs');
  redirect('/app/sitter/logs?success=Log+saved');
}
