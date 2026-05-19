import { runAssistantQuery } from '@/lib/assistant/actions';
import { Badge } from '@/components/ui/badge';
import { Card, GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  const result = query ? await runAssistantQuery(query) : null;

  return (
    <div className="space-y-4">
      <GlassCard>
        <Badge tone="info">Grounded assistant</Badge>
        <h1 className="mt-3 text-3xl font-semibold">Permission-aware assistant workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ask about reminders, access requests, sitter handovers, or recent clinic visits. Responses are scoped to your account permissions.</p>
      </GlassCard>

      <Card>
        <form method="GET" className="space-y-3">
          <input name="q" className="min-h-12 w-full rounded-2xl border border-border bg-secondary px-4" placeholder="Ask about feeding, reminders, records, or access requests." defaultValue={query ?? ''} />
          <Button type="submit">Ask assistant</Button>
        </form>
      </Card>

      <Card>
        <p className="text-sm text-muted-foreground">Quick actions:</p>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {['upcoming reminders', 'pending access requests', 'recent clinic visits'].map((q) => (
            <a key={q} href={`/app/assistant?q=${encodeURIComponent(q)}`} className="rounded-full border border-border px-3 py-1">{q}</a>
          ))}
        </div>
      </Card>

      {result ? (
        <>
          <Card>
            <p className="font-semibold">Assistant answer</p>
            <p className="mt-2 text-sm">{result.answer}</p>
            {result.disclaimer ? <p className="mt-2 text-xs text-muted-foreground">{result.disclaimer}</p> : null}
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            {result.cards.map((card) => (
              <Card key={card.title + card.body}>
                <p className="font-semibold">{card.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.body}</p>
                {card.cta ? <a href={card.cta.href} className="mt-2 inline-block text-sm underline">{card.cta.label}</a> : null}
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
