import { createReminderAction } from '@/lib/notifications/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: pets } = await supabase.from('pets').select('id,name').is('deleted_at', null).order('updated_at', { ascending: false }).limit(20);
  const { data: reminders } = await supabase.from('reminders').select('id,title,status,due_at,reminder_type,pets(name)').is('deleted_at', null).order('due_at', { ascending: true }).limit(50);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Reminder center</h1>
      <Card>
        <h2 className="text-xl font-semibold">Create reminder</h2>
        <form action={createReminderAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <select name="petId" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" required>
            <option value="">Select pet</option>
            {(pets ?? []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select name="reminderType" className="min-h-12 rounded-2xl border border-border bg-secondary px-4">
            <option value="feeding">Feeding</option><option value="medication">Medication</option><option value="grooming">Grooming</option><option value="appointment">Appointment</option><option value="custom">Custom</option>
          </select>
          <input name="title" className="min-h-12 rounded-2xl border border-border bg-secondary px-4 sm:col-span-2" placeholder="Reminder title" required />
          <textarea name="instructions" className="min-h-20 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" placeholder="Instructions" />
          <input name="dueAt" type="datetime-local" className="min-h-12 rounded-2xl border border-border bg-secondary px-4 sm:col-span-2" required />
          <Button type="submit" className="sm:col-span-2">Save reminder</Button>
        </form>
      </Card>
      <div className="space-y-3">
        {(reminders ?? []).map((r) => {
          const overdue = r.status !== 'completed' && new Date(r.due_at).getTime() < Date.now();
          return (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{(r.pets as { name?: string } | null)?.name ?? 'Pet'} • {r.reminder_type}</p>
                  <p className="text-xs text-muted-foreground">Due {new Date(r.due_at).toLocaleString()}</p>
                </div>
                <Badge tone={overdue ? 'warning' : r.status === 'completed' ? 'success' : 'info'}>{overdue ? 'overdue' : r.status}</Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
