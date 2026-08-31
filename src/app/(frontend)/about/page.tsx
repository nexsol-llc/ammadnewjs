import type { Metadata } from 'next'
import Image from 'next/image'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Compass,
  GraduationCap,
  Handshake,
  LineChart,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatsBand } from '@/components/sections/StatsBand'
import { LogoMarquee } from '@/components/sections/LogoMarquee'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Muhammad Ammad — co-founder of Affilinks.io and Nexsol LLC, scaling affiliate & influencer programs for e-commerce and SaaS brands since 2014.',
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

const milestones = [
  { icon: CalendarDays, label: 'Started in', value: '2014' },
  { icon: GraduationCap, label: 'Graduated from', value: 'UET' },
  { icon: Handshake, label: 'Co-founder of', value: 'Affilinks.io' },
  { icon: Building2, label: 'Owner of', value: 'Nexsol LLC' },
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

      {/* ── The story ─────────────────────────────────────────── */}
      <section className="section-alt relative py-16 md:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="My story"
            title={
              <>
                From publisher to <span className="text-gradient">partnership operator</span>
              </>
            }
          />

          <Stagger className="mx-auto mb-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4" gap={0.06}>
            {milestones.map((m) => (
              <StaggerItem key={m.value}>
                <div className="card h-full p-4 text-center">
                  <m.icon className="mx-auto h-5 w-5 text-brand-600" />
                  <p className="mt-2.5 text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
                    {m.label}
                  </p>
                  <p className="heading mt-1 text-base">{m.value}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-ink-500 md:text-[1.05rem]">
            <Reveal>
              <p>
                My full name is{' '}
                <strong className="font-semibold text-ink-950">Muhammad Ammad</strong>, the founder
                of Affilinks.io. My journey into affiliate marketing started in 2014, guided by my
                brother, <strong className="font-semibold text-ink-950">Zeeshan Ali</strong>, who
                introduced me to the industry. Together, we took our first steps into digital
                commerce, combining our efforts to help businesses navigate online growth. Around the
                same time, I completed my graduation from the University of Engineering and
                Technology (UET), grounding my analytical mindset in formal engineering principles.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <p>
                Starting out as a publisher, I quickly gained hands-on experience scaling hundreds of
                brands. However, working closely within the ecosystem exposed a critical gap in the
                market: brand affiliate programs were frequently suffering from low engagement and
                high partner dormancy rates. Recognising that standard strategies were falling short,
                I dedicated myself to mastering the complexities of affiliate program management.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p>
                I immersed myself in the mechanics of performance marketing — studying case studies,
                attending industry seminars, listening to specialised podcasts, and analysing
                top-performing strategies. I began testing and refining tailored management
                frameworks across different industries, transforming idle affiliate networks into
                reliable revenue drivers.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p>
                That rigorous testing paid off. Over the years, I have helped scale thousands of
                brands, building high-converting affiliate and influencer marketing engines that
                deliver measurable, profitable growth.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="card mt-8 border-brand-200 bg-white p-7 md:p-8">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-600">
                  Today
                </p>
                <p className="mt-3 text-base leading-relaxed text-ink-700 md:text-[1.05rem]">
                  Zeeshan and I are the founders of{' '}
                  <strong className="font-semibold text-ink-950">Affilinks.io</strong> and owners of{' '}
                  <strong className="font-semibold text-ink-950">Nexsol LLC</strong>. What began as a
                  joint venture in 2014 has evolved into a dedicated agency where we build, manage,
                  and scale high-impact affiliate and influencer programs for brands worldwide.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20">
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
