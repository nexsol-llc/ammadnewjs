import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Deletes the leads the board has selected, whichever collection they sit in.
 *
 * The board always sends an explicit list of ids — there is no "delete
 * everything" flag — so a bug in the client can never wipe more than what the
 * user could see and tick. Access is re-checked per collection rather than
 * trusted from the session alone.
 */

const COLLECTIONS = ['leads', 'contact-submissions', 'audit-requests'] as const
type Collection = (typeof COLLECTIONS)[number]

/* The board itself only ever loads 500 cards per collection, so anything past
   this is a malformed request rather than a real selection. */
const MAX = 1500

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

  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) return NextResponse.json({ error: 'Nothing selected' }, { status: 400 })
  if (items.length > MAX) {
    return NextResponse.json({ error: `Select at most ${MAX} leads at a time` }, { status: 400 })
  }

  const grouped = new Map<Collection, string[]>()
  for (const raw of items) {
    const item = raw as { collection?: unknown; id?: unknown }
    const collection = item.collection as Collection
    const id = String(item.id ?? '').trim()
    if (!COLLECTIONS.includes(collection) || !id) {
      return NextResponse.json({ error: 'Unknown lead' }, { status: 400 })
    }
    grouped.set(collection, [...(grouped.get(collection) || []), id])
  }

  let deleted = 0
  try {
    for (const [collection, ids] of grouped) {
      const result = await payload.delete({
        collection,
        where: { id: { in: ids } },
        // Run the collection's own delete access rule against this user.
        overrideAccess: false,
        user,
      })
      deleted += result.docs.length
    }
  } catch {
    return NextResponse.json({ error: 'Could not delete those leads' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, deleted })
}
