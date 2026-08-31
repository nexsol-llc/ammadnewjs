'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ReviewItem } from '@/lib/cms'

/**
 * Written reviews as a deck: one screenshot large at the front, the previous and
 * next ones peeking behind it. In a four-up grid these were unreadable — at this
 * size the review text can actually be read.
 *
 * Card width per breakpoint. An invisible copy of it sets the deck's height, so
 * the absolutely positioned cards always have exactly the right space to sit in
 * without hard-coding an aspect ratio for the stage.
 */
const CARD_W = 'w-[86%] sm:w-[72%] lg:w-[62%]'

/** How far the neighbours sit, as a share of a card's own width. */
const STEP = 84

export function ReviewCarousel({ reviews }: { reviews: ReviewItem[] }) {
  const n = reviews.length
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()

  const go = useCallback((dir: number) => setActive((i) => (i + dir + n) % n), [n])

  if (!n) return null
  const current = reviews[active]

  /** Signed distance from the front card, wrapped so the deck is circular. */
  const distance = (i: number) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  return (
    <div aria-roledescription="carousel" aria-label="Written reviews">
      {/* overflow-hidden matters: without it the parked cards sit far off to the
          sides and stretch the document, which on a phone zooms the whole page
          out. The vertical padding keeps the front card's shadow from being
          clipped by that same rule. */}
      <motion.div
        className="relative touch-pan-y overflow-hidden py-8"
        drag={n > 1 ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) go(1)
          else if (info.offset.x > 60) go(-1)
        }}
      >
        <div className={`invisible mx-auto aspect-[12/5] ${CARD_W}`} />

        {reviews.map((r, i) => {
          const d = distance(i)
          const far = Math.abs(d) > 1
          return (
            <motion.div
              key={r.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={d !== 0}
              onClick={() => d !== 0 && setActive(i)}
              className={`absolute inset-x-0 top-0 mx-auto overflow-hidden rounded-2xl bg-ink-950 shadow-[0_26px_58px_-28px_rgba(16,16,40,0.65)] ${CARD_W} ${
                far ? 'pointer-events-none' : d === 0 ? '' : 'cursor-pointer'
              }`}
              initial={false}
              animate={{
                x: `${Math.sign(d) * Math.min(Math.abs(d), 1.6) * STEP}%`,
                scale: d === 0 ? 1 : 0.82,
                opacity: far ? 0 : d === 0 ? 1 : 0.62,
                zIndex: 20 - Math.abs(d),
              }}
              transition={
                reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 }
              }
            >
              <span className="relative block aspect-[12/5] w-full">
                <Image
                  src={r.image?.heroUrl || r.image?.url || ''}
                  alt={r.image?.alt || `Review from ${r.reviewerName}`}
                  fill
                  sizes="(max-width: 640px) 86vw, (max-width: 1024px) 72vw, 62vw"
                  className="object-cover"
                  draggable={false}
                />
              </span>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Whose review is on top — keyed so it re-animates on every change */}
      <motion.div
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-7 min-h-[3.25rem] text-center"
      >
        <p className="text-sm font-semibold text-ink-950">{current.reviewerName}</p>
        {current.role && <p className="text-xs text-ink-400">{current.role}</p>}
        {current.quote && (
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-700">
            {current.quote}
          </p>
        )}
        <div className="mt-2 flex justify-center gap-0.5">
          {Array.from({ length: current.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
          ))}
        </div>
      </motion.div>

      {n > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-white text-ink-950 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show review ${i + 1} of ${n}`}
                aria-current={i === active}
                /* Padding around the dot, not a bigger dot: an 8px target is
                   below the minimum anyone can reliably hit with a thumb. */
                className="group p-2.5"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-6 bg-brand-500'
                      : 'w-2 bg-line-strong group-hover:bg-brand-200'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-white text-ink-950 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
