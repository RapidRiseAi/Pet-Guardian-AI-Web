import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card, GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';

export default async function Page({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: pet } = await supabase.from('pets').select('id,name,species').eq('id', petId).maybeSingle();
  if (!pet) return <Card><p className="font-semibold">Pet not found</p></Card>;
  const scanUrl = `/scan/${petId}`;

  return (
    <div className="space-y-4">
      <GlassCard>
        <Badge tone="info">Secure QR identity</Badge>
        <h1 className="mt-3 text-3xl font-semibold">{pet.name} QR access card</h1>
        <p className="mt-2 text-sm text-muted-foreground">Scanning this QR never reveals raw data. Every scan routes through access checks and role policies.</p>
      </GlassCard>
      <Card>
        <p className="font-semibold">Scan entry</p>
        <p className="mt-1 text-sm text-muted-foreground break-all">{scanUrl}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href={scanUrl}>Preview scan experience</ButtonLink>
          <ButtonLink href={scanUrl} variant="secondary">Copy/share link</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
