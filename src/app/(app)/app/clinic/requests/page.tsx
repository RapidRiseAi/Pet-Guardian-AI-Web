import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Clinic requests"
      description="Request status, scope, duration, approval, rejection, and expiry states will be explicit."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
