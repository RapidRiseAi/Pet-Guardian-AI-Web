import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Sharing controls"
      description="Owners will approve, deny, scope, expire, and revoke sitter and clinic access here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
