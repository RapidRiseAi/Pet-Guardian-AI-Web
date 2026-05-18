import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Admin workspace"
      description="Operational tables, support tools, partner management, referrals, and audit summaries will be guarded here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
