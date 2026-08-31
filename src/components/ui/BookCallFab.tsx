'use client'

import { PhoneCall } from 'lucide-react'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

/* Tease timings, ms. The label pops out shortly after the page settles, comes
   back a couple more times, then stays quiet — and stops for good the moment
   the visitor touches the button. */
const FIRST_TEASE = 2600
const VISIBLE_FOR = 4800
const GAP = 18000
const ROUNDS = 3

/**
 * Persistent "Book a Call" button in the bottom-right corner of every page.
 * The handset rattles on a loop; the label rides in beside it on hover, focus,
 * or one of the timed teases.
 */
export function BookCallFab() {
  const [teasing, setTeasing] = useState(false)
  const [engaged, setEngaged] = useState(false)

  useEffect(() => {
    if (engaged) return
    let round = 0
    let timer: ReturnType<typeof setTimeout>
    const hide = () => {
      setTeasing(false)
      round += 1
      if (round < ROUNDS) timer = setTimeout(show, GAP)
    }
    const show = () => {
      setTeasing(true)
      timer = setTimeout(hide, VISIBLE_FOR)
    }
    timer = setTimeout(show, FIRST_TEASE)
    return () => clearTimeout(timer)
  }, [engaged])

  const stopTeasing = () => {
    setEngaged(true)
    setTeasing(false)
  }

  return (
    <div
      className="group fixed bottom-5 right-5 z-30 hidden items-center gap-2.5 lg:flex lg:bottom-7 lg:right-7"
      onMouseEnter={stopTeasing}
    >
      {/* Label — pointer-events-none so the invisible state never eats clicks */}
      <span
        aria-hidden
        className={`pointer-events-none relative rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_12px_30px_-14px_rgba(16,16,40,0.45)] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 ${
          teasing ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
        }`}
      >
        Book a Call
        <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-r border-t border-line bg-white" />
      </span>

      <a
        href={site.calendly}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book a call"
        onClick={stopTeasing}
        onFocus={stopTeasing}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-brand-400 to-brand-600 text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_14px_32px_-10px_rgba(91,51,245,0.75)] transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <span
          aria-hidden
          className="animate-pulse-ring absolute inset-0 rounded-full border-2 border-brand-400"
        />
        <PhoneCall className="animate-shake h-6 w-6" />
      </a>
    </div>
  )
}
