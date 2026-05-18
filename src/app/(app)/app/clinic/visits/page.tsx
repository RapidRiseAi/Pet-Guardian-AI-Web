import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Visit records"
      description="Visits, medications, recommendations, vaccinations, and follow-up reminders will be logged here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
