import { MonitorPlay, Search, Store, Tag, UserRound } from 'lucide-react'
import { CommissionTicker } from '@/components/fx/CommissionTicker'

/**
 * Affiliate program, as a moving diagram: partners feed traffic into the brand
 * along live connectors, and a commission only leaves once a sale lands.
 *
 * Everything is sized in percentages of the 5:4 stage so the SVG connectors
 * (drawn in a matching 400×320 space) always meet the chips, at any width.
 * Motion is pure CSS, so this stays a server component.
 */

const NODES = [
  { x: 17.5, y: 19.4, icon: UserRound, label: 'Creators', delay: 0 },
  { x: 82.5, y: 21.9, icon: MonitorPlay, label: 'Content sites', delay: 1.6 },
  { x: 16.5, y: 78.1, icon: Tag, label: 'Deal partners', delay: 2.8 },
  { x: 83.5, y: 76.3, icon: Search, label: 'Comparison', delay: 0.9 },
]

const LINKS = [
  { d: 'M 94 80 Q 128 118 163 132', delay: 0 },
  { d: 'M 305 87 Q 264 112 238 134', delay: 0.5 },
  { d: 'M 91 233 Q 128 214 162 186', delay: 1 },
  { d: 'M 309 228 Q 272 210 239 184', delay: 1.5 },
]

export function AffiliateFlow() {
  return (
    <div aria-hidden className="relative aspect-[5/4] w-full select-none">
      <svg viewBox="0 0 400 320" fill="none" className="absolute inset-0 h-full w-full">
        {LINKS.map((l) => (
          <g key={l.d}>
            <path d={l.d} stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
            <path
              d={l.d}
              className="animate-flow"
              stroke="var(--color-brand-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4 12"
              style={{ animationDelay: `${l.delay}s` }}
            />
          </g>
        ))}
        <circle
          cx="200"
          cy="160"
          r="62"
          className="animate-ring-spin"
          stroke="var(--color-brand-200)"
          strokeWidth="1.5"
          strokeDasharray="3 9"
          style={{ transformOrigin: '200px 160px' }}
        />
      </svg>

      {/* The brand at the centre of its own partner network */}
      <div className="absolute left-1/2 top-1/2 h-[25%] w-[20%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-full w-full items-center justify-center rounded-[26%] bg-gradient-to-b from-brand-400 to-brand-600 text-white shadow-[0_16px_32px_-14px_rgba(91,51,245,0.8)]">
          <span className="animate-pulse-ring absolute inset-0 rounded-[26%] border-2 border-brand-400" />
          <Store className="h-1/2 w-1/2" />
        </div>
      </div>
      <span className="absolute left-1/2 top-[67%] -translate-x-1/2 whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink-400">
        Your brand
      </span>

      {NODES.map((n) => (
        <div
          key={n.label}
          className="absolute h-[17.5%] w-[14%] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div
            className="animate-float flex h-full w-full items-center justify-center rounded-[30%] border border-line bg-white shadow-[0_10px_22px_-14px_rgba(16,16,40,0.5)]"
            style={{ animationDelay: `${n.delay}s` }}
          >
            <n.icon className="h-1/2 w-1/2 text-brand-600" />
          </div>
          <span className="absolute left-1/2 top-[116%] -translate-x-1/2 whitespace-nowrap text-[0.6rem] font-medium text-ink-400">
            {n.label}
          </span>
        </div>
      ))}

      {/* Payouts — one lands, then the next */}
      <CommissionTicker />
    </div>
  )
}
