import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const [{ data: clinics }, { data: sitterAssignments }] = await Promise.all([
    supabase.from('clinics').select('id,name,verification_status,created_at').order('created_at', { ascending: false }).limit(30),
    supabase.from('sitter_assignments').select('id,status,created_at').order('created_at', { ascending: false }).limit(30),
  ]);
  return <div className="space-y-4"><h1 className="text-3xl font-semibold">Clinics and partners</h1><Card><p className="font-semibold">Clinic statuses</p>{(clinics??[]).map(c=><p key={c.id} className="text-sm text-muted-foreground">{c.name} • {c.verification_status}</p>)}</Card><Card><p className="font-semibold">Sitter assignment states</p>{(sitterAssignments??[]).slice(0,10).map(s=><p key={s.id} className="text-sm text-muted-foreground">{s.status}</p>)}</Card></div>;
}
