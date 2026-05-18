import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Timeline"
      description="Changes, reminders, visits, document uploads, and access events will be audited here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
