import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="QR identity"
      description="Controlled QR entry never exposes raw pet data without a valid authorization decision."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
