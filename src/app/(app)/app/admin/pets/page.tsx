import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Pets"
      description="Admin pet state review will be constrained and auditable."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
