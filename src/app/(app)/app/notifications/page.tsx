import { markNotificationReadAction } from '@/lib/notifications/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: notifications } = await supabase.from('notifications').select('id,title,body,status,created_at,action_url,channel').order('created_at', { ascending: false }).limit(40);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Notifications</h1>
      {(notifications ?? []).map((n) => (
        <Card key={n.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{n.title}</p>
              {n.body ? <p className="mt-1 text-sm text-muted-foreground">{n.body}</p> : null}
              <p className="mt-1 text-xs text-muted-foreground">{n.channel} • {new Date(n.created_at).toLocaleString()}</p>
            </div>
            {n.status === 'unread' ? (
              <form action={markNotificationReadAction}>
                <input type="hidden" name="notificationId" value={n.id} />
                <Button type="submit" variant="secondary">Mark read</Button>
              </form>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
