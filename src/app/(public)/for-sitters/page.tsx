import { PublicPage } from '@/components/marketing/public-page';

export default function Page() {
  return (
    <PublicPage
      eyebrow="For sitters"
      title="Get today's care instructions with zero guesswork"
      subtitle="See approved pets, follow clear routines, and log completed care actions from a mobile-first workspace."
      workflows={[
        { title: 'Receive approved assignment', text: 'Owners assign pets and define exactly which care details you can access.' },
        { title: 'Execute daily tasks', text: 'Use task-ready cards for feeding, medication, walks, and incident notes.' },
        { title: 'Confirm and report', text: 'Log completion and observations so owners keep full continuity records.' },
      ]}
      features={[
        { icon: 'sitter', title: 'Thumb-friendly sitter dashboard', description: 'Designed for quick, accurate updates while actively caring for pets.' },
        { icon: 'shield', title: 'Access by approval only', description: 'View only the data needed to do your assigned care safely.' },
        { icon: 'assistant', title: 'Assistant quick help', description: 'Ask for routine clarifications and reminder context without leaving flow.' },
      ]}
    />
  );
}
