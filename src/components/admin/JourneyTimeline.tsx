'use client'

import { useAllFormFields } from '@payloadcms/ui'
import { useMemo } from 'react'

/**
 * The visit drawn as a single vertical line in the admin sidebar: where the
 * visitor came in, every step in between with how long it held them, and where
 * they left. Reads live form state, so it reflects the document on screen.
 */

type Point = { type?: string; label?: string; path?: string; at?: string; seconds?: number }

const TONE: Record<string, string> = {
  pageview: '#6d4aff',
  click: '#8b5cf6',
  outbound: '#f97316',
  form: '#10b981',
  video: '#d946ef',
  conversion: '#10b981',
}

const VERB: Record<string, string> = {
  pageview: 'Viewed',
  click: 'Clicked',
  outbound: 'Left to',
  form: 'Submitted',
  video: 'Played',
  conversion: 'Converted',
}

const clock = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const dwell = (seconds?: number) => {
  const s = Math.round(seconds || 0)
  if (!s) return null
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
}

export function JourneyTimeline() {
  const [fields] = useAllFormFields()

  const points = useMemo(() => {
    const rows: Point[] = []
    Object.entries(fields || {}).forEach(([key, field]) => {
      const match = /^touchpoints\.(\d+)\.(type|label|path|at|seconds)$/.exec(key)
      if (!match) return
      const [, index, prop] = match
      const row = (rows[Number(index)] ||= {})
      ;(row as Record<string, unknown>)[prop] = (field as { value?: unknown })?.value
    })
    return rows.filter(Boolean)
  }, [fields])

  if (!points.length) return null

  const total = points.reduce((sum, p) => sum + (p.seconds || 0), 0)

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '0.15rem',
          color: 'var(--theme-elevation-800)',
        }}
      >
        Journey
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-500)', marginBottom: '0.9rem' }}>
        {points.length} touchpoints · {dwell(total) || '0s'} on site
      </div>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
        {/* the spine */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 5,
            top: 6,
            bottom: 6,
            width: 2,
            background: 'var(--theme-elevation-150)',
          }}
        />

        {points.map((point, i) => {
          const tone = TONE[point.type || 'pageview'] || TONE.pageview
          const edge = i === 0 ? 'Entered' : i === points.length - 1 ? 'Exited' : null
          const time = dwell(point.seconds)
          return (
            <li
              key={i}
              style={{
                position: 'relative',
                paddingLeft: '1.35rem',
                paddingBottom: i === points.length - 1 ? 0 : '1rem',
              }}
            >
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: tone,
                  boxShadow: '0 0 0 3px var(--theme-bg)',
                }}
              />

              {edge && (
                <div
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--theme-elevation-450)',
                    marginBottom: 2,
                  }}
                >
                  {edge}
                </div>
              )}

              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--theme-elevation-800)',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                }}
              >
                {point.label || point.path || VERB[point.type || ''] || 'Step'}
              </div>

              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--theme-elevation-500)',
                  marginTop: 2,
                  wordBreak: 'break-word',
                }}
              >
                {VERB[point.type || ''] || point.type}
                {point.path ? ` · ${point.path}` : ''}
              </div>

              <div style={{ fontSize: '0.66rem', color: 'var(--theme-elevation-450)', marginTop: 1 }}>
                {clock(point.at)}
                {time ? ` · stayed ${time}` : ''}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
