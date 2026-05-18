import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Settings"
      description="System preferences and role-aware configuration will be added here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
