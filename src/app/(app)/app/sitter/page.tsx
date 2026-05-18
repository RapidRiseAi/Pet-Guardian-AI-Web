import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Sitter workspace"
      description="Today’s care tasks and pet instructions will be optimized for fast mobile logging."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
