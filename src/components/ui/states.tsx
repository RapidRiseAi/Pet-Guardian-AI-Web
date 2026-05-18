import { AlertTriangle, CheckCircle2, Loader2, LockKeyhole, PawPrint } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';

type StateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function LoadingState({ title = 'Loading care workspace' }: Partial<StateProps>) {
  return (
    <Card className="flex items-center gap-3 text-muted-foreground">
      <Loader2 className="size-5 animate-spin text-primary" />
      <span>{title}</span>
    </Card>
  );
}

export function EmptyState({ title, description, actionHref, actionLabel }: StateProps) {
  return (
    <Card className="text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <PawPrint className="size-6" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionHref && actionLabel ? (
        <ButtonLink href={actionHref} className="mt-5">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </Card>
  );
}

export function ErrorState({ title, description }: StateProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-1 size-5 text-destructive" />
        <div>
          <h2 className="font-semibold text-destructive">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

export function SuccessState({ title, description }: StateProps) {
  return (
    <Card className="border-success/30 bg-success/5">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 size-5 text-success" />
        <div>
          <h2 className="font-semibold text-success">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

export function PermissionBanner({ title, description }: StateProps) {
  return (
    <Card className="border-warning/30 bg-warning/5">
      <div className="flex items-start gap-3">
        <LockKeyhole className="mt-1 size-5 text-warning" />
        <div>
          <h2 className="font-semibold text-warning">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
