import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="px-4 py-10 md:py-16">
      <section className="mx-auto max-w-6xl">
        <Badge tone="info">Contact PetGuardian AI</Badge>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Talk with our team about owner, sitter, or clinic workflows</h1>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-2xl font-semibold">Send a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">We typically respond within one business day.</p>
          <form className="mt-6 space-y-4">
            <input className="min-h-12 w-full rounded-2xl border border-border bg-secondary px-4" placeholder="Full name" />
            <input className="min-h-12 w-full rounded-2xl border border-border bg-secondary px-4" placeholder="Email" type="email" />
            <select className="min-h-12 w-full rounded-2xl border border-border bg-secondary px-4" defaultValue="owners">
              <option value="owners">I am a pet owner</option>
              <option value="sitters">I am a sitter</option>
              <option value="clinics">I am a clinic</option>
              <option value="partner">I am a partner</option>
            </select>
            <textarea className="min-h-40 w-full rounded-2xl border border-border bg-secondary px-4 py-3" placeholder="How can we help?" />
            <ButtonLink href="mailto:support@petguardian.ai" className="w-full">Send via email</ButtonLink>
          </form>
        </Card>
        <GlassCard>
          <h3 className="text-xl font-semibold">Prefer self-serve?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create your account and complete onboarding in minutes.</p>
          <div className="mt-6 space-y-3">
            <ButtonLink href="/signup" className="w-full">Create account</ButtonLink>
            <ButtonLink href="/faq" variant="secondary" className="w-full">Read FAQ</ButtonLink>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
