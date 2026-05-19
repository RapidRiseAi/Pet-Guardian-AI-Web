import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Card><div className="h-6 w-48 animate-pulse rounded bg-secondary" /></Card>
      <Card><div className="h-20 animate-pulse rounded bg-secondary" /></Card>
      <Card><div className="h-20 animate-pulse rounded bg-secondary" /></Card>
    </div>
  );
}
