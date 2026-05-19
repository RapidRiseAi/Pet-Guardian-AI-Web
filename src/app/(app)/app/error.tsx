'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('App route error', error);
  }, [error]);

  return (
    <Card>
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">We logged this issue. Please try again.</p>
      <Button className="mt-4" onClick={reset}>Retry</Button>
    </Card>
  );
}
