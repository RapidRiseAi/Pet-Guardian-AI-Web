import { logSitterCareAction } from '@/lib/sitter/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: reminders } = await supabase
    .from('reminders')
    .select('id,pet_id,title,due_at,reminder_type,status,pets(name)')
    .eq('status', 'scheduled')
    .order('due_at', { ascending: true })
    .limit(12);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Today&apos;s tasks</h1>
      <div className="space-y-3">
        {(reminders ?? []).map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-muted-foreground">{(r.pets as { name?: string } | null)?.name ?? 'Pet'} • {r.reminder_type}</p>
              </div>
              <Badge tone="warning">Due</Badge>
            </div>
            <form action={logSitterCareAction} className="mt-4 grid gap-2 sm:grid-cols-2">
              <input type="hidden" name="petId" value={r.pet_id} />
              <input type="hidden" name="title" value={r.title} />
              <input type="hidden" name="logType" value={r.reminder_type} />
              <textarea name="notes" className="min-h-20 rounded-2xl border border-border bg-secondary px-3 py-2 sm:col-span-2" placeholder="Add note" />
              <input name="photoUrl" className="min-h-10 rounded-2xl border border-border bg-secondary px-3" placeholder="Photo URL (optional)" />
              <select name="status" className="min-h-10 rounded-2xl border border-border bg-secondary px-3">
                <option value="completed">Completed</option>
                <option value="unable">Unable to complete</option>
              </select>
              <input name="reason" className="min-h-10 rounded-2xl border border-border bg-secondary px-3 sm:col-span-2" placeholder="Reason if unable" />
              <label className="text-sm"><input type="checkbox" name="incident" value="true" className="mr-2"/>Flag as incident</label>
              <Button type="submit">Log action</Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
