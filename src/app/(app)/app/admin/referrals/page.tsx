import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const q = ((await searchParams)?.q ?? '') as string;
  const supabase = await createSupabaseServerClient();
  let partnerQuery = supabase.from('referral_partners').select('id,name,status,commission_rate,profile_id').limit(30);
  if (q) partnerQuery = partnerQuery.ilike('name', `%${q}%`);
  const [{ data: partners }, { data: referrals }] = await Promise.all([
    partnerQuery,
    supabase.from('referrals').select('id,status,amount_cents,created_at,referral_partner_id').order('created_at', { ascending: false }).limit(60),
  ]);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Referrals</h1>
      <form><input name="q" defaultValue={q} placeholder="Search partner" className="min-h-11 rounded-2xl border border-border bg-secondary px-4" /></form>
      <Card><p className="font-semibold">Partners and commission placeholders</p>{(partners ?? []).map((p) => <p key={p.id} className="text-sm text-muted-foreground">{p.name} • {p.status} • commission {p.commission_rate}</p>)}</Card>
      <Card><p className="font-semibold">Partner-linked conversions</p>{(referrals ?? []).map((r) => <p key={r.id} className="text-sm text-muted-foreground">partner {r.referral_partner_id} • {r.status} • ${((r.amount_cents ?? 0) / 100).toFixed(2)}</p>)}</Card>
    </div>
  );
}
