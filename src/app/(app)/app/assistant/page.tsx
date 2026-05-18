import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Assistant"
      description="Grounded, permission-aware assistant actions will use secure server endpoints."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
