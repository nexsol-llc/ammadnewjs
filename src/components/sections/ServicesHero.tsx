'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Calculator } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, type CSSProperties } from 'react'
import { site } from '@/lib/site'

const LINE_1 = 'You’re Burning Budget.'
const LINE_2 = 'Paying For Impressions.'
const LINE_3 = 'What If You Only Paid For Conversion?'

/* Timings, in seconds — line 1 burns, line 2 gets struck through, then line 3 types. */
const T = {
  line1: 0.15,
  line2: 0.7,
  strike: 1.25,
  strikeDur: 0.55,
  type: 1.9,
  charMs: 26,
}
const TYPE_END = T.type + (LINE_3.length * T.charMs) / 1000

/**
 * Fixed so server and client render identically.
 * l = left %, d = delay, s = duration, w = size px, x = sideways drift px —
 * the sparks lean the same way the flame licks, left to right.
 */
const EMBERS = [
  { l: 8, d: 0, s: 5.2, w: 5, x: 46 },
  { l: 17, d: 1.4, s: 6.1, w: 3, x: 28 },
  { l: 26, d: 2.7, s: 4.8, w: 4, x: 62 },
  { l: 35, d: 0.6, s: 5.6, w: 3, x: 18 },
  { l: 44, d: 3.1, s: 6.4, w: 5, x: 54 },
  { l: 53, d: 1.9, s: 5.0, w: 3, x: -22 },
  { l: 62, d: 0.3, s: 5.9, w: 4, x: 40 },
  { l: 71, d: 2.2, s: 5.4, w: 3, x: 70 },
  { l: 80, d: 3.6, s: 6.2, w: 5, x: -34 },
  { l: 89, d: 1.1, s: 5.1, w: 3, x: 24 },
  { l: 13, d: 4.0, s: 6.6, w: 4, x: 58 },
  { l: 67, d: 4.4, s: 5.7, w: 3, x: -18 },
]

export function ServicesHero() {
  const reduce = useReducedMotion()
  const [typed, setTyped] = useState(reduce ? LINE_3.length : 0)

  useEffect(() => {
    if (reduce) return
    let i = 0
    let interval: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setTyped(i)
        if (i >= LINE_3.length) clearInterval(interval)
      }, T.charMs)
    }, T.type * 1000)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [reduce])

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.21, 0.6, 0.35, 1] as const },
  })

  return (
    <section className="relative pt-24 pb-8 md:pt-28 md:pb-10">
      <div className="container-x">
        {/* Panel — gives the hero a defined edge instead of bleeding into the
            section below, and lifts it off the page. */}
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-300 bg-white px-5 py-14 shadow-[0_26px_70px_-28px_rgba(91,51,245,0.5)] md:px-10 md:py-20">
          <div className="mesh-ember absolute inset-0" />
          <div className="grid-fade absolute inset-0" />

      {/* Rising embers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="animate-ember absolute bottom-1/3 rounded-full bg-orange-500/60"
            style={
              {
                left: `${e.l}%`,
                width: e.w,
                height: e.w,
                animationDelay: `${e.d}s`,
                animationDuration: `${e.s}s`,
                boxShadow: '0 0 8px rgba(249,115,22,0.55)',
                '--drift': `${e.x}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

          <div className="relative text-center">
        <motion.div {...fade(0)}>
          <span className="pill">Services</span>
        </motion.div>

        <h1
          aria-label={`${LINE_1} ${LINE_2} ${LINE_3}`}
          className="heading mt-7 text-[2.1rem] leading-[1.22] sm:text-5xl md:text-[3.4rem]"
        >
          {/* Full text for crawlers and assistive tech, independent of the animation */}
          <span className="sr-only">
            {LINE_1} {LINE_2} {LINE_3}
          </span>

          <span aria-hidden="true">
            {/* Line 1 — burning */}
            <motion.span {...fade(T.line1)} className="block">
              <span className={`text-burning ${reduce ? '' : 'animate-burn'}`}>{LINE_1}</span>
            </motion.span>

            {/* Line 2 — struck through, left to right. The rule is a background on
                the inline text (not a positioned bar) so it still crosses every
                line correctly when the text wraps on small screens. */}
            <motion.span {...fade(T.line2)} className="mt-2.5 block">
              <motion.span
                className="text-ink-300 [-webkit-box-decoration-break:clone] [box-decoration-break:clone]"
                style={{
                  backgroundImage: 'linear-gradient(#ef4444, #ef4444)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 57%',
                }}
                initial={reduce ? false : { backgroundSize: '0% 4px' }}
                animate={{ backgroundSize: '100% 4px' }}
                transition={{
                  duration: reduce ? 0 : T.strikeDur,
                  delay: reduce ? 0 : T.strike,
                  ease: [0.35, 0.8, 0.4, 1],
                }}
              >
                {LINE_2}
              </motion.span>
            </motion.span>

            {/* Line 3 — types once the strike lands */}
            <span className="text-gradient mt-2.5 block">
              {LINE_3.slice(0, typed)}
              {!reduce && typed < LINE_3.length && typed > 0 && (
                <span className="animate-caret ml-0.5 font-light text-brand-500">|</span>
              )}
              {/* holds the line height before typing begins */}
              {typed === 0 && <span className="invisible">{LINE_3}</span>}
            </span>
          </span>
        </h1>

        <motion.p
          {...fade(reduce ? 0.3 : TYPE_END + 0.1)}
          className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg"
        >
          Imagine a growth strategy with zero wasted budget, completely eliminated CAC risk, and
          guaranteed margins on every transaction. Welcome to affiliate marketing — the channel most
          brands leave underutilised.
        </motion.p>

        <motion.div
          {...fade(reduce ? 0.4 : TYPE_END + 0.28)}
          className="mx-auto mt-9 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
        >
          <Link href="/free-audit" className="btn btn-primary">
            Claim Free Audit
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/#revenue-calculator" className="btn btn-ghost">
            <Calculator className="h-4 w-4" />
            Estimate Revenue
          </Link>
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Book a Call
          </a>
        </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
