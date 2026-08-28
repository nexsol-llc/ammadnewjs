'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Calculator, Star } from 'lucide-react'
import { NetworkOrbit } from '@/components/fx/NetworkOrbit'
import { MagneticButton } from '@/components/ui/Buttons'
import { Typewriter } from '@/components/ui/Typewriter'
import { heroCategories, site } from '@/lib/site'
import type { NetworkInfo } from '@/lib/cms'

const proof = [
  { value: '$350K+', label: 'Partner revenue tracked' },
  { value: '30.7x', label: 'Best campaign ROAS' },
  { value: '700+', label: 'Partners recruited' },
]

export function Hero({ networks }: { networks: NetworkInfo[] }) {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.21, 0.6, 0.35, 1] as const },
  })

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="mesh-bg absolute inset-0" />
      <div className="grid-fade absolute inset-0" />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div {...rise(0)}>
              <span className="pill">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-500 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint-500" />
                </span>
                Affiliate & Influencer Marketing Partner
              </span>
            </motion.div>

            <motion.h1
              {...rise(0.08)}
              aria-label="The partner growth engine for e-commerce, SaaS and DTC brands"
              className="heading mt-7 text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-[4rem]"
            >
              <span aria-hidden="true">
                The partner growth engine for{' '}
                {/* Two lines are reserved so the layout never jumps between short
                    words ('SaaS') and long ones ('health & fitness'). */}
                <span className="block min-h-[2.12em]">
                  <Typewriter words={heroCategories} className="text-gradient" /> brands
                </span>
              </span>
            </motion.h1>

            <motion.p
              {...rise(0.18)}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg lg:mx-0"
            >
              I build, launch and scale affiliate & influencer programs that add revenue without
              adding ad spend — <strong className="font-semibold text-ink-950">$350K+</strong> in
              tracked partner revenue at up to{' '}
              <strong className="font-semibold text-ink-950">30.7x ROAS</strong>.
            </motion.p>

            <motion.div
              {...rise(0.28)}
              className="mx-auto mt-9 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center lg:mx-0 lg:justify-start"
            >
              <MagneticButton href="#revenue-calculator">
                <Calculator className="h-4 w-4" />
                Calculate my revenue
              </MagneticButton>
              <MagneticButton href={site.calendly} variant="ghost" external>
                Book a free growth call
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </motion.div>

            <motion.div {...rise(0.38)} className="mt-9 flex flex-col items-center gap-4 lg:items-start">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-ink-500">Trusted by 15+ brands worldwide</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
                {proof.map((p) => (
                  <div key={p.label}>
                    <p className="heading text-xl sm:text-2xl">{p.value}</p>
                    <p className="text-xs text-ink-400">{p.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Circular network slider */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.6, 0.35, 1] }}
            className="relative"
          >
            <NetworkOrbit networks={networks} />
            <p className="mt-6 text-center text-xs uppercase tracking-[0.18em] text-ink-400">
              Networks & platforms I run programs on
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
