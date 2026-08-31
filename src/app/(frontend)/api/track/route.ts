import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import type { AnalyticsSession } from '@/payload-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Collector for the first-party visitor journey.
 *
 * The browser only ever posts here; it never touches the analytics collection,
 * so a visitor cannot forge or edit someone else's journey. IP and location are
 * read from the edge headers server-side rather than trusted from the payload.
 */

const MAX_EVENTS = 40
const RETENTION_DAYS = 90
/* Pruning on a fraction of new sessions keeps old data from piling up without
   needing a scheduler, and costs almost nothing on any single request. */
const PRUNE_CHANCE = 0.05
const TYPES = new Set(['pageview', 'click', 'outbound', 'form', 'video', 'conversion'])

type Incoming = {
  sessionId?: unknown
  visitorId?: unknown
  referrer?: unknown
  events?: unknown
}

/** Matches the generated shape so it can be written straight back to Payload. */
type Touchpoint = NonNullable<AnalyticsSession['touchpoints']>[number] & { at: string }

const str = (v: unknown, max = 300) =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined

type Device = NonNullable<AnalyticsSession['device']>

const parseUserAgent = (ua: string): { device: Device; browser: string; os: string } => ({
  device: /iPad|Tablet/i.test(ua)
    ? 'tablet'
    : /Mobi|Android|iPhone/i.test(ua)
      ? 'mobile'
      : ua
        ? 'desktop'
        : 'unknown',
  // Order matters — Edge and Opera both also claim to be Chrome.
  browser: /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\//.test(ua)
      ? 'Opera'
      : /Chrome\//.test(ua)
        ? 'Chrome'
        : /Firefox\//.test(ua)
          ? 'Firefox'
          : /Safari\//.test(ua)
            ? 'Safari'
            : 'Other',
  os: /Windows/.test(ua)
    ? 'Windows'
    : /Android/.test(ua)
      ? 'Android'
      : /iPhone|iPad|iPod/.test(ua)
        ? 'iOS'
        : /Mac OS X/.test(ua)
          ? 'macOS'
          : /Linux/.test(ua)
            ? 'Linux'
            : 'Other',
})

/**
 * Drop the part of the address that identifies the individual connection while
 * keeping enough to be useful: the last octet for IPv4, everything past the
 * third group for IPv6. Location still resolves; the household does not.
 */
const maskIp = (ip: string | undefined) => {
  if (!ip) return undefined
  if (ip.includes('.')) {
    const parts = ip.split('.')
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : ip
  }
  if (ip.includes(':')) {
    const groups = ip.split(':').filter(Boolean)
    return groups.length > 3 ? `${groups.slice(0, 3).join(':')}::` : ip
  }
  return ip
}

const decode = (v: string | null) => {
  if (!v) return undefined
  try {
    return decodeURIComponent(v).slice(0, 120)
  } catch {
    return v.slice(0, 120)
  }
}

export async function POST(req: Request) {
  let body: Incoming
  try {
    body = (await req.json()) as Incoming
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  const sessionId = str(body.sessionId, 60)
  const visitorId = str(body.visitorId, 60)
  const rawEvents = Array.isArray(body.events) ? body.events.slice(0, MAX_EVENTS) : []
  if (!sessionId || !rawEvents.length) return new NextResponse(null, { status: 204 })

  const headers = req.headers
  const userAgent = headers.get('user-agent') || ''
  // Crawlers would otherwise fill the table with journeys nobody took.
  if (/bot|crawler|spider|crawling|preview|lighthouse|headless/i.test(userAgent)) {
    return new NextResponse(null, { status: 204 })
  }

  const events: Touchpoint[] = rawEvents
    .map((raw): Touchpoint | null => {
      const e = (raw ?? {}) as Record<string, unknown>
      const type = str(e.type, 20) as Touchpoint['type'] | undefined
      if (!type || !TYPES.has(type)) return null
      const at = Number(e.at)
      const seconds = Number(e.seconds)
      return {
        type,
        label: str(e.label, 160),
        path: str(e.path, 200),
        at: new Date(Number.isFinite(at) ? at : Date.now()).toISOString(),
        seconds: Number.isFinite(seconds) && seconds >= 0 ? Math.min(Math.round(seconds), 7200) : 0,
      }
    })
    .filter((e): e is Touchpoint => e !== null)

  if (!events.length) return new NextResponse(null, { status: 204 })

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'analytics-sessions',
    where: { sessionId: { equals: sessionId } },
    limit: 1,
    depth: 0,
  })
  const session = existing.docs[0]

  const previous = (session?.touchpoints || []) as Touchpoint[]

  /* A page is reported the moment it opens and again on every heartbeat, so the
     same touchpoint arrives repeatedly with a longer dwell each time. Merge on
     identity and keep the longest reading — that way a lost final beacon costs
     at most one heartbeat of accuracy instead of the whole step, and a retried
     request can never double-record. */
  const key = (t: Touchpoint) => `${t.at}|${t.type}|${t.path ?? ''}`
  const merged = [...previous]
  const index = new Map(merged.map((t, i) => [key(t), i]))
  let changed = false

  for (const event of events) {
    const at = index.get(key(event))
    if (at === undefined) {
      index.set(key(event), merged.length)
      merged.push(event)
      changed = true
    } else if ((event.seconds || 0) > (merged[at].seconds || 0)) {
      merged[at] = { ...merged[at], seconds: event.seconds }
      changed = true
    }
  }
  if (!changed) return new NextResponse(null, { status: 204 })

  const touchpoints = merged.sort((a, b) => (a.at || '').localeCompare(b.at || ''))
  const pageviews = touchpoints.filter((t) => t.type === 'pageview').length
  const clicks = touchpoints.filter((t) => t.type === 'click' || t.type === 'outbound').length
  const durationSeconds = touchpoints.reduce((sum, t) => sum + (t.seconds || 0), 0)
  const conversion = touchpoints.find((t) => t.type === 'conversion' || t.type === 'form')
  const last = touchpoints[touchpoints.length - 1]

  const shared = {
    visitorId,
    lastSeenAt: last.at,
    exitPath: last.path,
    touchpoints,
    pageviews,
    clicks,
    durationSeconds,
    converted: Boolean(conversion),
    conversionLabel: conversion?.label,
  }

  if (session) {
    await payload.update({ collection: 'analytics-sessions', id: session.id, data: shared })
    return new NextResponse(null, { status: 204 })
  }

  const forwarded = headers.get('x-forwarded-for') || ''
  const ip = maskIp(str(forwarded.split(',')[0], 60) || str(headers.get('x-real-ip'), 60))
  const first = touchpoints[0]

  if (Math.random() < PRUNE_CHANCE) {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString()
    // Never let housekeeping break the request that triggered it.
    payload
      .delete({
        collection: 'analytics-sessions',
        where: { lastSeenAt: { less_than: cutoff } },
      })
      .catch(() => undefined)
  }

  await payload.create({
    collection: 'analytics-sessions',
    data: {
      ...shared,
      sessionId,
      startedAt: first.at,
      landingPath: first.path,
      referrer: str(body.referrer, 300),
      ip,
      // Vercel and Cloudflare both resolve location at the edge for us.
      country: decode(headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry')),
      region: decode(headers.get('x-vercel-ip-country-region')),
      city: decode(headers.get('x-vercel-ip-city')),
      userAgent: userAgent.slice(0, 400),
      ...parseUserAgent(userAgent),
    },
  })

  return new NextResponse(null, { status: 204 })
}
