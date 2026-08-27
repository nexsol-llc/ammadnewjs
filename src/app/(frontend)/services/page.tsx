import type { Metadata } from 'next'
import { ArrowUpRight, Check } from 'lucide-react'
import { GlowOrbs } from '@/components/fx/GlowOrbs'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { MagneticButton } from '@/components/ui/Buttons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { StatsBand } from '@/components/sections/StatsBand'
import { FAQSection } from '@/components/sections/FAQSection'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { networks, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Affiliate program management and influencer marketing for e-commerce & SaaS brands — program setup, partner recruitment, campaign management, and scaling.',
}

const comparisons = [
  { them: 'Junior account manager after the sales call', me: 'The operator you hired runs your program' },
  { them: 'Coupon & cashback sites padding numbers', me: 'Vetted niche creators with real audiences' },
  { them: 'Monthly PDF nobody reads', me: 'Weekly reporting in a shared Slack channel' },
  { them: '12-month lock-in contracts', me: 'Earn-your-stay engagements' },
]

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-10 md:pt-44">
        <GlowOrbs variant="hero" />
        <div className="grid-bg absolute inset-0" />
        <div className="container-x relative text-center">
          <Reveal>
            <span className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-400">
              Services
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl">
              <span className="text-gradient-white">Growth channels you</span>{' '}
              <span className="text-gradient">own, not rent</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
              Two services, one outcome: a partner ecosystem that sells your product on commission —
              so acquisition costs fall while revenue compounds.
            </p>
          </Reveal>
        </div>
      </section>

      <ServicesSection />
      <StatsBand />

      <section className="relative py-24 md:py-32">
        <GlowOrbs variant="section" />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Why an operator"
            title={
              <>
                Big-agency promises. <span className="text-gradient">Freelancer accountability.</span>
              </>
            }
          />
          <Stagger className="mx-auto grid max-w-4xl gap-4" gap={0.08}>
            {comparisons.map((c) => (
              <StaggerItem key={c.me}>
                <div className="card-surface grid gap-3 p-6 sm:grid-cols-2 sm:gap-6">
                  <p className="flex items-start gap-2.5 text-sm text-zinc-500 line-through decoration-red-400/40">
                    {c.them}
                  </p>
                  <p className="flex items-start gap-2.5 text-sm font-medium text-white">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {c.me}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2} className="mt-14 text-center">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              Working across
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {networks.map((n) => (
                <span key={n} className="glass rounded-full px-5 py-2 text-sm text-zinc-300">
                  {n}
                </span>
              ))}
            </div>
            <div className="mt-10">
              <MagneticButton href={site.calendly} external>
                Discuss your brand on a free call
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <ProcessSection />
      <FAQSection />
      <FinalCTA />
    </>
  )
}
