import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const [{ data: partners }, { data: referrals }] = await Promise.all([
    supabase.from('referral_partners').select('id,name,status,commission_rate').limit(30),
    supabase.from('referrals').select('id,status,amount_cents,created_at').order('created_at', { ascending: false }).limit(30),
  ]);
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Referrals</h1><Card><p className="font-semibold">Partners</p>{(partners??[]).map(p=><p key={p.id} className="text-sm text-muted-foreground">{p.name} • {p.status} • rate {p.commission_rate}</p>)}</Card><Card><p className="font-semibold">Referral events</p>{(referrals??[]).map(r=><p key={r.id} className="text-sm text-muted-foreground">{r.status} • ${((r.amount_cents??0)/100).toFixed(2)}</p>)}</Card></div>;
}
