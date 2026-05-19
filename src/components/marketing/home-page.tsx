import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { DocumentCard, PermissionCard, ReminderCard, StepItem } from '@/components/ui/primitives';

export function HomePage() {
  return (
    <div className="px-4 py-10 md:py-16">
      <section className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Badge tone="info">Premium, trusted care coordination</Badge>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
            Your pet&apos;s care, history, and trusted access in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Keep routines clear, records organised, reminders on time, and the right information
            available to the right people.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg">
              Start with your first pet
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="secondary" size="lg">
              See how it works
            </ButtonLink>
          </div>
        </div>
        <GlassCard className="space-y-4">
          <div className="rounded-[1.5rem] border border-border bg-background/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today for Max</p>
                <h2 className="text-2xl font-semibold">Care cockpit</h2>
              </div>
              <Badge tone="success">Owner controlled</Badge>
            </div>
            <div className="mt-5 grid gap-3">
              <ReminderCard />
              <DocumentCard title="Vaccination card" meta="Shared with Riverside Clinic" />
              <PermissionCard />
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-4 md:grid-cols-3">
        <GlassCard>
          <StepItem
            index={1}
            title="Owners organise"
            text="Profiles, care routines, documents, reminders, and QR access are managed from one calm workspace."
          />
        </GlassCard>
        <GlassCard>
          <StepItem
            index={2}
            title="Sitters follow"
            text="Approved carers see only the tasks and emergency details they need, with fast mobile logging."
          />
        </GlassCard>
        <GlassCard>
          <StepItem
            index={3}
            title="Clinics request"
            text="Vet teams request owner-approved access, review allowed history, and log visits securely."
          />
        </GlassCard>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-2">
        <GlassCard>
          <h3 className="text-2xl font-semibold">QR sharing with clear boundaries</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Share the right information without exposing everything. Owners control what each role can view and for how long.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="text-2xl font-semibold">Assistant in-app and on WhatsApp</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Ask about feeding, medication, reminders, records, or access requests. Assistant actions always respect your permissions.
          </p>
        </GlassCard>
      </section>

      <section className="mx-auto mt-12 max-w-7xl">
        <GlassCard className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="text-2xl font-semibold">FAQ preview</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• Can I share emergency instructions with a sitter without sharing medical history? Yes, with role-scoped permissions.</li>
              <li>• Can clinics request access before an appointment? Yes, owners approve each clinic access flow.</li>
              <li>• Will reminders sync across channels? In-app first, with email and WhatsApp based on preferences.</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <ButtonLink href="/faq" variant="secondary">View full FAQ</ButtonLink>
            <ButtonLink href="/signup">Create your PetGuardian account</ButtonLink>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
