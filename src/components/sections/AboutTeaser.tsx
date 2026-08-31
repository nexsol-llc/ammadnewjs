import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { aboutPoints } from '@/lib/site'

export function AboutTeaser() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1fr]">
          <Reveal x={-24} y={0}>
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-100 to-fuchsia-100 opacity-70 blur-2xl" />
              <div className="card relative overflow-hidden !rounded-[1.75rem] p-0">
                <Image
                  src="/profile.webp"
                  alt="M. Ammad — affiliate & influencer marketing partner"
                  width={640}
                  height={640}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="card absolute -bottom-5 -right-4 hidden px-4 py-3 sm:block">
                <p className="heading text-lg">10+ yrs</p>
                <p className="text-xs text-ink-400">in partnerships</p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="pill">About me</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="heading mt-5 text-3xl leading-[1.12] sm:text-4xl">
                The person running your program is the{' '}
                <span className="text-gradient">person you hired</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-base leading-relaxed text-ink-500">
                I&apos;m M. Ammad. For over a decade I&apos;ve been on the operator side of
                performance partnerships — building affiliate programs from zero, rescuing dormant
                ones, and running influencer campaigns that convert instead of just reach. No
                account managers, no hand-offs, no juniors learning on your budget.
              </p>
            </Reveal>
            <div className="mt-7 space-y-3">
              {aboutPoints.map((p, i) => (
                <Reveal key={p} delay={0.2 + i * 0.06}>
                  <div className="flex items-start gap-3 text-sm text-ink-700">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    {p}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.45}>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
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
