import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Content settings"
      description="Legal copy, notification templates, and system copy placeholders will be prepared here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
