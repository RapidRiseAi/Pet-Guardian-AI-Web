import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Assigned pets"
      description="Sitters will only see explicitly assigned pets and approved care scopes."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
