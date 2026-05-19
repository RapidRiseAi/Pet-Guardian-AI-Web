import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const [{ count: userCount }, { count: partnerCount }, { count: auditCount }, { data: latestAudits }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('clinics').select('id', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('id', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('id,action,entity_table,created_at').order('created_at', { ascending: false }).limit(5),
  ]);

  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="warning">Admin operations</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Operational control and support visibility.</h1>
        <div className="mt-6 flex gap-3"><ButtonLink href="/app/admin/users">Manage users</ButtonLink><ButtonLink href="/app/admin/audit" variant="secondary">Open audit log</ButtonLink></div>
      </GlassCard>
      <Card><p className="font-semibold">Users: {userCount ?? 0} • Clinics: {partnerCount ?? 0} • Audit events: {auditCount ?? 0}</p></Card>
      <Card><h2 className="text-xl font-semibold">Latest audit events</h2>{(latestAudits ?? []).map((a)=><p key={a.id} className="text-sm text-muted-foreground">{a.action} • {a.entity_table} • {new Date(a.created_at).toLocaleString()}</p>)}</Card>
    </div>
  );
}
