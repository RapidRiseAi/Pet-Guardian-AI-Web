import { EmptyState } from '@/components/ui/states';

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <EmptyState
        title="Contact"
        description="This public conversion page is wired into the route structure and ready for the next marketing build prompt."
        actionHref="/signup"
        actionLabel="Start with your first pet"
      />
    </div>
  );
}
