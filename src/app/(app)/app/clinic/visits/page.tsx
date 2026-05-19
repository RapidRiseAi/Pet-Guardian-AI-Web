import { createClinicVisitAction } from '@/lib/clinic/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: patients } = await supabase.from('clinic_pet_links').select('pet_id,pets(name)').eq('status', 'active').limit(30);
  const { data: visits } = await supabase.from('visit_records').select('id,pet_id,visited_at,reason,diagnosis,pets(name)').order('visited_at', { ascending: false }).limit(20);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Visit workflows</h1>
      <Card>
        <h2 className="text-xl font-semibold">Log visit outcome</h2>
        <form action={createClinicVisitAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <select name="petId" className="min-h-12 rounded-2xl border border-border bg-secondary px-4 sm:col-span-2" required>
            <option value="">Select approved patient</option>
            {(patients ?? []).map((p) => <option key={p.pet_id} value={p.pet_id}>{(p.pets as { name?: string } | null)?.name ?? 'Pet'}</option>)}
          </select>
          <input name="reason" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" placeholder="Visit reason" />
          <input name="followUpAt" type="datetime-local" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" />
          <textarea name="diagnosis" className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" placeholder="Diagnosis" />
          <textarea name="treatmentNotes" className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" placeholder="Treatment notes" />
          <input name="medicationName" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" placeholder="Medication name (optional)" />
          <input name="medicationDosage" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" placeholder="Medication dosage" />
          <input name="medicationFrequency" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" placeholder="Medication frequency" />
          <input name="medicationInstructions" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" placeholder="Medication instructions" />
          <input name="vaccineName" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" placeholder="Vaccination name (optional)" />
          <input name="vaccineBatch" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" placeholder="Vaccine batch" />
          <input name="administeredOn" type="date" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" />
          <input name="vaccineDueOn" type="date" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" />
          <input name="recommendationTitle" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" placeholder="Recommendation title (optional)" />
          <input name="recommendationDueAt" type="datetime-local" className="min-h-12 rounded-2xl border border-border bg-secondary px-4" />
          <textarea name="recommendationDetails" className="min-h-24 rounded-2xl border border-border bg-secondary px-4 py-3 sm:col-span-2" placeholder="Recommendation details" />
          <Button type="submit" className="sm:col-span-2">Save visit workflow</Button>
        </form>
      </Card>
      {(visits ?? []).map((visit) => (
        <Card key={visit.id}>
          <p className="font-semibold">{(visit.pets as { name?: string } | null)?.name ?? 'Pet'}</p>
          <p className="text-sm text-muted-foreground">{new Date(visit.visited_at).toLocaleString()}</p>
          <p className="mt-1 text-sm">{visit.reason ?? 'General review'}</p>
          {visit.diagnosis ? <p className="mt-1 text-sm text-muted-foreground">{visit.diagnosis}</p> : null}
        </Card>
      ))}
    </div>
  );
}
