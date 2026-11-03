'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Globe, Play, X } from 'lucide-react'
import { InstagramIcon, TiktokIcon, YoutubeIcon } from '@/components/ui/BrandIcons'
import { toEmbedSrc } from '@/lib/embed'
import type { VideoItem } from '@/lib/cms'
import './case-study-media.css'

/* Posters come straight from the CMS already sized, and the bucket host changes
   per environment, so plain <img> is used rather than next/image. */
/* eslint-disable @next/next/no-img-element */

/* ── Reading one video ──────────────────────────────────────── */

/** A poster must be a still; a video file dropped in that slot would render broken. */
const posterOf = (v: VideoItem) =>
  v.poster?.mimeType?.startsWith('video/') ? undefined : v.poster?.cardUrl || v.poster?.url

const fileOf = (v: VideoItem) => (v.source !== 'embed' ? v.media?.url : undefined)

const embedOf = (v: VideoItem) =>
  v.source === 'embed' && v.embedUrl ? toEmbedSrc(v.embedUrl) : null

/** Every caption field is optional, so screen readers need a stand-in. */
const nameOf = (v: VideoItem) => v.handle || v.caption || 'Campaign video'

const PLATFORM_LABEL: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

/** The line under the handle: who it was for, where it ran, and in what niche. */
const detailsOf = (v: VideoItem, brand?: string) =>
  [brand, v.platform ? PLATFORM_LABEL[v.platform] : undefined, v.niche].filter(Boolean).join(' · ')

function PlatformIcon({ platform }: { platform?: string }) {
  if (platform === 'instagram') return <InstagramIcon className="h-4 w-4" />
  if (platform === 'tiktok') return <TiktokIcon className="h-4 w-4" />
  if (platform === 'youtube') return <YoutubeIcon className="h-4 w-4" />
  return <Globe className="h-4 w-4" aria-hidden="true" />
}

/** The platform's logo in a corner of a card; `className` places and sizes it. */
function PlatformMark({ platform, className }: { platform?: string; className: string }) {
  if (!platform) return null
  return (
    <span
      className={`pointer-events-none absolute flex items-center justify-center rounded-lg bg-ink-950/70 text-white backdrop-blur-sm ${className}`}
    >
      <PlatformIcon platform={platform} />
    </span>
  )
}

/**
 * What fills a card before anything plays: the poster, else an uploaded file's
 * first frame, else (an embed with no poster) the dark card behind it.
 */
function Still({ video, className }: { video: VideoItem; className: string }) {
  const poster = posterOf(video)
  const file = fileOf(video)
  if (poster) return <img src={poster} alt="" draggable={false} loading="lazy" className={className} />
  if (file)
    return <video src={`${file}#t=0.1`} preload="metadata" muted playsInline className={className} />
  return null
}

/* React does not reliably set `muted` on a server-rendered video, and browsers
   refuse to autoplay without it, so it is set and started by hand. */
function LoopVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    el.play().catch(() => {})
  }, [])
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      /* Pinned rather than in flow: every card is a fixed-ratio box, and a
         flowed video would leave the button's own line-height showing. */
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

