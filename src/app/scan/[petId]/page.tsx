import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';

export default async function Page({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: pet } = await supabase.from('pets').select('id,name').eq('id', petId).maybeSingle();
  if (!pet) return <Card><p className="font-semibold">Invalid QR</p></Card>;

  if (!user) {
    return <Card><Badge tone="warning">Sign-in required</Badge><p className="mt-2">This QR entry is controlled. Log in to request or view authorized access.</p><ButtonLink href={`/login?next=/scan/${petId}`} className="mt-4">Log in</ButtonLink></Card>;
  }

  const [{ data: grants }, { data: requests }] = await Promise.all([
    supabase.from('access_grants').select('id,status,access_role,scopes,expires_at').eq('pet_id', petId).or(`grantee_profile_id.eq.${user.id}`),
    supabase.from('access_requests').select('id,state,requested_scopes,created_at').eq('pet_id', petId).eq('requester_profile_id', user.id).order('created_at', { ascending: false }).limit(3),
  ]);

  const active = (grants ?? []).find((g) => g.status === 'active');
  return (
    <Card>
      <h1 className="text-2xl font-semibold">QR access for {pet.name}</h1>
      {active ? <p className="mt-2 text-sm">Access granted: {active.access_role} • scopes {active.scopes.join(', ')}</p> : <p className="mt-2 text-sm">No active grant yet. You can request access from clinic or sitter workflows.</p>}
      <div className="mt-4 space-y-2">{(requests ?? []).map((r) => <p key={r.id} className="text-xs text-muted-foreground">Request: {r.state} • scopes {r.requested_scopes.join(', ')}</p>)}</div>
    </Card>
  );
}
