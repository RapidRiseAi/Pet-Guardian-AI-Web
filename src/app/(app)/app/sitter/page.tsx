import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function SitterPage() {
  const supabase = await createSupabaseServerClient();
  const [{ count: assignedCount }, { data: upcoming }, { data: recentLogs }] = await Promise.all([
    supabase.from('sitter_assignments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('reminders').select('id,title,due_at,reminder_type,pets(name)').eq('status', 'scheduled').order('due_at', { ascending: true }).limit(3),
    supabase.from('care_logs').select('id,title,occurred_at,pets(name)').order('occurred_at', { ascending: false }).limit(3),
  ]);

  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="success">Sitter workspace</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Today&apos;s care tasks and pet instructions.</h1>
      </GlassCard>
      <Card><p className="font-semibold">Assigned pets: {assignedCount ?? 0}</p></Card>
      <Card className="space-y-3"><h2 className="text-xl font-semibold">Upcoming tasks</h2>{(upcoming ?? []).map((r)=><p key={r.id} className="text-sm text-muted-foreground">{(r.pets as {name?:string}|null)?.name ?? 'Pet'} • {r.title} • {new Date(r.due_at).toLocaleString()}</p>)}</Card>
      <Card className="space-y-3"><h2 className="text-xl font-semibold">Recent logs</h2>{(recentLogs ?? []).map((l)=><p key={l.id} className="text-sm text-muted-foreground">{(l.pets as {name?:string}|null)?.name ?? 'Pet'} • {l.title}</p>)}</Card>
      <div className="flex gap-2"><ButtonLink href="/app/sitter/logs" variant="secondary">View logs</ButtonLink><ButtonLink href="/app/sitter/tasks">Start next task</ButtonLink></div>
    </div>
  );
}
