import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { StatusTone } from '@/types/roles';

const tones: Record<StatusTone, string> = {
  neutral: 'border-border bg-secondary text-muted-foreground',
  info: 'border-primary/25 bg-primary/10 text-primary',
  success: 'border-success/25 bg-success/10 text-success',
  warning: 'border-warning/25 bg-warning/10 text-warning',
  danger: 'border-destructive/25 bg-destructive/10 text-destructive',
};

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: StatusTone }) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
