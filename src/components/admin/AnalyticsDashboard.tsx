'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Summary of the visitor journeys, shown above the session list.
 *
 * Everything is scoped to the chosen date range, and picking a range also
 * filters the list underneath it, so the totals and the rows below always
 * describe the same period.
 */

type Series = { day: string; sessions: number; clicks: number; touchpoints: number }

type Summary = {
  totals: {
    sessions: number
    visitors: number
    touchpoints: number
    pageviews: number
    clicks: number
    bookCall: number
    freeAudit: number
    estimate: number
    conversions: number
    avgSeconds: number
  }
  series: Series[]
  topPages: { path: string; views: number }[]
  truncated: boolean
}

const RANGES = [
  { label: 'Today', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
]

const DAY_MS = 86_400_000

const duration = (s: number) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`)

const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })

/** Catmull-Rom through the points, so the line curves instead of zig-zagging. */
const smoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  return d
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div
      style={{
        background: 'var(--theme-input-bg)',
        border: '1px solid var(--theme-elevation-100)',
        borderRadius: 8,
        padding: '1rem 1.15rem',
      }}
    >
      <div style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-500)' }}>{label}</div>
      <div
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          lineHeight: 1.15,
          marginTop: '0.35rem',
          color: 'var(--theme-elevation-900)',
        }}
      >
        {value}
      </div>
      {hint ? (
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-450)', marginTop: 2 }}>
          {hint}
        </div>
      ) : null}
    </div>
  )
}

const PANEL = {
  background: 'var(--theme-input-bg)',
  border: '1px solid var(--theme-elevation-100)',
  borderRadius: 8,
}

export function AnalyticsDashboard() {
  const [days, setDays] = useState(7)
  const [data, setData] = useState<Summary | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    setState('loading')
    fetch(`/api/analytics/summary?days=${days}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: Summary) => {
        if (cancelled) return
        setData(json)
        setState('ready')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [days])

  /* Point the list below at the same period. */
  const applyRange = (next: number) => {
    setDays(next)
    const from = new Date(Date.now() - (next - 1) * DAY_MS)
    from.setUTCHours(0, 0, 0, 0)
    const url = new URL(window.location.href)
    url.searchParams.set('where[lastSeenAt][greater_than_equal]', from.toISOString())
    window.location.href = url.toString()
  }

  const chart = useMemo(() => {
    const series = data?.series || []
    if (series.length < 2) return null
    const w = 720
    const h = 180
    const pad = { top: 14, right: 8, bottom: 24, left: 34 }
    const peak = Math.max(1, ...series.flatMap((s) => [s.touchpoints, s.clicks]))
    const x = (i: number) => pad.left + (i * (w - pad.left - pad.right)) / (series.length - 1)
    const y = (v: number) => pad.top + (1 - v / peak) * (h - pad.top - pad.bottom)
    const line = (key: 'touchpoints' | 'clicks') =>
      smoothPath(series.map((s, i) => ({ x: x(i), y: y(s[key]) })))
    const every = Math.ceil(series.length / 8)
    return { w, h, pad, peak, x, y, line, series, every }
  }, [data])

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '0.9rem',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--theme-elevation-900)' }}>
          Overview
        </h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => applyRange(r.days)}
              style={{
                cursor: 'pointer',
                borderRadius: 999,
                padding: '0.32rem 0.8rem',
                fontSize: '0.76rem',
                fontWeight: 600,
                border: '1px solid var(--theme-elevation-150)',
                background: days === r.days ? '#6d4aff' : 'transparent',
                color: days === r.days ? '#fff' : 'var(--theme-elevation-600)',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {state === 'error' ? (
        <p style={{ color: 'var(--theme-error-500)', fontSize: '0.8rem' }}>
          Could not load the summary.
        </p>
      ) : null}

      {data ? (
        <div style={{ opacity: state === 'loading' ? 0.55 : 1, transition: 'opacity .2s' }}>
          <div
            style={{
              display: 'grid',
              gap: '0.75rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            }}
          >
            <Stat
              label="Visits"
              value={String(data.totals.sessions)}
              hint={`${data.totals.visitors} unique`}
            />
            <Stat
              label="Touchpoints"
              value={String(data.totals.touchpoints)}
              hint={`${data.totals.pageviews} page views`}
            />
            <Stat label="Clicks" value={String(data.totals.clicks)} />
            <Stat label="Book a Call clicks" value={String(data.totals.bookCall)} />
            <Stat label="Free Audit clicks" value={String(data.totals.freeAudit)} />
            <Stat label="Estimate Revenue clicks" value={String(data.totals.estimate)} />
            <Stat
              label="Avg. time on site"
              value={duration(data.totals.avgSeconds)}
              hint={`${data.totals.conversions} form submits`}
            />
          </div>

          {chart ? (
            <div style={{ ...PANEL, marginTop: '0.75rem', padding: '1rem 1.15rem 0.6rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--theme-elevation-500)',
                  marginBottom: 4,
                }}
              >
                Activity per day
              </div>
              <svg
                viewBox={`0 0 ${chart.w} ${chart.h}`}
                style={{ width: '100%', height: 'auto', overflow: 'visible' }}
                role="img"
                aria-label="Touchpoints and clicks per day"
              >
                <defs>
                  <linearGradient id="aa-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6d4aff" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#6d4aff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0, 0.5, 1].map((f) => {
                  const value = Math.round(chart.peak * (1 - f))
                  const yy = chart.pad.top + f * (chart.h - chart.pad.top - chart.pad.bottom)
                  return (
                    <g key={f}>
                      <line
                        x1={chart.pad.left}
                        x2={chart.w - chart.pad.right}
                        y1={yy}
                        y2={yy}
                        stroke="var(--theme-elevation-150)"
                        strokeDasharray="3 4"
                      />
                      <text x={0} y={yy + 3} fontSize="9" fill="var(--theme-elevation-450)">
                        {value}
                      </text>
                    </g>
                  )
                })}

                <path
                  d={`${chart.line('touchpoints')} L ${chart.x(chart.series.length - 1)} ${chart.h - chart.pad.bottom} L ${chart.x(0)} ${chart.h - chart.pad.bottom} Z`}
                  fill="url(#aa-fill)"
                />
                <path d={chart.line('touchpoints')} fill="none" stroke="#6d4aff" strokeWidth="2" />
                <path
                  d={chart.line('clicks')}
                  fill="none"
                  stroke="#d946ef"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {chart.series.map((s, i) => (
                  <g key={s.day}>
                    <circle cx={chart.x(i)} cy={chart.y(s.touchpoints)} r="3" fill="#6d4aff">
                      <title>{`${dayLabel(s.day)} — ${s.touchpoints} touchpoints, ${s.clicks} clicks, ${s.sessions} visits`}</title>
                    </circle>
                    {chart.series.length <= 10 || i % chart.every === 0 ? (
                      <text
                        x={chart.x(i)}
                        y={chart.h - 6}
                        fontSize="9"
                        textAnchor="middle"
                        fill="var(--theme-elevation-450)"
                      >
                        {dayLabel(s.day)}
                      </text>
                    ) : null}
                  </g>
                ))}
              </svg>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.7rem',
                  color: 'var(--theme-elevation-500)',
                  paddingBottom: '0.4rem',
                }}
              >
                <span>
                  <span style={{ color: '#6d4aff', fontWeight: 700 }}>—</span> Touchpoints
                </span>
                <span>
                  <span style={{ color: '#d946ef', fontWeight: 700 }}>- -</span> Clicks
                </span>
              </div>
            </div>
          ) : null}

          {data.topPages.length ? (
            <div style={{ ...PANEL, marginTop: '0.75rem', padding: '0.9rem 1.15rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--theme-elevation-500)',
                  marginBottom: '0.5rem',
                }}
              >
                Most viewed pages
              </div>
              {data.topPages.map((p) => (
                <div
                  key={p.path}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    fontSize: '0.78rem',
                    padding: '0.2rem 0',
                    color: 'var(--theme-elevation-700)',
                  }}
                >
                  <span
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {p.path}
                  </span>
                  <strong style={{ color: 'var(--theme-elevation-900)' }}>{p.views}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
