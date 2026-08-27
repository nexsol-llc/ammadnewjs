import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, Compass, LineChart, ShieldCheck, Sparkles } from 'lucide-react'
import { GlowOrbs } from '@/components/fx/GlowOrbs'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { MagneticButton } from '@/components/ui/Buttons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TiltCard } from '@/components/ui/TiltCard'
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
        <GlowOrbs variant="hero" />
        <div className="grid-bg absolute inset-0" />
        <div className="container-x relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Reveal>
                <span className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-400">
                  About me
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-display mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl">
                  <span className="text-gradient-white">I turn brand partnerships into</span>{' '}
                  <span className="text-gradient">revenue engines</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                  I&apos;m M. Ammad. For over a decade I&apos;ve been on the operator side of
                  performance partnerships — building affiliate programs from zero, rescuing dormant
                  ones, and running influencer campaigns that convert instead of just reach.
                </p>
              </Reveal>
              <Reveal delay={0.28}>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
                  The brands I work with — from Leica Camera to Coway to DTC startups — all had the
                  same problem: great products, rising ad costs, and no owned growth channel. My job
                  is to fix exactly that, personally, without agency bloat.
                </p>
              </Reveal>
              <Reveal delay={0.36}>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <MagneticButton href={site.calendly} external>
                    Book a free growth call
                    <ArrowUpRight className="h-4 w-4" />
                  </MagneticButton>
                  <MagneticButton href="/case-studies" variant="ghost">
                    See my track record
                  </MagneticButton>
                </div>
              </Reveal>
            </div>

            <Reveal x={30} y={0} delay={0.15}>
              <TiltCard intensity={6} className="group">
                <div className="card-surface relative mx-auto max-w-sm overflow-hidden lg:max-w-md">
                  <div className="absolute inset-0 z-10 bg-gradient-to-tr from-accent-500/15 via-transparent to-violet-500/20" />
                  <Image
                    src="/profile.webp"
                    alt="M. Ammad"
                    width={640}
                    height={640}
                    priority
                    className="h-auto w-full object-cover"
                  />
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      <StatsBand />

      <section className="relative py-24 md:py-32">
        <GlowOrbs variant="section" />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Operating principles"
            title={
              <>
                How I <span className="text-gradient">work</span>
              </>
            }
          />
          <Stagger className="grid gap-6 sm:grid-cols-2" gap={0.1}>
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="card-surface group h-full p-8 transition-colors duration-300 hover:border-accent-500/25">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-400 transition-transform duration-300 group-hover:scale-110">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display mt-6 text-xl font-semibold text-white">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{v.text}</p>
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
