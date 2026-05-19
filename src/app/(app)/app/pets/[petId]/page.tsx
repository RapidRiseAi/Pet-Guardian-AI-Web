import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export default async function Page({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: pet } = await supabase.from('pets').select('id,name,species,breed,summary,microchip_number').eq('id', petId).maybeSingle();
  if (!pet) notFound();

  const links = [
    ['Care profile', `/app/pets/${petId}/care`],
    ['Medical profile', `/app/pets/${petId}/medical`],
    ['Documents', `/app/pets/${petId}/documents`],
    ['Sharing', `/app/pets/${petId}/sharing`],
    ['QR card', `/app/pets/${petId}/qr`],
    ['Timeline', `/app/pets/${petId}/timeline`],
  ];

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-3xl font-semibold">{pet.name}</h1>
        <p className="text-muted-foreground">{pet.species}{pet.breed ? ` • ${pet.breed}` : ''}</p>
        <p className="mt-2 text-sm text-muted-foreground">{pet.summary ?? 'No summary yet.'}</p>
        <p className="mt-1 text-xs text-muted-foreground">Microchip: {pet.microchip_number ?? 'Not set'}</p>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(([label, href]) => (
          <Link key={href} href={href}><Card><p className="font-semibold">{label}</p></Card></Link>
        ))}
      </div>
    </div>
  );
}
