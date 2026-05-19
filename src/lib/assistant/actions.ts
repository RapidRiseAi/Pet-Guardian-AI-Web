'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
export type AssistantCard = { title: string; body: string; cta?: { label: string; href: string } };
export async function runAssistantQuery(queryInput: string): Promise<{ answer: string; cards: AssistantCard[]; disclaimer?: string }> {
  const query = queryInput.toLowerCase().trim();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { answer: 'Please sign in first.', cards: [] };
  if (query.includes('upcoming reminder')) {
    const { data: reminders } = await supabase.from('reminders').select('id,title,due_at,reminder_type,pet_id,pets(name)').in('status', ['scheduled', 'overdue']).order('due_at', { ascending: true }).limit(5);
    const cards = (reminders ?? []).map((r) => ({ title: r.title, body: `${(r.pets as { name?: string } | null)?.name ?? 'Pet'} • ${r.reminder_type} • due ${new Date(r.due_at).toLocaleString()}`, cta: { label: 'Open reminders', href: '/app/reminders' } }));
    return { answer: cards.length ? 'Here are your upcoming reminders.' : 'No upcoming reminders found.', cards };
  }
  if (query.includes('pending access')) {
    const { data: requests } = await supabase.from('access_requests').select('id,state,requester_role,pet_id,pets(name),requested_scopes').eq('state', 'pending').order('created_at', { ascending: false }).limit(5);
    const cards = (requests ?? []).map((r) => ({ title: `${r.requester_role} access request`, body: `${(r.pets as { name?: string } | null)?.name ?? 'Pet'} • scopes: ${(r.requested_scopes ?? []).join(', ')}`, cta: { label: 'Review sharing', href: `/app/pets/${r.pet_id}/sharing` } }));
    return { answer: cards.length ? 'These requests need your review.' : 'No pending access requests.', cards };
  }
  if (query.includes('clinic visit') || query.includes('recent visit')) {
    const { data: visits } = await supabase.from('visit_records').select('id,pet_id,visited_at,reason,diagnosis,pets(name)').order('visited_at', { ascending: false }).limit(5);
    const cards = (visits ?? []).map((v) => ({ title: `${(v.pets as { name?: string } | null)?.name ?? 'Pet'} visit`, body: `${new Date(v.visited_at).toLocaleDateString()} • ${v.reason ?? 'General check'}${v.diagnosis ? ` • ${v.diagnosis}` : ''}`, cta: { label: 'Open clinic visits', href: '/app/clinic/visits' } }));
    return { answer: cards.length ? 'Here are recent clinic visits you can access.' : 'No recent clinic visits found.', cards, disclaimer: 'This summary is informational and not medical advice.' };
  }
  return { answer: 'I can help with reminders, pending access requests, and recent clinic visits.', cards: [{ title: 'Try asking', body: 'upcoming reminders, pending access requests, or recent clinic visits.' }] };
}
export async function runAssistantQueryAction(formData: FormData){return runAssistantQuery(String(formData.get('query')??''));}
