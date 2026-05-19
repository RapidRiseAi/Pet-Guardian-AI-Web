import { runSupportAction } from '@/lib/admin/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const entity = (Array.isArray(params.entity) ? params.entity[0] : params.entity) ?? '';
  const action = (Array.isArray(params.action) ? params.action[0] : params.action) ?? '';

  const supabase = await createSupabaseServerClient();
  let query = supabase.from('audit_logs').select('id,action,entity_table,entity_id,created_at,actor_role').order('created_at', { ascending: false }).limit(80);
  if (entity) query = query.ilike('entity_table', `%${entity}%`);
  if (action) query = query.ilike('action', `%${action}%`);
  const { data: logs } = await query;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Audit log</h1>
      <Card>
        <form className="grid gap-2 sm:grid-cols-3">
          <input name="entity" defaultValue={entity} placeholder="Filter entity" className="min-h-11 rounded-2xl border border-border bg-secondary px-3" />
          <input name="action" defaultValue={action} placeholder="Filter action" className="min-h-11 rounded-2xl border border-border bg-secondary px-3" />
          <Button type="submit" variant="secondary">Apply filters</Button>
        </form>
      </Card>
      <Card>
        <p className="font-semibold">Constrained support action</p>
        <form action={runSupportAction} className="mt-3 grid gap-2 sm:grid-cols-2">
          <input name="entityTable" placeholder="entity table" className="min-h-11 rounded-2xl border border-border bg-secondary px-3" defaultValue="profiles" />
          <input name="entityId" placeholder="entity id" className="min-h-11 rounded-2xl border border-border bg-secondary px-3" />
          <input name="action" placeholder="action" className="min-h-11 rounded-2xl border border-border bg-secondary px-3" defaultValue="support_note" />
          <input name="reason" placeholder="reason" className="min-h-11 rounded-2xl border border-border bg-secondary px-3" />
          <Button type="submit" className="sm:col-span-2">Log support action</Button>
        </form>
      </Card>
      {(logs ?? []).map((l) => (
        <Card key={l.id}>
          <p className="font-semibold">{l.action}</p>
          <p className="text-sm text-muted-foreground">{l.entity_table} • {l.entity_id} • {l.actor_role ?? 'n/a'}</p>
          <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</p>
        </Card>
      ))}
    </div>
  );
}
