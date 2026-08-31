'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ReviewCard } from '@/components/cards/ReviewCard'
import type { ReviewItem } from '@/lib/cms'

/**
 * Video reviews as a swipeable rail on phones, a grid from md up.
 *
 * The swipe is driven by pointer events and a transform rather than native
 * overflow scrolling: an earlier scroll-snap version worked in Chromium but not
 * on a real device, and pointer events behave the same across touch, pen and
 * mouse. `touch-action: pan-y` leaves vertical page scrolling to the browser and
 * gives us the horizontal gesture.
 */
const GRID_FROM = '(min-width: 768px)'
const SWIPE_THRESHOLD = 45

export function VideoReviewRail({ reviews }: { reviews: ReviewItem[] }) {
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isGrid, setIsGrid] = useState(false)

  const startX = useRef(0)
  const dragging = useRef(false)
  const moved = useRef(false)

  /* First paint matches the server (rail); the grid takes over on mount at md+. */
  useEffect(() => {
    const mq = window.matchMedia(GRID_FROM)
    const apply = () => setIsGrid(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  /** Offset that puts card `i` in the middle of the viewport. */
  const offsetFor = useCallback((i: number) => {
    const view = viewport.current
    const card = track.current?.children[i] as HTMLElement | undefined
    if (!view || !card) return 0
    return (view.clientWidth - card.offsetWidth) / 2 - card.offsetLeft
  }, [])

  const [base, setBase] = useState(0)
  useEffect(() => {
    if (isGrid) return
    const update = () => setBase(offsetFor(index))
    update()
    const ro = new ResizeObserver(update)
    if (viewport.current) ro.observe(viewport.current)
    return () => ro.disconnect()
  }, [index, isGrid, offsetFor])

  const onPointerDown = (e: React.PointerEvent) => {
    if (isGrid || reviews.length < 2) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragging.current = true
    moved.current = false
    startX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 6) moved.current = true
    setDragX(dx)
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    const dx = e.clientX - startX.current
    if (dx < -SWIPE_THRESHOLD) setIndex((i) => Math.min(i + 1, reviews.length - 1))
    else if (dx > SWIPE_THRESHOLD) setIndex((i) => Math.max(i - 1, 0))
    setDragX(0)
  }

  /* A swipe that ends on the play button must not also press it. */
  const onClickCapture = (e: React.MouseEvent) => {
    if (!moved.current) return
    e.preventDefault()
    e.stopPropagation()
    moved.current = false
  }

  return (
    <div>
      <div
        ref={viewport}
        className="-mx-5 overflow-hidden px-5 sm:-mx-8 sm:px-8 md:mx-0 md:overflow-visible md:px-0"
      >
        <div
          ref={track}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          className={`flex gap-4 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 ${
            isGrid ? '' : 'touch-pan-y select-none'
          } ${dragging.current ? '' : 'transition-transform duration-500 ease-out'}`}
          style={isGrid ? undefined : { transform: `translate3d(${base + dragX}px, 0, 0)` }}
        >
          {reviews.map((r) => (
            <div key={r.id} className="w-[86%] shrink-0 md:w-auto">
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </div>

      {reviews.length > 1 && (
        <div className="mt-3 flex justify-center md:hidden">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show video review ${i + 1} of ${reviews.length}`}
              aria-current={i === index}
              /* Padding gives each dot a proper touch target around it. */
              className="group p-2.5"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-brand-500' : 'w-2 bg-line-strong group-hover:bg-brand-200'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
