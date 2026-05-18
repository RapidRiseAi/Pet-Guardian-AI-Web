import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Medical profile"
      description="Vaccinations, conditions, medications, visits, and owner-approved clinic history will live here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
