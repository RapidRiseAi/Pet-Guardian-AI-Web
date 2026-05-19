import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const q = ((await searchParams)?.q ?? '') as string;
  const supabase = await createSupabaseServerClient();
  let query = supabase.from('pets').select('id,name,species,status,primary_owner_id,updated_at').is('deleted_at', null).order('updated_at', { ascending: false }).limit(50);
  if (q) query = query.ilike('name', `%${q}%`);
  const { data: pets } = await query;
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Pets</h1><form><input name="q" defaultValue={q} placeholder="Search pet" className="min-h-11 rounded-2xl border border-border bg-secondary px-4"/></form>{(pets??[]).map(p=><Card key={p.id}><p className="font-semibold">{p.name}</p><p className="text-sm text-muted-foreground">{p.species} • {p.status}</p></Card>)}</div>;
}
