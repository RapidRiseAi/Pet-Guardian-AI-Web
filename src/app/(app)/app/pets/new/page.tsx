import { createPetAction } from '@/lib/owner/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const error = first(params.error);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Badge tone="info">Owner onboarding</Badge>
      <h1 className="text-3xl font-semibold tracking-[-0.03em]">Add your first pet</h1>
      {error ? <p className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
      <Card>
        <form action={createPetAction} className="grid gap-3 sm:grid-cols-2">
          <input className="min-h-12 rounded-2xl border border-border bg-secondary px-4" name="name" placeholder="Pet name" required />
          <input className="min-h-12 rounded-2xl border border-border bg-secondary px-4" name="species" placeholder="Species" required />
          <input className="min-h-12 rounded-2xl border border-border bg-secondary px-4" name="breed" placeholder="Breed" />
          <input className="min-h-12 rounded-2xl border border-border bg-secondary px-4" name="sex" placeholder="Sex" />
          <input className="min-h-12 rounded-2xl border border-border bg-secondary px-4" name="microchipNumber" placeholder="Microchip number" />
          <input className="min-h-12 rounded-2xl border border-border bg-secondary px-4 sm:col-span-2" name="summary" placeholder="Short summary" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="feedingNotes" placeholder="Feeding instructions" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="walkingNotes" placeholder="Walking or exercise notes" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="medicationNotes" placeholder="Medication schedule notes" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="behaviourNotes" placeholder="Behaviour and house rules" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="allergyNotes" placeholder="Allergies and known triggers" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="emergencyNotes" placeholder="Emergency instructions" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="chronicConditions" placeholder="Chronic conditions" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="allergies" placeholder="Medical allergies" />
          <textarea className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" name="medicalNotes" placeholder="Medical notes" />
          <Button className="sm:col-span-2" type="submit">Create pet profile</Button>
        </form>
      </Card>
    </div>
  );
}
