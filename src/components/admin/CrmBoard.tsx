'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * The CRM board: leads from all three forms in one pipeline.
 *
 * The first three columns are the sources, so a new lead always lands under the
 * form it came from. Dragging into Connected, Won or Lost asks for what that
 * stage needs before it commits — a date, the revenue and terms, or a reason —
 * because a stage without those details is not worth recording.
 */

type Card = {
  id: string
  collection: string
  source: 'calculator' | 'contact' | 'audit'
  name: string
  email?: string
  company?: string
  subtitle?: string
  stage: 'new' | 'connected' | 'won' | 'lost'
  createdAt: string
  connectedAt?: string
  wonAt?: string
  dealValue?: number
  dealTerms?: string
  lostReason?: string
}

type Board = {
  cards: Card[]
  overview: {
    total: number
    new: number
    connected: number
    won: number
    lost: number
    wonValue: number
    winRate: number
  }
}

type Column = {
  key: string
  title: string
  stage: Card['stage']
  source?: Card['source']
  tone: string
}

const COLUMNS: Column[] = [
  { key: 'calculator', title: 'Calculator', stage: 'new', source: 'calculator', tone: '#6d4aff' },
  { key: 'contact', title: 'Contact', stage: 'new', source: 'contact', tone: '#8b5cf6' },
  { key: 'audit', title: 'Audit', stage: 'new', source: 'audit', tone: '#d946ef' },
  { key: 'connected', title: 'Connected', stage: 'connected', tone: '#0ea5e9' },
  { key: 'won', title: 'Won', stage: 'won', tone: '#10b981' },
  { key: 'lost', title: 'Lost', stage: 'lost', tone: '#ef4444' },
]

const SOURCE_LABEL: Record<Card['source'], string> = {
  calculator: 'Calculator',
  contact: 'Contact',
  audit: 'Audit',
}

const today = () => new Date().toISOString().slice(0, 10)

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

const shortDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : ''

const PANEL = {
  background: 'var(--theme-input-bg)',
  border: '1px solid var(--theme-elevation-100)',
  borderRadius: 8,
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div style={{ ...PANEL, padding: '0.9rem 1.1rem' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--theme-elevation-500)' }}>{label}</div>
      <div
        style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          lineHeight: 1.15,
          marginTop: '0.3rem',
          color: 'var(--theme-elevation-900)',
        }}
      >
        {value}
      </div>
      {hint ? (
        <div style={{ fontSize: '0.68rem', color: 'var(--theme-elevation-450)', marginTop: 2 }}>
          {hint}
        </div>
      ) : null}
    </div>
  )
}

/** What each stage insists on before a card can land there. */
type Draft = {
  card: Card
  stage: Card['stage']
  connectedAt: string
  wonAt: string
  dealValue: string
  dealTerms: string
  lostReason: string
}

