import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import type { AnalyticsSession } from '@/payload-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Aggregates the visitor journeys into the numbers behind the admin dashboard.
 *
 * Admin-only: the raw journeys are private, so the request must carry a logged-in
 * Payload session. Counting happens here rather than in the browser so the admin
 * never has to download every touchpoint just to total them up.
 */

const MAX_SESSIONS = 5000
const DAY_MS = 86_400_000

type Touchpoint = NonNullable<AnalyticsSession['touchpoints']>[number]

/* Each call to action appears in several places with slightly different wording
   — header, mobile bar, hero, footer — so match on intent across the label and
   the destination rather than tying the count to one button. */
const CTA = {
  bookCall: /book a call|book a free growth call|calendly/i,
  freeAudit: /free audit|\/free-audit/i,
  estimate: /estimate revenue|revenue calculator|calculate my revenue|revenue-calculator/i,
}

const isClick = (t: Touchpoint) => t.type === 'click' || t.type === 'outbound'

const hits = (t: Touchpoint, pattern: RegExp) =>
  isClick(t) && pattern.test(`${t.label ?? ''} ${t.path ?? ''}`)

const dayKey = (iso?: string | null) => (iso || '').slice(0, 10)

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ error: 'Not authorised' }, { status: 401 })

  const url = new URL(req.url)
  const days = Math.min(Math.max(Number(url.searchParams.get('days')) || 7, 1), 365)
  const to = new Date()
  const from = new Date(to.getTime() - (days - 1) * DAY_MS)
  from.setUTCHours(0, 0, 0, 0)

  const result = await payload.find({
    collection: 'analytics-sessions',
    where: { lastSeenAt: { greater_than_equal: from.toISOString() } },
    limit: MAX_SESSIONS,
    depth: 0,
    sort: '-lastSeenAt',
  })

  const totals = {
    sessions: result.docs.length,
    visitors: new Set<string>().size,
    touchpoints: 0,
    pageviews: 0,
    clicks: 0,
    bookCall: 0,
    freeAudit: 0,
    estimate: 0,
    conversions: 0,
    seconds: 0,
  }
  const visitors = new Set<string>()
  const byDay = new Map<string, { sessions: number; clicks: number; touchpoints: number }>()
  const pages = new Map<string, number>()

  // Seed every day in the range so the chart has no gaps.
  for (let i = 0; i < days; i++) {
    byDay.set(new Date(from.getTime() + i * DAY_MS).toISOString().slice(0, 10), {
      sessions: 0,
      clicks: 0,
      touchpoints: 0,
    })
  }

  const bump = (key: string, field: 'sessions' | 'clicks' | 'touchpoints', by = 1) => {
    const row = byDay.get(key)
    if (row) row[field] += by
  }

  for (const session of result.docs) {
    if (session.visitorId) visitors.add(session.visitorId)
    totals.seconds += session.durationSeconds || 0
    if (session.converted) totals.conversions += 1
    bump(dayKey(session.startedAt || session.lastSeenAt), 'sessions')

    for (const point of session.touchpoints || []) {
      const key = dayKey(point.at)
      totals.touchpoints += 1
      bump(key, 'touchpoints')

      if (point.type === 'pageview') {
        totals.pageviews += 1
        if (point.path) pages.set(point.path, (pages.get(point.path) || 0) + 1)
      }
      if (point.type === 'click' || point.type === 'outbound') {
        totals.clicks += 1
        bump(key, 'clicks')
      }
      if (hits(point, CTA.bookCall)) totals.bookCall += 1
      if (hits(point, CTA.freeAudit)) totals.freeAudit += 1
      if (hits(point, CTA.estimate)) totals.estimate += 1
    }
  }

  totals.visitors = visitors.size

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString(), days },
    totals: {
      ...totals,
      avgSeconds: totals.sessions ? Math.round(totals.seconds / totals.sessions) : 0,
    },
    series: [...byDay.entries()].map(([day, v]) => ({ day, ...v })),
    topPages: [...pages.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([path, views]) => ({ path, views })),
    truncated: result.docs.length >= MAX_SESSIONS,
  })
}