function PlayMark({ size = 64, hoverOnly }: { size?: number; hoverOnly?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-brand-600 shadow-[0_10px_24px_-14px_rgba(16,16,40,0.6)] ${
        hoverOnly
          ? 'opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100'
          : ''
      }`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Play className="ml-0.5" style={{ width: size / 3, height: size / 3 }} fill="currentColor" />
    </span>
  )
}

/* ── Full-screen player ─────────────────────────────────────── */

/** One video, played large and with sound. */
function VideoModal({
  video,
  brand,
  onClose,
}: {
  video: VideoItem
  brand?: string
  onClose: () => void
}) {
  const file = fileOf(video)
  const embed = embedOf(video)
  const details = detailsOf(video, brand)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    /* The page behind must not scroll under the overlay. */
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={nameOf(video)}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/85 p-5 backdrop-blur-md"
    >
      <div onClick={(e) => e.stopPropagation()} className="flex w-[min(380px,100%)] flex-col gap-3.5">
        <div className="relative aspect-[9/16] max-h-[76vh] overflow-hidden rounded-3xl bg-ink-900">
          {embed ? (
            <iframe
              src={embed}
              title={nameOf(video)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : file ? (
            <video
              src={file}
              poster={posterOf(video)}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <a
              href={video.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full w-full items-center justify-center gap-2 text-sm font-semibold text-white"
            >
              <Play className="h-5 w-5" /> Watch on {PLATFORM_LABEL[video.platform || ''] || 'the platform'}
            </a>
          )}
          <PlatformMark platform={video.platform} className="left-3 top-3 h-9 w-9" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            autoFocus
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-950 transition-colors hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {video.handle || details || video.views || video.caption ? (
          <div className="flex items-end justify-between gap-3 text-white">
            <div className="flex min-w-0 flex-col gap-0.5">
              {video.handle && <span className="truncate font-semibold">{video.handle}</span>}
              <span className="truncate text-[13px] text-white/60">{details || video.caption}</span>
            </div>
            {video.views && <span className="shrink-0 text-[13px] text-white/60">{video.views}</span>}
          </div>
        ) : null}
      </div>
    </div>
  )
}

/* Portalled to the body: a transformed ancestor would otherwise trap a fixed overlay. */
function Overlay({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return ready ? createPortal(children, document.body) : null
}

/* ── Horizontal drag ────────────────────────────────────────── */

const SWIPE_PX = 45

/**
 * A thumb (or pen, or mouse) dragging sideways. Pointer events behave the same
 * across all three, and `touch-action: pan-y` on the target leaves vertical page
 * scrolling to the browser.
 *
 * `onDrag` reports the live offset for carousels that track the finger; `onStep`
 * fires once on release with -1 or +1. `blockClick` is spread onto the same
 * element so a swipe that ends on a card does not also press it.
 */
function useSwipe({
  enabled,
  onStep,
  onDrag,
}: {
  enabled: boolean
  onStep: (by: -1 | 1) => void
  onDrag?: (px: number) => void
}) {
  const start = useRef(0)
  const dragging = useRef(false)
  const moved = useRef(false)
  const [active, setActive] = useState(false)

  const end = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    setActive(false)
    const dx = e.clientX - start.current
    onDrag?.(0)
    if (dx <= -SWIPE_PX) onStep(1)
    else if (dx >= SWIPE_PX) onStep(-1)
  }

  return {
    active,
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        if (!enabled) return
        if (e.pointerType === 'mouse' && e.button !== 0) return
        dragging.current = true
        moved.current = false
        start.current = e.clientX
        setActive(true)
        e.currentTarget.setPointerCapture(e.pointerId)
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (!dragging.current) return
        const dx = e.clientX - start.current
        if (Math.abs(dx) > 6) moved.current = true
        onDrag?.(dx)
      },
      onPointerUp: end,
      onPointerCancel: end,
      onClickCapture: (e: React.MouseEvent) => {
        if (!moved.current) return
        e.preventDefault()
        e.stopPropagation()
        moved.current = false
      },
    },
  }
}

/* ── Hero stack ─────────────────────────────────────────────── */

const STACK_MS = 3800

/**
 * Three fanned videos beside the hero copy. The back-left one fades away, the
 * others step back, and a fourth comes in on the right — so a case study with
 * more than three videos cycles through the rest without ever showing a fourth
 * card at once. Each video's slot is its distance from `tick`: 0–2 are on show,
 * the last has just left, the rest wait unseen.
 *
 * With fewer than three videos there is nothing to rotate, so they are simply
 * fanned and left alone rather than repeated into a stack of duplicates.
 */
export function HeroVideoStack({ videos, brand }: { videos: VideoItem[]; brand?: string }) {
  const [tick, setTick] = useState(0)
  const [open, setOpen] = useState<VideoItem | null>(null)
  const rotates = videos.length >= 3

  /* Five is the fewest that keeps a leaving card from flying back across the
     stack to re-enter; repeating a short list never puts a duplicate on show,
     because only three consecutive cards are ever visible. */
  const cards = rotates
    ? Array.from({ length: Math.ceil(5 / videos.length) }, () => videos).flat()
    : videos
  const count = cards.length

  useEffect(() => {
    if (!rotates || open) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setTick((t) => t + 1), STACK_MS)
    return () => window.clearInterval(timer)
  }, [rotates, open])

  const swipe = useSwipe({
    enabled: rotates,
    onStep: (by) => setTick((t) => t + by),
  })

  /* One video sits square on; two fan out in the two front slots. */
  const staticSlot = (i: number) => (count === 1 ? 'solo' : String(i + 3 - count))

  return (
    <div className="cs-stack" {...swipe.handlers}>
      {cards.map((video, i) => {
        const slot = rotates ? (i - (tick % count) + count) % count : -1
        const shown = !rotates || slot <= 2
        const left = rotates && slot === count - 1
        const file = fileOf(video)
        return (
          <button
            key={`${video.id}-${i}`}
            type="button"
            data-slot={rotates ? (shown ? slot : left ? 'out' : 'wait') : staticSlot(i)}
            tabIndex={shown ? undefined : -1}
            aria-hidden={shown ? undefined : true}
            aria-label={`Watch ${nameOf(video)}`}
            onClick={() => setOpen(video)}
            className="cs-stack-card group"
          >
            {/* Only what is on screen or next up plays; the rest stay stills. */}
            {file && (shown || left || slot === 3) ? (
              <LoopVideo src={file} poster={posterOf(video)} />
            ) : (
              <Still video={video} className="absolute inset-0 h-full w-full object-cover" />
            )}
            {!file && <PlayMark size={48} />}
            <PlatformMark platform={video.platform} className="right-2 top-2 h-7 w-7" />
          </button>
        )
      })}
      {open && (
        <Overlay>
          <VideoModal video={open} brand={brand} onClose={() => setOpen(null)} />
        </Overlay>
      )}
    </div>
  )
}

/* ── Mobile hero previews ───────────────────────────────────── */

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/**
 * One thumbnail in the phone row, with its own length in the corner.
 *
 * The CMS has no duration field, so it comes off the file's metadata. A
 * poster-less clip already has a `preload="metadata"` <video> standing in as
 * its still, so that element is reused and nothing extra is fetched; only a
 * clip showing a poster image needs an element of its own. An embed's length
 * lives on the platform, so it goes without.
 */
function PeekCard({
  video,
  featured,
  under,
  onOpen,
}: {
  video: VideoItem
  featured: boolean
  /** This card runs beneath the middle one, which its corner badge must dodge. */
  under: boolean
  onOpen: () => void
}) {
  const root = useRef<HTMLButtonElement>(null)
  const [time, setTime] = useState<string>()

  useEffect(() => {
    const file = fileOf(video)
    if (!file) return
    const inDom = root.current?.querySelector('video')
    const el = inDom || document.createElement('video')
    let live = true
    const read = () => {
      if (live && Number.isFinite(el.duration) && el.duration > 0) setTime(clock(el.duration))
    }
    el.addEventListener('loadedmetadata', read)
    if (el.readyState >= 1) read()
    if (!inDom) {
      el.preload = 'metadata'
      el.muted = true
      el.src = file
    }
    return () => {
      live = false
      el.removeEventListener('loadedmetadata', read)
      if (!inDom) {
        el.removeAttribute('src')
        el.load()
      }
    }
  }, [video])

  return (
    <button
      ref={root}
      type="button"
      data-featured={featured || undefined}
      data-under={under || undefined}
      onClick={onOpen}
      aria-label={`Watch ${nameOf(video)}`}
      className="cs-peek-card"
    >
      <Still video={video} className="absolute inset-0 h-full w-full object-cover" />
      <PlayMark size={featured ? 40 : 30} />
      {time && <span className="cs-peek-time">{time}</span>}
    </button>
  )
}

/**
 * Three of the campaign's own videos, overlapped, sat in the hero copy between
 * the description and the calls to action — so a phone meets the creators
 * before it has to scroll.
 *
 * Phones only. Above 48rem the fanned `HeroVideoStack` is already the hero's
 * video, so this renders nothing there and fetches nothing either; the layout
 * itself lives behind the same breakpoint in `case-study-media.css`.
 */
export function HeroVideoPreviews({ videos, brand }: { videos: VideoItem[]; brand?: string }) {
  const [wide, setWide] = useState(false)
  const [open, setOpen] = useState<VideoItem | null>(null)
  const picks = useMemo(() => videos.slice(0, 3), [videos])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 48rem)')
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (wide || !picks.length) return null

  /* Two videos have no middle to lift, so neither takes the big slot; one
     stands alone and does. */
  const featured = picks.length === 2 ? -1 : Math.floor(picks.length / 2)

  return (
    <div className="cs-peek md:hidden">
      {picks.map((video, i) => (
        <PeekCard
          key={`${video.id}-${i}`}
          video={video}
          featured={i === featured}
          under={i === featured - 1}
          onOpen={() => setOpen(video)}
        />
      ))}
      {open && (
        <Overlay>
          <VideoModal video={open} brand={brand} onClose={() => setOpen(null)} />
        </Overlay>
      )}
    </div>
  )
}

/* ── Carousel ───────────────────────────────────────────────── */

/* Resting opacity by distance from the middle; fractional distances during a
   drag land between two stops, so a card arriving from off-stage fades in with
   the finger instead of popping when it is let go. */
const FADE = [1, 0.92, 0.5, 0]
const fade = (d: number) => {
  if (d >= 3) return 0
  const i = Math.floor(d)
  return FADE[i] + (FADE[i + 1] - FADE[i]) * (d - i)
}

/**
 * The campaign videos as a centred carousel: the middle one plays muted and
 * full size, its neighbours recede on each side. Tap or click a neighbour to
 * bring it forward, the middle one to watch it with sound — and on a phone,
 * swipe with a thumb or use the arrows.
 *
 * `current` only ever counts up or down; each card's place is its shortest
 * distance from it around the loop. Lists too short to loop cleanly (one or two
 * videos) step between their real cards instead of wrapping.
 */
export function CampaignReel({ videos, brand }: { videos: VideoItem[]; brand?: string }) {
  const [current, setCurrent] = useState(0)
  const [dragPx, setDragPx] = useState(0)
  const [open, setOpen] = useState<VideoItem | null>(null)
  const reel = useRef<HTMLDivElement>(null)

  const total = videos.length
  const loop = total >= 3
  /* Six is the fewest that lets a card leave one side and return on the other
     unseen, so a short list repeats. */
  const cards = loop ? Array.from({ length: Math.ceil(6 / total) }, () => videos).flat() : videos
  const count = cards.length
  const active = loop ? ((current % total) + total) % total : current

  const step = useCallback(
    (by: number) =>
      setCurrent((c) => (loop ? c + by : Math.min(Math.max(c + by, 0), total - 1))),
    [loop, total],
  )

  /* Dots take the short way round, so one never sends the whole row flying. */
  const goTo = (i: number) => {
    if (!loop) return setCurrent(i)
    let shift = (i - active + total) % total
    if (shift > total / 2) shift -= total
    setCurrent(current + shift)
  }

  const swipe = useSwipe({
    enabled: total > 1,
    onStep: step,
    onDrag: setDragPx,
  })

  /* The finger's offset, in card steps — cards sit 95% of a card width apart. */
  const cardWidth = reel.current?.querySelector<HTMLElement>('.cs-reel-card')?.offsetWidth ?? 0
  const drag = cardWidth ? Math.max(-1.5, Math.min(1.5, dragPx / (cardWidth * 0.95))) : 0

  return (
    <div className="flex flex-col items-center gap-8">
      <div ref={reel} className="cs-reel" data-dragging={swipe.active || undefined} {...swipe.handlers}>
        {cards.map((video, i) => {
          let offset = i - current
          if (loop) {
            offset = ((offset % count) + count) % count
            if (offset > count / 2) offset -= count
          }
          const centred = offset === 0
          const shown = Math.abs(offset) <= 2
          const distance = Math.min(Math.abs(offset + drag), 3)
          const file = fileOf(video)
          const details = detailsOf(video, brand)
          return (
            <button
              key={`${video.id}-${i}`}
              type="button"
              tabIndex={shown ? undefined : -1}
              aria-hidden={shown ? undefined : true}
              aria-label={`${centred ? 'Watch' : 'Show'} ${nameOf(video)}`}
              onClick={() => (centred ? setOpen(video) : step(offset))}
              data-centred={centred || undefined}
              className="cs-reel-card group"
              style={
                {
                  '--cs-o': offset,
                  '--cs-d': distance,
                  '--cs-drag': drag,
                  zIndex: Math.max(0, 10 - Math.round(distance)),
                  opacity: fade(distance),
                  pointerEvents: shown ? undefined : 'none',
                } as React.CSSProperties
              }
            >
              {Math.abs(offset) <= 3 ? (
                <Still video={video} className="absolute inset-0 h-full w-full object-cover" />
              ) : null}
              {centred && file && <LoopVideo src={file} poster={posterOf(video)} />}

              {centred && (
                <>
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-55% to-ink-950/85" />
                  <PlayMark hoverOnly={Boolean(file)} />
                  {(video.handle || details || video.views) && (
                    <span className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-left text-white">
                      <span className="flex min-w-0 flex-col gap-0.5">
                        {video.handle && (
                          <span className="truncate text-base font-semibold">{video.handle}</span>
                        )}
                        {details && <span className="truncate text-[13px] text-white/75">{details}</span>}
                      </span>
                      {video.views && (
                        <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                          {video.views}
                        </span>
                      )}
                    </span>
                  )}
                </>
              )}
              <PlatformMark platform={video.platform} className="right-3 top-3 h-8 w-8" />
            </button>
          )
        })}
      </div>

      {total > 1 && (
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!loop && active === 0}
            aria-label="Previous video"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white text-ink-950 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>
          <div className="flex items-center">
            {videos.map((video, i) => (
              <button
                key={video.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to video ${i + 1} of ${total}`}
                aria-current={i === active || undefined}
                /* Padding gives each dot a proper touch target around it. */
                className="group p-2"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-brand-500' : 'w-2 bg-line-strong group-hover:bg-brand-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!loop && active === total - 1}
            aria-label="Next video"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white text-ink-950 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}

      {open && (
        <Overlay>
          <VideoModal video={open} brand={brand} onClose={() => setOpen(null)} />
        </Overlay>
      )}
    </div>
  )
}
