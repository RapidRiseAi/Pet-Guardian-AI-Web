import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <EmptyState
      title="Documents"
      description="Supabase Storage-backed pet documents will be uploaded and reviewed here."
      actionHref="/app"
      actionLabel="Back to dashboard"
    />
  );
}
