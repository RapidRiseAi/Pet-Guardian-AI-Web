import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Users"
      description="Admin user search and support-safe account inspection will be added here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
