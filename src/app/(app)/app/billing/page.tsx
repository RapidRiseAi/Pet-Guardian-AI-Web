import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Billing"
      description="Plan and invoice placeholders are ready for future subscription integration."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
