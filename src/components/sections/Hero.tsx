'use client'

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { HeroParticles } from '@/components/fx/HeroParticles'
import { GlowOrbs } from '@/components/fx/GlowOrbs'
import { MagneticButton } from '@/components/ui/Buttons'
import { networks, site } from '@/lib/site'

const rotatingLines = ['Partners compound.', 'Creators convert.', 'Own your growth.']

export function Hero() {
  const [line, setLine] = useState(0)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setLine((v) => (v + 1) % rotatingLines.length), 3400)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      <GlowOrbs variant="hero" />
      <div className="grid-bg absolute inset-0" />
      <HeroParticles className="absolute inset-0 h-full w-full" />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="container-x relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-medium tracking-wide text-zinc-300 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            For e-commerce & SaaS brands — now accepting Q4 2026 partners
          </span>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="font-display mt-8 max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-gradient-white block">Ads rent attention.</span>
          <span className="relative block h-[1.25em]">
            <AnimatePresence mode="wait">
              <motion.span
                key={line}
                initial={reduce ? false : { opacity: 0, y: 34, rotateX: -55 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -34, rotateX: 55 }}
                transition={{ duration: 0.55, ease: [0.21, 0.6, 0.35, 1] }}
                className="absolute inset-x-0 flex justify-center [transform-style:preserve-3d]"
              >
                <span className="text-gradient w-max max-w-full sm:whitespace-nowrap">
                  {rotatingLines[line]}
                </span>
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          I build and scale <span className="font-semibold text-white">affiliate & influencer programs</span> for
          e-commerce and SaaS brands — <span className="font-semibold text-white">$350K+</span> in tracked
          partner revenue at up to <span className="font-semibold text-white">30.7x ROAS</span>, without
          raising your ad spend.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton href={site.calendly} external>
            Book a Free Growth Call
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>
          <MagneticButton href="/case-studies" variant="ghost">
            See the proof
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-amber-400" fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-zinc-400">Trusted by 15+ brands worldwide</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs uppercase tracking-[0.16em] text-zinc-600">
            {networks.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.div
            animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-2 w-1 rounded-full bg-accent-400"
          />
        </div>
      </motion.div>
    </section>
  )
}
