import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Care logs"
      description="Timestamped care actions, notes, photos, incidents, and unable-to-complete reasons will appear here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
