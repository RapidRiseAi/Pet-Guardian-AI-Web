import { createSitterGrantAction, reviewAccessRequestAction, revokeGrantAction } from '@/lib/sharing/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: requests }, { data: grants }, { data: sitters }] = await Promise.all([
    supabase.from('access_requests').select('id,state,requester_role,requested_scopes,created_at,requester_profile_id').eq('pet_id', petId).order('created_at', { ascending: false }),
    supabase.from('access_grants').select('id,status,access_role,scopes,expires_at,grantee_profile_id,clinic_id').eq('pet_id', petId).order('created_at', { ascending: false }),
    supabase.from('profiles').select('id,full_name,role').eq('role', 'sitter').limit(20),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Sharing & access control</h1>
      <Card>
        <h2 className="text-xl font-semibold">Grant sitter access</h2>
        <form action={createSitterGrantAction} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="petId" value={petId} />
          <select name="sitterProfileId" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" required>
            <option value="">Select sitter</option>
            {(sitters ?? []).map((s) => <option key={s.id} value={s.id}>{s.full_name ?? s.id}</option>)}
          </select>
          <input name="scopes" defaultValue="care,contacts,reminders" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" />
          <input name="expiresAt" type="datetime-local" className="min-h-12 rounded-2xl border border-border bg-secondary px-4 sm:col-span-2" />
          <Button type="submit" className="sm:col-span-2">Grant sitter access</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Pending requests</h2>
        <div className="mt-3 space-y-3">
          {(requests ?? []).map((r) => (
            <div key={r.id} className="rounded-2xl border border-border p-3">
              <div className="flex items-center justify-between"><p className="font-semibold">{r.requester_role} request</p><Badge tone={r.state === 'pending' ? 'warning' : r.state === 'approved' ? 'success' : 'info'}>{r.state}</Badge></div>
              <p className="text-sm text-muted-foreground">Scopes: {(r.requested_scopes ?? []).join(', ')}</p>
              {r.state === 'pending' ? (
                <div className="mt-2 flex gap-2">
                  <form action={reviewAccessRequestAction}><input type="hidden" name="requestId" value={r.id} /><input type="hidden" name="petId" value={petId} /><input type="hidden" name="decision" value="approved" /><Button type="submit">Approve</Button></form>
                  <form action={reviewAccessRequestAction}><input type="hidden" name="requestId" value={r.id} /><input type="hidden" name="petId" value={petId} /><input type="hidden" name="decision" value="rejected" /><Button type="submit" variant="secondary">Deny</Button></form>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Active and expired grants</h2>
        <div className="mt-3 space-y-3">
          {(grants ?? []).map((g) => (
            <div key={g.id} className="rounded-2xl border border-border p-3">
              <div className="flex items-center justify-between"><p className="font-semibold">{g.access_role} • scopes {(g.scopes ?? []).join(', ')}</p><Badge tone={g.status === 'active' ? 'success' : 'warning'}>{g.status}</Badge></div>
              <p className="text-xs text-muted-foreground">Expires: {g.expires_at ? new Date(g.expires_at).toLocaleString() : 'Open-ended'}</p>
              {g.status === 'active' ? <form action={revokeGrantAction} className="mt-2"><input type="hidden" name="grantId" value={g.id} /><input type="hidden" name="petId" value={petId} /><Button type="submit" variant="secondary">Revoke</Button></form> : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
