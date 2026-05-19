import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: logs } = await supabase
    .from('care_logs')
    .select('id,title,notes,log_type,occurred_at,metadata,pets(name)')
    .order('occurred_at', { ascending: false })
    .limit(30);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Care logs</h1>
      {(logs ?? []).map((log) => {
        const meta = (log.metadata ?? {}) as Record<string, string | boolean | null>;
        return (
          <Card key={log.id}>
            <p className="font-semibold">{log.title}</p>
            <p className="text-sm text-muted-foreground">{(log.pets as { name?: string } | null)?.name ?? 'Pet'} • {log.log_type}</p>
            {log.notes ? <p className="mt-2 text-sm">{log.notes}</p> : null}
            <p className="mt-1 text-xs text-muted-foreground">Status: {String(meta.status ?? 'completed')}{meta.incident ? ' • incident' : ''}</p>
          </Card>
        );
      })}
    </div>
  );
}
