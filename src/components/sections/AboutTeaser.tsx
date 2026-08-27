import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { TiltCard } from '@/components/ui/TiltCard'

const points = [
  'Operator, not an agency — I run your program personally',
  '10+ years across affiliate networks & creator partnerships',
  'Programs live on Awin, Impact.com, ADCELL & Daisycon',
]

export function AboutTeaser() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal x={-30} y={0}>
            <TiltCard intensity={6} className="group">
              <div className="card-surface relative mx-auto max-w-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/15 via-transparent to-violet-500/20" />
                <Image
                  src="/profile.webp"
                  alt="M. Ammad — affiliate & influencer marketing specialist"
                  width={640}
                  height={640}
                  className="relative h-auto w-full object-cover"
                />
                <div className="glass absolute bottom-4 left-4 right-4 rounded-2xl p-4 backdrop-blur-xl">
                  <p className="font-display text-sm font-bold text-white">M. Ammad</p>
                  <p className="text-xs text-zinc-400">Affiliate & Influencer Marketing Partner</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-accent-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
                Who you&apos;ll work with
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display mt-5 text-3xl font-semibold leading-tight text-gradient-white sm:text-4xl">
                The person running your program is the person you hired
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-base leading-relaxed text-zinc-400">
                No account managers, no hand-offs, no juniors learning on your budget. I&apos;ve built
                partner programs from zero to five-figure monthly revenue for brands like Leica
                Camera, Coway, and Yumi Kim — and I bring that exact playbook to yours.
              </p>
            </Reveal>
            <div className="mt-7 space-y-3">
              {points.map((p, i) => (
                <Reveal key={p} delay={0.2 + i * 0.07}>
                  <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" />
                    {p}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.45}>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-400 hover:text-accent-500"
              >
                More about how I work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
