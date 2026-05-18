import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Partners"
      description="Sitter and clinic partner status workflows will be managed here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
