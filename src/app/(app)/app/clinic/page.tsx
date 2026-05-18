import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Clinic workspace"
      description="Desktop-optimized access request and patient review workflows will be built here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
