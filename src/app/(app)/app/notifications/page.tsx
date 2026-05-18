import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Notifications"
      description="In-app feed cards and desktop filters will show approvals, reminders, visits, and delivery states."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
