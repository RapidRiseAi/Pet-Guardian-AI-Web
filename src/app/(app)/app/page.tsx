import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AppPage() {
  const supabase = await createSupabaseServerClient();
  const [{ count: reminderCount }, { count: requestCount }, { count: grantCount }, { data: pets }, { data: recent }] =
    await Promise.all([
      supabase
        .from('reminders')
        .select('id', { count: 'exact', head: true })
        .in('status', ['scheduled', 'overdue'])
        .is('deleted_at', null),
      supabase.from('access_requests').select('id', { count: 'exact', head: true }).eq('state', 'pending'),
      supabase.from('access_grants').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase
        .from('pets')
        .select('id,name,species,summary')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(4),
      supabase
        .from('audit_logs')
        .select('id,action,created_at')
        .order('created_at', { ascending: false })
        .limit(4),
    ]);

  return (
    <div className="space-y-6">
      <GlassCard>
        <Badge tone="success">Owner workspace</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
          Premium care command center
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
          Keep profiles complete, schedule reminders fast, track key care events, and share a vet-specific
          profile when needed.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ButtonLink href="/app/pets/new">Add pet profile</ButtonLink>
          <ButtonLink href="/app/reminders" variant="secondary">
            Add reminder
          </ButtonLink>
          <ButtonLink href="/app/pets" variant="secondary">
            Log event / visit
          </ButtonLink>
          <ButtonLink href="/app/pets" variant="secondary">
            Share vet profile
          </ButtonLink>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Due reminders</p>
          <p className="mt-2 text-3xl font-semibold">{reminderCount ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Scheduled and overdue items.</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Pending access</p>
          <p className="mt-2 text-3xl font-semibold">{requestCount ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Share approvals waiting for review.</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Active shares</p>
          <p className="mt-2 text-3xl font-semibold">{grantCount ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Live access for vets and sitters.</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pet profiles</h2>
            <ButtonLink href="/app/pets" variant="ghost" size="sm">
              Manage
            </ButtonLink>
          </div>
          {(pets ?? []).length ? (
            <div className="space-y-2">
              {(pets ?? []).map((p) => (
                <div key={p.id} className="rounded-2xl border border-border/80 p-3 text-sm">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-muted-foreground">
                    {p.species}
                    {p.summary ? ` • ${p.summary}` : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No pets yet. Add your first profile to get started.</p>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Recent timeline activity</h2>
          <p className="mt-1 text-xs text-muted-foreground">Latest reminders, logs, and care updates.</p>
          <div className="mt-3 space-y-2">
            {(recent ?? []).map((r) => (
              <div key={r.id} className="rounded-2xl border border-border/80 p-3 text-sm text-muted-foreground">
                {r.action} • {new Date(r.created_at).toLocaleString()}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
