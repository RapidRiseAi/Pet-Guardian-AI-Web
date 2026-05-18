import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Approved patients"
      description="Clinics will only see pets with valid owner-approved grants."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
