import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: links } = await supabase
    .from('clinic_pet_links')
    .select('id,pet_id,status,starts_at,expires_at,pets(name,species,breed)')
    .order('starts_at', { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Approved patients</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {(links ?? []).map((link) => (
          <Link key={link.id} href={`/app/pets/${link.pet_id}`}>
            <Card>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{(link.pets as { name?: string } | null)?.name ?? 'Pet'}</p>
                <Badge tone={link.status === 'active' ? 'success' : 'warning'}>{link.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{(link.pets as { species?: string; breed?: string } | null)?.species ?? ''}</p>
              <p className="mt-2 text-xs text-muted-foreground">Access window: {new Date(link.starts_at).toLocaleDateString()} {link.expires_at ? `→ ${new Date(link.expires_at).toLocaleDateString()}` : '→ open'}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
