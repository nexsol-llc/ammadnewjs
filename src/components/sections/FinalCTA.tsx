import { ArrowUpRight, Check } from 'lucide-react'
import { GlowOrbs } from '@/components/fx/GlowOrbs'
import { Reveal } from '@/components/ui/Reveal'
import { MagneticButton } from '@/components/ui/Buttons'
import { site } from '@/lib/site'

const bullets = [
  'A free 30-minute strategy call — no pitch deck, no pressure',
  'A candid read on whether partnerships fit your unit economics',
  'A projected ROAS range based on comparable programs I run',
]

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <GlowOrbs variant="cta" />
      <div className="grid-bg absolute inset-0" />
      <div className="container-x relative">
        <div className="card-surface mx-auto max-w-4xl p-10 text-center md:p-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              <span className="text-gradient-white">Your competitors are building</span>
              <br />
              <span className="text-gradient">partner programs right now.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base text-zinc-400 md:text-lg">
              Every month without one is margin handed to ad platforms. Let&apos;s find out what an
              affiliate or influencer channel could do for your brand.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="mx-auto mt-8 inline-flex max-w-md flex-col gap-3 text-left">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton href={site.calendly} external>
                Book Your Free Growth Call
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/contact" variant="ghost">
                Send a message instead
              </MagneticButton>
            </div>
          </Reveal>
          <Reveal delay={0.34}>
            <p className="mt-6 text-xs text-zinc-600">
              Usually replies within 24 hours · {site.email}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
