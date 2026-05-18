import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Reminders center"
      description="Medication, feeding, grooming, checkup, and custom reminder workflows will be added here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
