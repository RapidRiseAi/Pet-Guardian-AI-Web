import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Pet profiles"
      description="Mobile-first pet cards and desktop record hubs will be layered onto this route."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
