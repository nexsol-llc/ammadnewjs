import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Moves one lead to another stage, along with whatever that stage asks for.
 *
 * Each stage has its own required detail — a date to connect, revenue and terms
 * to win, a reason to lose — and it is enforced here rather than only in the
 * dialog, so the board cannot end up with a won deal that has no value on it.
 */

const COLLECTIONS = ['leads', 'contact-submissions', 'audit-requests'] as const
type Collection = (typeof COLLECTIONS)[number]

const STAGES = ['new', 'connected', 'won', 'lost'] as const
type Stage = (typeof STAGES)[number]

const text = (v: unknown, max = 600) =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined

/* An empty input arrives as '' and Number('') is 0, which would quietly record
   a won deal worth nothing. Treat blank as missing. */
const amount = (v: unknown) => {
  if (v === null || v === undefined) return NaN
  if (typeof v === 'string' && !v.trim()) return NaN
  return Number(v)
}

const date = (v: unknown) => {
  const d = new Date(typeof v === 'string' || typeof v === 'number' ? v : NaN)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ error: 'Not authorised' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const collection = body.collection as Collection
  const stage = body.stage as Stage
  const id = text(String(body.id ?? ''), 60)

  if (!COLLECTIONS.includes(collection) || !STAGES.includes(stage) || !id) {
    return NextResponse.json({ error: 'Unknown lead or stage' }, { status: 400 })
  }

  const data: Record<string, unknown> = { stage }

  if (stage === 'connected') {
    const when = date(body.connectedAt)
    if (!when) return NextResponse.json({ error: 'A connection date is required' }, { status: 400 })
    data.connectedAt = when
  }

  if (stage === 'won') {
    const when = date(body.wonAt)
    const value = amount(body.dealValue)
    const terms = text(body.dealTerms)
    if (!when) return NextResponse.json({ error: 'A win date is required' }, { status: 400 })
    if (!Number.isFinite(value) || value < 0) {
      return NextResponse.json({ error: 'Revenue is required' }, { status: 400 })
    }
    if (!terms) return NextResponse.json({ error: 'Terms are required' }, { status: 400 })
    data.wonAt = when
    data.dealValue = Math.round(value)
    data.dealTerms = terms
    // Winning implies they were connected first; fill it in if it is missing.
    data.connectedAt = date(body.connectedAt) || when
  }

  if (stage === 'lost') {
    const reason = text(body.lostReason)
    if (!reason) return NextResponse.json({ error: 'A reason is required' }, { status: 400 })
    data.lostReason = reason
  }

  if (stage === 'new') {
    // Back to the top of the board: clear the outcome so nothing stale lingers.
    data.connectedAt = null
    data.wonAt = null
    data.dealValue = null
    data.dealTerms = null
    data.lostReason = null
  }

  try {
    await payload.update({ collection, id, data })
  } catch {
    return NextResponse.json({ error: 'Could not update that lead' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
