import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: assignments } = await supabase
    .from('sitter_assignments')
    .select('id, pet_id, allowed_scopes, notes, pets(name,species,breed)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Assigned pets</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {(assignments ?? []).map((a) => (
          <Link key={a.id} href={`/app/pets/${a.pet_id}`}>
            <Card>
              <p className="text-xl font-semibold">{(a.pets as { name?: string } | null)?.name ?? 'Pet'}</p>
              <p className="text-sm text-muted-foreground">Allowed scopes: {(a.allowed_scopes ?? []).join(', ')}</p>
              {a.notes ? <p className="mt-1 text-sm text-muted-foreground">{a.notes}</p> : null}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
