import { PublicPage } from '@/components/marketing/public-page';

export default function Page() {
  return (
    <PublicPage
      eyebrow="For pet owners"
      title="Stay in control while everyone else stays aligned"
      subtitle="Organise your pet's profile, routines, records, reminders, and sharing rules so trusted people can help without confusion."
      workflows={[
        { title: 'Set your pet baseline', text: 'Build care and medical profiles with feeding, medications, allergies, and contacts.' },
        { title: 'Share exactly what is needed', text: 'Grant sitter or clinic access to only the relevant records and tasks.' },
        { title: 'Track continuity over time', text: 'Follow reminders, visit records, and care logs from one timeline.' },
      ]}
      features={[
        { icon: 'owner', title: 'Owner command center', description: 'One place for routines, records, documents, and access decisions.' },
        { icon: 'reminder', title: 'Smart reminder rhythm', description: 'Medication, feeding, and follow-up schedules remain clear and consistent.' },
        { icon: 'qr', title: 'QR for fast handoffs', description: 'Provide critical info quickly during emergencies or temporary care transitions.' },
      ]}
    />
  );
}
