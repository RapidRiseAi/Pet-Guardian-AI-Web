import { submitClinicAccessRequestAction } from '@/lib/clinic/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: requests } = await supabase
    .from('access_requests')
    .select('id,pet_id,state,requested_scopes,reason,created_at,pets(name)')
    .eq('requester_role', 'clinic')
    .order('created_at', { ascending: false })
    .limit(20);
  const { data: pets } = await supabase.from('pets').select('id,name,species').is('deleted_at', null).order('updated_at', { ascending: false }).limit(20);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Clinic access requests</h1>
      <Card>
        <h2 className="text-xl font-semibold">Request owner-approved access</h2>
        <form action={submitClinicAccessRequestAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <select name="petId" className="min-h-12 rounded-2xl border border-border bg-secondary px-4 sm:col-span-2" required>
            <option value="">Select pet</option>
            {(pets ?? []).map((pet) => <option key={pet.id} value={pet.id}>{pet.name} • {pet.species}</option>)}
          </select>
          <textarea name="reason" className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" placeholder="Clinical reason for access request" />
          <Button type="submit" className="sm:col-span-2">Submit request</Button>
        </form>
      </Card>

      {(requests ?? []).map((request) => (
        <Card key={request.id}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold">{(request.pets as { name?: string } | null)?.name ?? 'Pet'}</p>
            <Badge tone={request.state === 'approved' ? 'success' : request.state === 'pending' ? 'warning' : 'info'}>{request.state}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Scopes: {(request.requested_scopes ?? []).join(', ')}</p>
          {request.reason ? <p className="mt-2 text-sm">{request.reason}</p> : null}
        </Card>
      ))}
    </div>
  );
}
