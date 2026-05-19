import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const q = ((await searchParams)?.q ?? '') as string;
  const supabase = await createSupabaseServerClient();
  let query = supabase.from('profiles').select('id,full_name,role,status,created_at').order('created_at', { ascending: false }).limit(50);
  if (q) query = query.ilike('full_name', `%${q}%`);
  const { data: users } = await query;
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Users</h1><form><input name="q" defaultValue={q} placeholder="Search name" className="min-h-11 rounded-2xl border border-border bg-secondary px-4"/></form>{(users??[]).map(u=><Card key={u.id}><p className="font-semibold">{u.full_name ?? 'Unnamed user'}</p><p className="text-sm text-muted-foreground">{u.role} • {u.status}</p></Card>)}</div>;
}
