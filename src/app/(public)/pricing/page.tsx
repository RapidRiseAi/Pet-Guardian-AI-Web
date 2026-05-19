import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    cadence: '/month',
    summary: 'For one pet and basic care coordination.',
    features: ['1 pet profile', 'Core reminders', 'Basic document storage', 'Sitter sharing'],
  },
  {
    name: 'Plus',
    price: '$12',
    cadence: '/month',
    summary: 'For multi-pet households and richer workflows.',
    features: ['Up to 5 pets', 'Advanced reminders', 'QR sharing controls', 'Clinic request workflows'],
  },
  {
    name: 'Pro Care',
    price: '$24',
    cadence: '/month',
    summary: 'For power users and partner-led care networks.',
    features: ['Unlimited pets', 'Priority support', 'Assistant channel preferences', 'Audit-ready timeline'],
  },
];

export default function Page() {
  return (
    <div className="px-4 py-10 md:py-16">
      <section className="mx-auto max-w-7xl">
        <Badge tone="info">Transparent pricing</Badge>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Choose the care coordination plan that fits your household</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Start free and scale as your routines, sitters, and clinic collaboration grow.</p>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-4 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <Card key={plan.name} className={idx === 1 ? 'border-primary/50 shadow-[0_0_0_1px_rgba(88,240,214,0.25)]' : ''}>
            {idx === 1 ? <Badge tone="success">Most popular</Badge> : null}
            <h2 className="mt-3 text-2xl font-semibold">{plan.name}</h2>
            <p className="mt-3 text-4xl font-semibold">{plan.price}<span className="text-base text-muted-foreground">{plan.cadence}</span></p>
            <p className="mt-2 text-sm text-muted-foreground">{plan.summary}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2"><Check className="size-4 text-success" /> {feature}</li>
              ))}
            </ul>
            <ButtonLink href="/signup" className="mt-6 w-full">Start with {plan.name}</ButtonLink>
          </Card>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-7xl">
        <GlassCard className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">Need clinic or partner deployment pricing? Contact us for implementation and onboarding support.</p>
          <ButtonLink href="/contact" variant="secondary">Contact sales</ButtonLink>
        </GlassCard>
      </section>
    </div>
  );
}
