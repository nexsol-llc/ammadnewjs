import { ArrowRight, Calculator, Check } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/lib/site'

const bullets = [
  'A free 30-minute strategy call — no pitch deck, no pressure',
  'A candid read on whether partnerships fit your unit economics',
  'A projected ROAS range based on comparable programs I run',
]

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
      <div className="mesh-dark absolute inset-0" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="pill-dark">Let&apos;s talk</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="heading mt-6 text-3xl leading-[1.1] text-white sm:text-4xl md:text-5xl">
              Your competitors are building{' '}
              <span className="bg-gradient-to-r from-brand-300 to-fuchsia-400 bg-clip-text text-transparent">
                partner programs right now.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/60 md:text-lg">
              Every month without one is margin handed to ad platforms. Let&apos;s find out what an
              affiliate or influencer channel could do for your brand.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mx-auto mt-8 inline-flex max-w-md flex-col gap-3 text-left">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-white/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Book Your Free Growth Call
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/#revenue-calculator" className="btn btn-dark">
                <Calculator className="h-4 w-4" />
                Try the revenue calculator
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-6 text-xs text-white/35">
              Usually replies within 24 hours · {site.email}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
