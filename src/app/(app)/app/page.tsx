import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AppPage() {
  const supabase = await createSupabaseServerClient();
  const [{ count: reminderCount }, { count: requestCount }, { count: grantCount }, { data: pets }, { data: recent }] = await Promise.all([
    supabase.from('reminders').select('id', { count: 'exact', head: true }).in('status', ['scheduled', 'overdue']).is('deleted_at', null),
    supabase.from('access_requests').select('id', { count: 'exact', head: true }).eq('state', 'pending'),
    supabase.from('access_grants').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('pets').select('id,name,species,summary').is('deleted_at', null).order('updated_at', { ascending: false }).limit(3),
    supabase.from('audit_logs').select('id,action,created_at').order('created_at', { ascending: false }).limit(4),
  ]);

  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="success">Owner command center</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Today&apos;s care, reminders, and trusted access.</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><ButtonLink href="/app/pets/new">Add first pet</ButtonLink><ButtonLink href="/app/assistant" variant="secondary">Open assistant</ButtonLink></div>
      </GlassCard>
      <Card><p className="font-semibold">Reminders: {reminderCount ?? 0} • Pending requests: {requestCount ?? 0} • Active grants: {grantCount ?? 0}</p></Card>
      <Card><h2 className="text-xl font-semibold">Pet profiles</h2>{(pets ?? []).length ? (pets ?? []).map((p)=><p key={p.id} className="text-sm text-muted-foreground">{p.name} • {p.species}{p.summary ? ` • ${p.summary}` : ''}</p>) : <p className="text-sm text-muted-foreground">No pets yet. Add your first pet to begin.</p>}</Card>
      <Card><h2 className="text-xl font-semibold">Recent system activity</h2>{(recent ?? []).map((r)=><p key={r.id} className="text-sm text-muted-foreground">{r.action} • {new Date(r.created_at).toLocaleString()}</p>)}</Card>
    </div>
  );
}
