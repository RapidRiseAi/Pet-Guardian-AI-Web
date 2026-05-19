import { PublicPage } from '@/components/marketing/public-page';

export default function Page() {
  return (
    <PublicPage
      eyebrow="For clinics"
      title="Move from intake friction to informed care faster"
      subtitle="Request owner-approved access, review allowed records, and log recommendations and follow-up plans in a structured workflow."
      workflows={[
        { title: 'Request access before visit', text: 'Submit a clinic request and receive owner-approved scope before appointment time.' },
        { title: 'Review approved history', text: 'See relevant records, medications, and context needed for safe care decisions.' },
        { title: 'Log visit outcomes', text: 'Capture recommendations, visit notes, and next-visit guidance for continuity.' },
      ]}
      features={[
        { icon: 'clinic', title: 'Clinic operations workspace', description: 'Desktop-ready panels and records for efficient patient review.' },
        { icon: 'shield', title: 'Compliance-minded access', description: 'Records are visible only with explicit owner permission and scope.' },
        { icon: 'reminder', title: 'Follow-up coordination', description: 'Care teams and owners remain aligned on next steps and reminders.' },
      ]}
    />
  );
}
