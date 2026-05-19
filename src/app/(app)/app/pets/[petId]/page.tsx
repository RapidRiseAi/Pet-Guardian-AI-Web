import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Card, GlassCard } from '@/components/ui/card';

export default async function Page({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: pet }, { count: docCount }, { count: reminderCount }] = await Promise.all([
    supabase.from('pets').select('id,name,species,breed,summary,microchip_number').eq('id', petId).maybeSingle(),
    supabase.from('pet_documents').select('id', { count: 'exact', head: true }).eq('pet_id', petId).is('deleted_at', null),
    supabase.from('reminders').select('id', { count: 'exact', head: true }).eq('pet_id', petId).is('deleted_at', null),
  ]);
  if (!pet) notFound();

  const completion = [pet.summary, pet.microchip_number].filter(Boolean).length >= 2 ? 'Complete' : 'Needs details';
  const links = [
    ['Overview', `/app/pets/${petId}`],
    ['Care', `/app/pets/${petId}/care`],
    ['Medical', `/app/pets/${petId}/medical`],
    ['Documents', `/app/pets/${petId}/documents`],
    ['Sharing', `/app/pets/${petId}/sharing`],
    ['QR', `/app/pets/${petId}/qr`],
    ['Timeline', `/app/pets/${petId}/timeline`],
  ];

  return (
    <div className="space-y-4">
      <GlassCard>
        <Badge tone={completion === 'Complete' ? 'success' : 'warning'}>{completion}</Badge>
        <h1 className="mt-3 text-3xl font-semibold">{pet.name}</h1>
        <p className="text-muted-foreground">{pet.species}{pet.breed ? ` • ${pet.breed}` : ''}</p>
      </GlassCard>
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-sm text-muted-foreground">Profile summary</p>
          <p className="mt-2 text-sm">{pet.summary ?? 'Add a summary to improve sitter and clinic handovers.'}</p>
          <p className="mt-2 text-xs text-muted-foreground">Microchip: {pet.microchip_number ?? 'Not set'}</p>
          <p className="mt-2 text-xs text-muted-foreground">Documents: {docCount ?? 0} • Reminders: {reminderCount ?? 0}</p>
        </Card>
        <Card>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-2xl border border-border bg-secondary px-3 py-3 text-sm font-semibold">
                {label}
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
