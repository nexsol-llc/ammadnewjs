import type { Metadata } from 'next'
import { ArrowRight, Check, X } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { RoadmapSection } from '@/components/sections/RoadmapSection'
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
  { them: 'Coupon & cashback sites padding the numbers', me: 'Vetted niche creators with real audiences' },
  { them: 'A monthly PDF nobody reads', me: 'Weekly reporting in a shared Slack channel' },
  { them: '12-month lock-in contracts', me: 'Earn-your-stay engagements' },
]

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-8 md:pt-44">
        <div className="mesh-bg absolute inset-0" />
        <div className="grid-fade absolute inset-0" />
        <div className="container-x relative text-center">
          <Reveal>
            <span className="pill">Services</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="heading mx-auto mt-6 max-w-3xl text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
              Growth channels you <span className="text-gradient">own, not rent</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-2xl text-base text-ink-500 sm:text-lg">
              Two services, one outcome: a partner ecosystem that sells your product on commission —
              so acquisition costs fall while revenue compounds.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Book a free growth call
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <ServicesSection />
      <StatsBand />

      <section className="section-alt relative py-24 md:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why an operator"
            title={
              <>
                Big-agency promises. <span className="text-gradient">Freelancer accountability.</span>
              </>
            }
          />
          <Stagger className="mx-auto grid max-w-3xl gap-3" gap={0.07}>
            {comparisons.map((c) => (
              <StaggerItem key={c.me}>
                <div className="card grid gap-3 p-6 sm:grid-cols-2 sm:gap-6">
                  <p className="flex items-start gap-2.5 text-sm text-ink-400">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span className="line-through decoration-red-300">{c.them}</span>
                  </p>
                  <p className="flex items-start gap-2.5 text-sm font-medium text-ink-950">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" />
                    {c.me}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2} className="mt-14 text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
              Working across
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {networks.map((n) => (
                <span
                  key={n.name}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: n.color }} />
                  {n.name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <RoadmapSection />
      <FAQSection />
      <FinalCTA />
    </>
  )
}
