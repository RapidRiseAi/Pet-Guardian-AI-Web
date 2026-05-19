'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
export async function runSupportAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const entityTable = String(formData.get('entityTable') ?? 'profiles');
  const entityId = String(formData.get('entityId') ?? '').trim();
  const reason = String(formData.get('reason') ?? '').trim();
  const action = String(formData.get('action') ?? 'support_note').trim();
  if (!entityId || !reason) redirect('/app/admin/audit?error=Entity+and+reason+required');
  await supabase.from('audit_logs').insert({ actor_profile_id: user.id, actor_role: 'admin', action, entity_table: entityTable, entity_id: entityId, metadata: { reason, source: 'admin-support-action' } });
  revalidatePath('/app/admin/audit');
  redirect('/app/admin/audit?success=Support+action+logged');
}
