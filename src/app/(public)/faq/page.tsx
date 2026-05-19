import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const faqs = [
  {
    q: 'Can I control exactly what a sitter can access?',
    a: 'Yes. Owner-managed permissions define which care details, contacts, and records are visible to each sitter.',
  },
  {
    q: 'Can clinics access records without my approval?',
    a: 'No. Clinic access is request-based and only active after owner approval with defined scope and duration.',
  },
  {
    q: 'Does the assistant bypass permissions?',
    a: 'Never. Assistant actions run in the authenticated user context and respect role and data policy boundaries.',
  },
  {
    q: 'Is this only for dogs and cats?',
    a: 'No. Pet profiles are flexible for multiple species with custom notes, routines, and records.',
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
      <Badge tone="info">Frequently asked questions</Badge>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Answers about trust, access, and day-to-day care coordination</h1>
      <div className="mt-10 space-y-4">
        {faqs.map((item) => (
          <Card key={item.q}>
            <h2 className="text-xl font-semibold">{item.q}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
          </Card>
        ))}
      </div>
      <ButtonLink href="/signup" className="mt-8">Start with your first pet</ButtonLink>
    </div>
  );
}
