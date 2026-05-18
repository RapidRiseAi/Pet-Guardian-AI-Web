import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Pet record hub"
      description="Overview, care, medical, documents, sharing, QR, and timeline routes are ready."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
