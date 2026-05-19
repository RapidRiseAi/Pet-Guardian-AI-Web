'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function createReminderAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const petId = String(formData.get('petId') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const dueAt = String(formData.get('dueAt') ?? '').trim();
  if (!petId || !title || !dueAt) redirect('/app/reminders?error=Missing+required+fields');

  await supabase.from('reminders').insert({
    pet_id: petId,
    created_by: user.id,
    title,
    due_at: new Date(dueAt).toISOString(),
    reminder_type: String(formData.get('reminderType') ?? 'custom'),
    instructions: String(formData.get('instructions') ?? '').trim() || null,
    channels: ['in_app', 'email'],
    status: 'scheduled',
  });

  revalidatePath('/app/reminders');
  redirect('/app/reminders?success=Reminder+created');
}

export async function markNotificationReadAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const id = String(formData.get('notificationId') ?? '');
  if (!id) redirect('/app/notifications');

  await supabase.from('notifications').update({ status: 'read', read_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/app/notifications');
  redirect('/app/notifications');
}
