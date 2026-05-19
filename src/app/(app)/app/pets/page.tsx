import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: pets } = await supabase.from('pets').select('id,name,species,breed,updated_at').is('deleted_at', null).order('updated_at', { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Pet profiles</h1>
        <ButtonLink href="/app/pets/new">Add pet</ButtonLink>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {(pets ?? []).map((pet) => (
          <Link key={pet.id} href={`/app/pets/${pet.id}`}>
            <Card>
              <p className="text-xl font-semibold">{pet.name}</p>
              <p className="text-sm text-muted-foreground">{pet.species}{pet.breed ? ` • ${pet.breed}` : ''}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
