import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Audit log"
      description="Actor, role, target, action type, and date filtering will make support actions trustworthy."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
