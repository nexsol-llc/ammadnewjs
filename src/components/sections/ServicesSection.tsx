'use client'

import Link from 'next/link'
import { ArrowRight, Check, Handshake, Megaphone, Search, Users } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { GlowOrbs } from '@/components/fx/GlowOrbs'
import { services } from '@/lib/site'

export function ServicesSection({ compact = false }: { compact?: boolean }) {
  const mains = [
    { ...services.affiliate, icon: Handshake, accent: 'accent' as const },
    { ...services.influencer, icon: Megaphone, accent: 'violet' as const },
  ]
  return (
    <section className="relative py-24 md:py-32">
      <GlowOrbs variant="section" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="The solution"
          title={
            <>
              One operator. <span className="text-gradient">Two compounding channels.</span>
            </>
          }
          subtitle="Both services follow the same principle: build a partner ecosystem your brand owns, then scale it into a channel that outperforms paid ads."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {mains.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <TiltCard intensity={5} className="group h-full">
                <div
                  className={`card-surface h-full p-8 md:p-10 transition-colors duration-300 ${
                    s.accent === 'accent' ? 'hover:border-accent-500/35' : 'hover:border-violet-500/35'
                  }`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                      s.accent === 'accent'
                        ? 'bg-accent-500/12 text-accent-400'
                        : 'bg-violet-500/12 text-violet-400'
                    }`}
                  >
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display mt-7 text-2xl font-semibold text-white md:text-3xl">
                    {s.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      s.accent === 'accent' ? 'text-accent-400' : 'text-violet-400'
                    }`}
                  >
                    {s.tagline}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400 md:text-base">{s.description}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            s.accent === 'accent' ? 'text-accent-400' : 'text-violet-400'
                          }`}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={
                      s.accent === 'accent'
                        ? '/case-studies/affiliate-marketing'
                        : '/case-studies/influencer-marketing'
                    }
                    className={`mt-8 inline-flex items-center gap-1.5 text-sm font-semibold ${
                      s.accent === 'accent' ? 'text-accent-400' : 'text-violet-400'
                    }`}
                  >
                    See {s.accent === 'accent' ? 'affiliate' : 'influencer'} results
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {!compact && (
          <Stagger className="mt-6 grid gap-6 md:grid-cols-2" delay={0.15}>
            {services.extras.map((s, i) => {
              const Icon = i === 0 ? Users : Search
              return (
                <StaggerItem key={s.title}>
                  <div className="card-surface flex h-full items-start gap-5 p-7 transition-colors duration-300 hover:border-white/16">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/6 text-zinc-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-white">{s.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
      </div>
    </section>
  )
}
