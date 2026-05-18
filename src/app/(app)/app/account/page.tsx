import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Account"
      description="Profile, preferences, security, and connected channels will be managed here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
