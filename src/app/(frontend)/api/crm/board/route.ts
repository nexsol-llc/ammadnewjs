import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Everything the CRM board needs, in one request.
 *
 * The three lead collections keep their own shapes, so they are normalised into
 * one card format here rather than in the browser — the board only ever deals
 * with cards, wherever the lead came from.
 */

const SOURCES = [
  { collection: 'leads' as const, source: 'calculator', label: 'Calculator' },
  { collection: 'contact-submissions' as const, source: 'contact', label: 'Contact' },
  { collection: 'audit-requests' as const, source: 'audit', label: 'Audit' },
]

const LIMIT = 500

type Row = Record<string, unknown>

const text = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)

/** One line under the name that says what this lead is actually about. */
const subtitleFor = (source: string, row: Row) => {
  if (source === 'calculator') return text(row.summary)
  if (source === 'audit') return text(row.summary) || text(row.company)
  return text(row.message)?.slice(0, 140) || text(row.service)
}

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ error: 'Not authorised' }, { status: 401 })

  const results = await Promise.all(
    SOURCES.map(({ collection }) =>
      payload.find({ collection, limit: LIMIT, depth: 0, sort: '-createdAt' }),
    ),
  )

  const cards = results.flatMap((result, i) => {
    const { source } = SOURCES[i]
    return result.docs.map((raw) => {
      const row = raw as unknown as Row
      return {
        id: String(row.id),
        collection: SOURCES[i].collection,
        source,
        name: text(row.name) || text(row.email) || 'Unnamed lead',
        email: text(row.email),
        company: text(row.company) || text(row.websiteUrl) || text(row.website),
        subtitle: subtitleFor(source, row),
        stage: (text(row.stage) as string) || 'new',
        createdAt: row.createdAt as string,
        connectedAt: row.connectedAt as string | undefined,
        wonAt: row.wonAt as string | undefined,
        dealValue: typeof row.dealValue === 'number' ? row.dealValue : undefined,
        dealTerms: text(row.dealTerms),
        lostReason: text(row.lostReason),
      }
    })
  })

  const by = (stage: string) => cards.filter((c) => c.stage === stage)
  const won = by('won')
  const decided = won.length + by('lost').length

  return NextResponse.json({
    cards: cards.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    overview: {
      total: cards.length,
      new: by('new').length,
      connected: by('connected').length,
      won: won.length,
      lost: by('lost').length,
      wonValue: won.reduce((sum, c) => sum + (c.dealValue || 0), 0),
      winRate: decided ? Math.round((won.length / decided) * 100) : 0,
    },
  })
}
