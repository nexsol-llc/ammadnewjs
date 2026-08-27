'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { processSteps } from '@/lib/site'

export function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 65%'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From zero to a <span className="text-gradient">compounding channel</span>
            </>
          }
          subtitle="A proven four-phase playbook — the same one behind every case study on this site."
        />

        <div ref={ref} className="relative mx-auto max-w-3xl">
          {/* Animated progress spine */}
          <div className="absolute left-[1.4rem] top-0 h-full w-px bg-white/8 md:left-1/2" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[1.4rem] top-0 h-full w-px origin-top bg-gradient-to-b from-accent-400 to-violet-500 md:left-1/2"
          />

          <div className="space-y-12 md:space-y-20">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={0.05}>
                <div
                  className={`relative flex gap-6 md:items-center ${
                    i % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-500 to-violet-500 opacity-30 blur-md" />
                    <span className="font-display relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-ink-900 text-sm font-bold text-white">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div
                    className={`card-surface flex-1 p-7 transition-colors duration-300 hover:border-white/16 md:w-[calc(50%-3.5rem)] md:flex-none ${
                      i % 2 === 1 ? 'md:mr-auto' : 'md:ml-auto'
                    }`}
                  >
                    <h3 className="font-display text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
