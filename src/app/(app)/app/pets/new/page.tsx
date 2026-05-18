import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Add your first pet"
      description="The owner onboarding pet creation flow will capture identity, care, medical, contacts, and reminders."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
