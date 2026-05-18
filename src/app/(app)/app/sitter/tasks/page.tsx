import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Today’s tasks"
      description="Large tap targets and sticky actions will support feeding, walking, medication, and custom logs."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
