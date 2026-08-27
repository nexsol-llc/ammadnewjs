'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { roadmap } from '@/lib/site'

export function RoadmapSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="section-alt relative overflow-hidden py-24 md:py-32">
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Road map"
          title={
            <>
              Your first 90 days, <span className="text-gradient">mapped out</span>
            </>
          }
          subtitle="No vague retainers. Here is exactly what gets built, in what order, and when you should expect revenue."
        />

        <div ref={ref} className="relative">
          {/* Spine — horizontal on desktop, vertical on mobile */}
          <div className="absolute left-[1.55rem] top-0 h-full w-0.5 bg-line lg:left-0 lg:top-[3.4rem] lg:h-0.5 lg:w-full" />
          <motion.div
            style={{ scaleY: progress, scaleX: progress }}
            className="absolute left-[1.55rem] top-0 h-full w-0.5 origin-top bg-gradient-to-b from-brand-500 to-fuchsia-500 lg:left-0 lg:top-[3.4rem] lg:h-0.5 lg:w-full lg:origin-left lg:bg-gradient-to-r"
          />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-5">
            {roadmap.map((step, i) => (
              <Reveal key={step.phase} delay={i * 0.08}>
                <div className="relative flex gap-6 lg:block">
                  {/* Node */}
                  <div className="relative z-10 shrink-0 lg:mb-8">
                    <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-2xl border border-line bg-white shadow-[0_8px_24px_-12px_rgba(16,16,40,0.25)]">
                      <span className="heading text-sm text-brand-600">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 pb-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-600">
                      {step.window}
                    </p>
                    <h3 className="heading mt-1.5 text-lg">{step.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{step.description}</p>
                    <ul className="mt-4 space-y-2">
                      {step.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-[0.82rem] text-ink-700">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-500" />
                          {d}
                        </li>
                      ))}
                    </ul>
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
