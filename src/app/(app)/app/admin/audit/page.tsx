import { runSupportAction } from '@/lib/admin/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: logs } = await supabase.from('audit_logs').select('id,action,entity_table,entity_id,created_at,metadata').order('created_at', { ascending: false }).limit(60);
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Audit log</h1><Card><p className="font-semibold">Support action</p><form action={runSupportAction} className="mt-3 grid gap-2 sm:grid-cols-2"><input name="entityTable" placeholder="entity table" className="min-h-11 rounded-2xl border border-border bg-secondary px-3" defaultValue="profiles"/><input name="entityId" placeholder="entity id" className="min-h-11 rounded-2xl border border-border bg-secondary px-3"/><input name="action" placeholder="action" className="min-h-11 rounded-2xl border border-border bg-secondary px-3" defaultValue="support_note"/><input name="reason" placeholder="reason" className="min-h-11 rounded-2xl border border-border bg-secondary px-3"/><Button type="submit" className="sm:col-span-2">Log support action</Button></form></Card>{(logs??[]).map(l=><Card key={l.id}><p className="font-semibold">{l.action}</p><p className="text-sm text-muted-foreground">{l.entity_table} • {l.entity_id}</p></Card>)}</div>;
}
