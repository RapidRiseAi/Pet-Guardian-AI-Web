import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ClinicPage() {
  const supabase = await createSupabaseServerClient();
  const [{ count: requestCount }, { count: patientCount }, { data: recentVisits }] = await Promise.all([
    supabase.from('access_requests').select('id', { count: 'exact', head: true }).eq('requester_role', 'clinic').eq('state', 'pending'),
    supabase.from('clinic_pet_links').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('visit_records').select('id,visited_at,reason,pets(name)').order('visited_at', { ascending: false }).limit(4),
  ]);

  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="info">Clinic dashboard</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Request access, review approved history, and log visits.</h1>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/app/clinic/requests">Review requests</ButtonLink><ButtonLink href="/app/clinic/visits" variant="secondary">Log a visit</ButtonLink></div>
      </GlassCard>
      <Card><p className="font-semibold">Pending requests: {requestCount ?? 0} • Active patients: {patientCount ?? 0}</p></Card>
      <Card><h2 className="text-xl font-semibold">Recent visits</h2>{(recentVisits ?? []).map((v)=><p key={v.id} className="text-sm text-muted-foreground">{(v.pets as {name?:string}|null)?.name ?? 'Pet'} • {v.reason ?? 'General review'} • {new Date(v.visited_at).toLocaleDateString()}</p>)}</Card>
    </div>
  );
}