export function CrmBoard() {
  const [board, setBoard] = useState<Board | null>(null)
  const [error, setError] = useState<string | null>(null)
  /* The dragged card lives in a ref, not state: a drop can land in the same tick
     as the drag start, and state would not have settled by then. The state copy
     exists only to dim the card being moved. */
  const held = useRef<Card | null>(null)
  const [dragging, setDragging] = useState<Card | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    fetch('/api/crm/board', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setBoard)
      .catch(() => setError('Could not load the board.'))
  }, [])

  useEffect(load, [load])

  const byColumn = useMemo(() => {
    const map = new Map<string, Card[]>()
    for (const column of COLUMNS) {
      map.set(
        column.key,
        (board?.cards || []).filter(
          (c) => c.stage === column.stage && (!column.source || c.source === column.source),
        ),
      )
    }
    return map
  }, [board])

  const commit = async (payload: Record<string, unknown>) => {
    setSaving(true)
    try {
      const res = await fetch('/api/crm/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Could not move that lead.')
        return false
      }
      setError(null)
      load()
      return true
    } finally {
      setSaving(false)
    }
  }

  const drop = (column: Column) => {
    const card = held.current
    held.current = null
    setDragging(null)
    setOver(null)
    if (!card) return

    // A lead can only go back to the form it came from.
    if (column.source && column.source !== card.source) return
    if (card.stage === column.stage && (!column.source || card.source === column.source)) return

    if (column.stage === 'new') {
      void commit({ collection: card.collection, id: card.id, stage: 'new' })
      return
    }

    setDraft({
      card,
      stage: column.stage,
      connectedAt: card.connectedAt?.slice(0, 10) || today(),
      wonAt: card.wonAt?.slice(0, 10) || today(),
      dealValue: card.dealValue ? String(card.dealValue) : '',
      dealTerms: card.dealTerms || '',
      lostReason: card.lostReason || '',
    })
  }

  const submitDraft = async () => {
    if (!draft) return
    const ok = await commit({
      collection: draft.card.collection,
      id: draft.card.id,
      stage: draft.stage,
      connectedAt: draft.connectedAt,
      wonAt: draft.wonAt,
      dealValue: draft.dealValue,
      dealTerms: draft.dealTerms,
      lostReason: draft.lostReason,
    })
    if (ok) setDraft(null)
  }

  const field = {
    width: '100%',
    padding: '0.45rem 0.6rem',
    borderRadius: 6,
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-input-bg)',
    color: 'var(--theme-elevation-900)',
    fontSize: '0.85rem',
  } as const

  const label = {
    display: 'block',
    fontSize: '0.72rem',
    color: 'var(--theme-elevation-500)',
    marginBottom: 4,
    marginTop: '0.75rem',
  } as const

  return (
    <div>
      <h1 style={{ margin: '0 0 0.35rem', fontSize: '1.5rem', color: 'var(--theme-elevation-1000)' }}>
        CRM
      </h1>
      <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--theme-elevation-500)' }}>
        Every lead from the calculator, the contact form and the audit form. Drag a card to move it
        along the pipeline.
      </p>

      {error ? (
        <p style={{ color: 'var(--theme-error-500)', fontSize: '0.82rem' }}>{error}</p>
      ) : null}

      {board ? (
        <>
          <div
            style={{
              display: 'grid',
              gap: '0.7rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              marginBottom: '1.4rem',
            }}
          >
            <Stat label="All leads" value={String(board.overview.total)} />
            <Stat label="New" value={String(board.overview.new)} hint="waiting on you" />
            <Stat label="Connected" value={String(board.overview.connected)} />
            <Stat label="Won" value={String(board.overview.won)} hint={`${board.overview.winRate}% win rate`} />
            <Stat label="Lost" value={String(board.overview.lost)} />
            <Stat label="Revenue won" value={money(board.overview.wonValue)} />
          </div>

          <div style={{ display: 'flex', gap: '0.7rem', overflowX: 'auto', paddingBottom: '0.6rem' }}>
            {COLUMNS.map((column) => {
              const cards = byColumn.get(column.key) || []
              const active = over === column.key
              return (
                <section
                  key={column.key}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setOver(column.key)
                  }}
                  onDragLeave={() => setOver((k) => (k === column.key ? null : k))}
                  onDrop={() => drop(column)}
                  style={{
                    ...PANEL,
                    flex: '1 0 230px',
                    minWidth: 230,
                    padding: '0.7rem',
                    outline: active ? `2px dashed ${column.tone}` : '2px dashed transparent',
                    transition: 'outline-color .15s',
                  }}
                >
                  <header
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: '0.6rem',
                      paddingLeft: 2,
                    }}
                  >
                    <span
                      style={{ width: 8, height: 8, borderRadius: 999, background: column.tone }}
                    />
                    <strong style={{ fontSize: '0.82rem', color: 'var(--theme-elevation-900)' }}>
                      {column.title}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--theme-elevation-450)' }}>
                      {cards.length}
                    </span>
                  </header>

                  {cards.map((card) => (
                    <article
                      key={`${card.collection}-${card.id}`}
                      draggable
                      onDragStart={(e) => {
                        held.current = card
                        setDragging(card)
                        e.dataTransfer.effectAllowed = 'move'
                      }}
                      onDragEnd={() => {
                        held.current = null
                        setDragging(null)
                      }}
                      style={{
                        background: 'var(--theme-elevation-50)',
                        border: '1px solid var(--theme-elevation-150)',
                        borderLeft: `3px solid ${column.tone}`,
                        borderRadius: 6,
                        padding: '0.6rem 0.7rem',
                        marginBottom: '0.5rem',
                        cursor: 'grab',
                        opacity: dragging?.id === card.id && dragging.collection === card.collection ? 0.4 : 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--theme-elevation-900)',
                        }}
                      >
                        {card.name}
                      </div>
                      {card.email ? (
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--theme-elevation-500)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {card.email}
                        </div>
                      ) : null}
                      {card.subtitle ? (
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--theme-elevation-450)',
                            marginTop: 4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {card.subtitle}
                        </div>
                      ) : null}

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 6,
                          marginTop: 6,
                          fontSize: '0.66rem',
                          color: 'var(--theme-elevation-450)',
                        }}
                      >
                        <span>{column.source ? shortDate(card.createdAt) : SOURCE_LABEL[card.source]}</span>
                        <span style={{ color: 'var(--theme-elevation-600)' }}>
                          {card.stage === 'won' && card.dealValue ? money(card.dealValue) : null}
                          {card.stage === 'connected' ? shortDate(card.connectedAt) : null}
                          {card.stage === 'lost' ? (card.lostReason || '').slice(0, 22) : null}
                        </span>
                      </div>

                      <a
                        href={`/admin/collections/${card.collection}/${card.id}`}
                        style={{
                          display: 'inline-block',
                          marginTop: 6,
                          fontSize: '0.68rem',
                          color: column.tone,
                          textDecoration: 'none',
                        }}
                      >
                        Open →
                      </a>
                    </article>
                  ))}

                  {!cards.length ? (
                    <p
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--theme-elevation-400)',
                        textAlign: 'center',
                        padding: '1.1rem 0',
                        margin: 0,
                      }}
                    >
                      Nothing here
                    </p>
                  ) : null}
                </section>
              )
            })}
          </div>
        </>
      ) : null}

      {draft ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setDraft(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6,6,14,0.6)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: 'min(420px, 100%)',
              background: 'var(--theme-bg)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 10,
              padding: '1.4rem',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--theme-elevation-1000)' }}>
              {draft.stage === 'connected' ? 'Mark as connected' : null}
              {draft.stage === 'won' ? 'Mark as won' : null}
              {draft.stage === 'lost' ? 'Mark as lost' : null}
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--theme-elevation-500)' }}>
              {draft.card.name}
            </p>

            {draft.stage === 'connected' ? (
              <>
                <label style={label} htmlFor="crm-connected">
                  Date connected
                </label>
                <input
                  id="crm-connected"
                  type="date"
                  style={field}
                  value={draft.connectedAt}
                  onChange={(e) => setDraft({ ...draft, connectedAt: e.target.value })}
                />
              </>
            ) : null}

            {draft.stage === 'won' ? (
              <>
                <label style={label} htmlFor="crm-value">
                  Revenue
                </label>
                <input
                  id="crm-value"
                  type="number"
                  min="0"
                  placeholder="5000"
                  style={field}
                  value={draft.dealValue}
                  onChange={(e) => setDraft({ ...draft, dealValue: e.target.value })}
                />
                <label style={label} htmlFor="crm-terms">
                  Terms
                </label>
                <textarea
                  id="crm-terms"
                  rows={3}
                  placeholder="Retainer, commission split, length…"
                  style={{ ...field, resize: 'vertical' }}
                  value={draft.dealTerms}
                  onChange={(e) => setDraft({ ...draft, dealTerms: e.target.value })}
                />
                <label style={label} htmlFor="crm-won">
                  Date won
                </label>
                <input
                  id="crm-won"
                  type="date"
                  style={field}
                  value={draft.wonAt}
                  onChange={(e) => setDraft({ ...draft, wonAt: e.target.value })}
                />
              </>
            ) : null}

            {draft.stage === 'lost' ? (
              <>
                <label style={label} htmlFor="crm-reason">
                  Reason
                </label>
                <textarea
                  id="crm-reason"
                  rows={3}
                  placeholder="Budget, timing, went with someone else…"
                  style={{ ...field, resize: 'vertical' }}
                  value={draft.lostReason}
                  onChange={(e) => setDraft({ ...draft, lostReason: e.target.value })}
                />
              </>
            ) : null}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1.2rem' }}>
              <button
                type="button"
                onClick={() => setDraft(null)}
                style={{
                  cursor: 'pointer',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 6,
                  border: '1px solid var(--theme-elevation-150)',
                  background: 'transparent',
                  color: 'var(--theme-elevation-700)',
                  fontSize: '0.82rem',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={submitDraft}
                style={{
                  cursor: saving ? 'wait' : 'pointer',
                  padding: '0.45rem 1.1rem',
                  borderRadius: 6,
                  border: 'none',
                  background: '#6d4aff',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
