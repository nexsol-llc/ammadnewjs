'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * First-party journey tracking: every page and click in order, with how long
 * the visitor spent on each step.
 *
 * Ids live in web storage rather than cookies — a visitorId that persists so
 * return visits group together, and a sessionId that expires after 30 minutes
 * idle. Events are queued and flushed in batches, and flushed with sendBeacon
 * when the tab goes away so the last step is never lost.
 *
 * A page view is held open while the visitor is on it and only queued once they
 * leave, so every touchpoint carries its own dwell time and no page is recorded
 * twice. Time spent in another tab does not count.
 */
const ENDPOINT = '/api/track'
const SESSION_IDLE_MS = 30 * 60 * 1000
const FLUSH_INTERVAL_MS = 8000
const HEARTBEAT_MS = 15000
const VISITOR_KEY = 'aa_visitor'
const SESSION_KEY = 'aa_session'
const SESSION_SEEN_KEY = 'aa_session_seen'

type Event = {
  type: 'pageview' | 'click' | 'outbound' | 'form' | 'video' | 'conversion'
  label?: string
  path?: string
  at: number
  seconds?: number
}

type OpenPage = { path: string; label: string; at: number }

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

const read = (store: Storage, key: string) => {
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}

const write = (store: Storage, key: string, value: string) => {
  try {
    store.setItem(key, value)
  } catch {
    /* private mode — tracking is best-effort, never break the page */
  }
}

export function Tracker() {
  const pathname = usePathname()
  const queue = useRef<Event[]>([])
  const ids = useRef<{ visitorId: string; sessionId: string } | null>(null)
  const open = useRef<OpenPage | null>(null)
  const api = useRef<{ enter: (path: string) => void } | null>(null)

  useEffect(() => {
    /* ── identity ─────────────────────────────────────────── */
    let visitorId = read(localStorage, VISITOR_KEY)
    if (!visitorId) {
      visitorId = newId()
      write(localStorage, VISITOR_KEY, visitorId)
    }
    const lastSeen = Number(read(localStorage, SESSION_SEEN_KEY) || 0)
    let sessionId = read(sessionStorage, SESSION_KEY)
    if (!sessionId || Date.now() - lastSeen > SESSION_IDLE_MS) {
      sessionId = newId()
      write(sessionStorage, SESSION_KEY, sessionId)
    }
    ids.current = { visitorId, sessionId }

    /* ── delivery ─────────────────────────────────────────── */
    const flush = (useBeacon = false) => {
      if (!queue.current.length || !ids.current) return
      const body = JSON.stringify({
        ...ids.current,
        referrer: document.referrer || undefined,
        events: queue.current,
      })
      queue.current = []
      write(localStorage, SESSION_SEEN_KEY, String(Date.now()))

      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
        return
      }
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        /* offline or blocked — drop it rather than retry forever */
      })
    }

    const push = (event: Event) => {
      queue.current.push(event)
      if (queue.current.length >= 12) flush()
    }

    /* Report the open page with its dwell time so far. The server merges on
       identity and keeps the longest reading, so calling this repeatedly just
       refines the same touchpoint. */
    const reportPage = (page: OpenPage) =>
      push({
        type: 'pageview',
        label: page.label,
        path: page.path,
        at: page.at,
        seconds: Math.max(0, Math.round((Date.now() - page.at) / 1000)),
      })

    /** Close the page currently being timed, recording its final dwell time. */
    const closePage = () => {
      const page = open.current
      if (!page) return
      open.current = null
      reportPage(page)
    }

    const enter = (path: string) => {
      closePage()
      const page = { path, label: document.title, at: Date.now() }
      open.current = page
      /* Send straight away so the page is on record even if the visitor leaves
         before the first heartbeat — unload delivery cannot be relied on. */
      reportPage(page)
      flush()
      /* Next sets the document title just after navigating, so read it again. */
      setTimeout(() => {
        if (open.current === page) page.label = document.title
      }, 600)
    }
    api.current = { enter }
    enter(window.location.pathname)

    /* ── clicks ───────────────────────────────────────────── */
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('a, button')
      if (!el) return
      const label =
        (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim() ||
        el.getAttribute('href') ||
        el.tagName.toLowerCase()
      const href = el.getAttribute('href') || undefined
      const outbound = Boolean(href && /^https?:\/\//.test(href) && !href.includes(location.host))
      /* Record where a click led, not where it was made — the page it happened
         on is already the pageview right before it, and the destination is what
         tells you which call to action was pressed. Buttons have no
         destination, so they keep the current page. */
      let destination = open.current?.path
      if (href) {
        try {
          const url = new URL(href, location.href)
          destination = outbound ? href : `${url.pathname}${url.hash}`
        } catch {
          destination = href
        }
      }
      push({
        type: outbound ? 'outbound' : 'click',
        label: label.slice(0, 120),
        path: destination,
        at: Date.now(),
      })
      // Leaving the site — send now, there may be no later chance.
      if (outbound) flush(true)
    }

    const onSubmit = () => {
      push({ type: 'form', label: 'Form submitted', path: open.current?.path, at: Date.now() })
      flush()
    }

    /* ── leaving and returning ────────────────────────────── */
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        closePage()
        flush(true)
      } else if (!open.current) {
        // Back from another tab: start timing this page again.
        enter(window.location.pathname)
      }
    }

    // pagehide covers full page loads and tab closes, where visibility may
    // never flip to hidden. It must flush unconditionally.
    const onPageHide = () => {
      closePage()
      flush(true)
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('submit', onSubmit, true)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)
    const timer = setInterval(() => flush(), FLUSH_INTERVAL_MS)
    const heartbeat = setInterval(() => {
      if (document.visibilityState !== 'visible' || !open.current) return
      reportPage(open.current)
      flush()
    }, HEARTBEAT_MS)

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('submit', onSubmit, true)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
      clearInterval(timer)
      clearInterval(heartbeat)
      closePage()
      flush(true)
      api.current = null
    }
  }, [])

  /* Client-side route changes close the previous page and open the next. */
  useEffect(() => {
    if (!api.current || open.current?.path === pathname) return
    api.current.enter(pathname)
  }, [pathname])

  return null
}
