import { ArrowRight, Bot, Clock3, QrCode, ShieldCheck, Stethoscope, UserRoundCheck, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';

type Feature = {
  title: string;
  description: string;
  icon: keyof typeof icons;
};

type Workflow = {
  title: string;
  text: string;
};

type PublicPageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  features: Feature[];
  workflows: Workflow[];
  ctaLabel?: string;
};

const icons = {
  owner: UserRoundCheck,
  sitter: UsersRound,
  clinic: Stethoscope,
  shield: ShieldCheck,
  qr: QrCode,
  reminder: Clock3,
  assistant: Bot,
};

export function PublicPage({ eyebrow, title, subtitle, features, workflows, ctaLabel = 'Start with your first pet' }: PublicPageProps) {
  return (
    <div className="px-4 py-10 md:py-16">
      <section className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Badge tone="info">{eyebrow}</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg">{ctaLabel}</ButtonLink>
            <ButtonLink href="/how-it-works" variant="secondary" size="lg">See how it works</ButtonLink>
          </div>
        </div>
        <GlassCard>
          <h2 className="text-2xl font-semibold">Continuity of care preview</h2>
          <p className="mt-2 text-sm text-muted-foreground">A calm, role-aware workflow with controlled access for owners, sitters, clinics, and staff.</p>
          <div className="mt-5 space-y-3">
            {workflows.map((item, idx) => (
              <div key={item.title} className="rounded-2xl border border-border bg-secondary p-4">
                <p className="text-xs text-muted-foreground">Step {idx + 1}</p>
                <p className="mt-1 font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = icons[feature.icon];
          return (
            <Card key={feature.title} className="h-full">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto mt-12 max-w-7xl">
        <GlassCard className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.02em]">Ready to organise trusted pet care?</p>
            <p className="mt-2 text-sm text-muted-foreground">Create your workspace, add your first pet, and invite the right people with explicit permissions.</p>
          </div>
          <ButtonLink href="/signup" size="lg" className="w-full md:w-auto">
            Create account <ArrowRight className="size-4" />
          </ButtonLink>
        </GlassCard>
      </section>
    </div>
  );
}
