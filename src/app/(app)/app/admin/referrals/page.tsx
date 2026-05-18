import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Referrals"
      description="Partner-linked conversions and commission placeholders will be tracked here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
