import { PublicPage } from '@/components/marketing/public-page';

export default function Page() {
  return (
    <PublicPage
      eyebrow="Workflow clarity"
      title="How PetGuardian AI coordinates trusted pet care"
      subtitle="From first profile setup to sitter handoff and clinic follow-up, every step is permission-based, trackable, and designed for calm execution."
      workflows={[
        { title: 'Create the pet profile', text: 'Owners set routines, medication context, emergency contacts, and care notes in one place.' },
        { title: 'Approve access by role', text: 'Sitters and clinics request access. Owners approve exact scopes and timelines.' },
        { title: 'Keep care logs current', text: 'Visits, tasks, medication confirmations, and notes are logged so everyone stays aligned.' },
      ]}
      features={[
        { icon: 'shield', title: 'Permission-first architecture', description: 'No one sees pet data unless explicitly approved by role and scope.' },
        { icon: 'qr', title: 'Controlled QR sharing', description: 'Use QR access for quick check-ins without opening full account history.' },
        { icon: 'reminder', title: 'Reliable reminders', description: 'Medication, feeding, and follow-up reminders are delivered on time.' },
        { icon: 'assistant', title: 'Assistant support', description: 'Ask questions in-app or WhatsApp with identity-aware, policy-safe actions.' },
        { icon: 'sitter', title: 'Sitter-ready workflows', description: 'Mobile-first task views keep day-to-day care simple and accurate.' },
        { icon: 'clinic', title: 'Clinic continuity', description: 'Owner-approved records make appointments faster and more informed.' },
      ]}
    />
  );
}
