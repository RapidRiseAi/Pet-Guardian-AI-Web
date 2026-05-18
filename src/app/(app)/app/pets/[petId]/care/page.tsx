import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Care profile"
      description="Feeding, walking, medication routines, behavior notes, and house rules will live here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
