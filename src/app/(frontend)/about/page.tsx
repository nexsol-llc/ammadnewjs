import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight, Compass, LineChart, ShieldCheck, Sparkles } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatsBand } from '@/components/sections/StatsBand'
import { LogoMarquee } from '@/components/sections/LogoMarquee'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'M. Ammad — affiliate & influencer marketing operator with 10+ years of experience scaling partner programs for e-commerce and SaaS brands worldwide.',
}

const values = [
  {
    icon: LineChart,
    title: 'Dashboard truth only',
    text: 'Every claim I make traces back to a network dashboard — Awin, Impact.com, ADCELL, or Daisycon. If it is not tracked, it does not count.',
  },
  {
    icon: ShieldCheck,
    title: 'Your brand, protected',
    text: 'No spammy coupon sites, no fake-follower creators, no grey-hat placements. Fraud detection and compliance are built into every program I run.',
  },
  {
    icon: Compass,
    title: 'Niche over noise',
    text: 'A hundred aligned partners beat ten thousand random ones. I recruit creators whose audiences already want what you sell.',
  },
  {
    icon: Sparkles,
    title: 'Relationships compound',
    text: 'Partners stay where they are supported. Weekly comms, fair commissions, and fast payouts keep your best publishers producing.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44">
        <div className="mesh-bg absolute inset-0" />
        <div className="grid-fade absolute inset-0" />
        <div className="container-x relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Reveal>
                <span className="pill">About me</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="heading mt-6 text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
                  I turn brand partnerships into{' '}
                  <span className="text-gradient">revenue engines</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
                  I&apos;m M. Ammad. For over a decade I&apos;ve been on the operator side of
                  performance partnerships — building affiliate programs from zero, rescuing dormant
                  ones, and running influencer campaigns that convert instead of just reach.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-500">
                  The brands I work with — from Leica Camera to Coway to DTC startups — all had the
                  same problem: great products, rising ad costs, and no owned growth channel. My job
                  is to fix exactly that, personally, without agency bloat.
                </p>
              </Reveal>
              <Reveal delay={0.32}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={site.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Book a free growth call
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/case-studies" className="btn btn-ghost">
                    See my track record
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal x={24} y={0} delay={0.15}>
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-100 to-fuchsia-100 opacity-70 blur-2xl" />
                <div className="card relative overflow-hidden !rounded-[1.75rem] p-0">
                  <Image
                    src="/profile.webp"
                    alt="M. Ammad"
                    width={640}
                    height={640}
                    priority
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <StatsBand />

      <section className="relative py-24 md:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Operating principles"
            title={
              <>
                How I <span className="text-gradient">work</span>
              </>
            }
          />
          <Stagger className="grid gap-6 sm:grid-cols-2" gap={0.08}>
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="card card-hover group h-full p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="heading mt-6 text-xl">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{v.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <LogoMarquee />
      <FinalCTA />
    </>
  )
}
