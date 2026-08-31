import { RefreshCw, TrendingUp } from 'lucide-react'
import { CHIP_CLASS } from '@/components/fx/chip'

/**
 * Partnership management, as a moving diagram: a live partner roster that gets
 * worked through row by row, feeding an always-on optimisation loop.
 *
 * Same 5:4 stage and 400×320 connector space as the other services
 * illustrations. Motion is pure CSS, so this stays a server component.
 */

const ROWS = [
  { tier: '12%', perf: 88, hue: 'from-brand-400 to-brand-600', delay: 0 },
  { tier: '8%', perf: 62, hue: 'from-fuchsia-400 to-fuchsia-600', delay: 1.2 },
  { tier: '10%', perf: 74, hue: 'from-mint-500 to-mint-600', delay: 2.4 },
  { tier: '5%', perf: 41, hue: 'from-orange-300 to-orange-500', delay: 3.6 },
]

/* Roster → optimisation loop, and back again. */
const LINKS = [
  { d: 'M 264 120 Q 292 132 306 148', delay: 0 },
  { d: 'M 264 208 Q 292 196 306 172', delay: 0.6 },
]

export function PartnershipFlow() {
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
      </svg>

      {/* The roster — each partner reviewed in turn */}
      <div className="absolute left-[3%] top-[20%] h-[60%] w-[62%] rounded-[7%] border border-line bg-white p-[4%] shadow-[0_16px_34px_-20px_rgba(16,16,40,0.5)]">
        <div className="flex h-full flex-col justify-between">
          {ROWS.map((r) => (
            <div
              key={r.tier + r.perf}
              className="animate-row-glow flex items-center gap-[4%] rounded-lg px-[3%] py-[1.5%]"
              style={{ animationDelay: `${r.delay}s` }}
            >
              <span
                className={`h-4 w-4 shrink-0 rounded-full bg-gradient-to-br sm:h-5 sm:w-5 ${r.hue}`}
              />
              <span className="min-w-0 flex-1">
                <span className="block h-1.5 w-3/5 rounded-full bg-surface-3" />
                <span
                  className="mt-1.5 block h-1 rounded-full bg-brand-300"
                  style={{ width: `${r.perf}%` }}
                />
              </span>
              <span className="shrink-0 rounded-full bg-brand-50 px-1.5 py-0.5 text-[0.5rem] font-bold text-brand-600 sm:text-[0.58rem]">
                {r.tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Always-on optimisation */}
      <div className="absolute left-[83%] top-[50%] h-[18.75%] w-[15%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-full w-full items-center justify-center rounded-full border border-line bg-white shadow-[0_12px_26px_-16px_rgba(16,16,40,0.55)]">
          <span className="animate-pulse-ring absolute inset-0 rounded-full border-2 border-brand-300" />
          <RefreshCw className="h-1/2 w-1/2 text-brand-600" />
        </div>
        <span className="absolute left-1/2 top-[118%] -translate-x-1/2 whitespace-nowrap text-[0.6rem] font-medium text-ink-400">
          Every month
        </span>
      </div>

      {/* The outcome of a review */}
      <div className="absolute left-[42%] top-[5%] -translate-x-1/2">
        <div className={`animate-badge ${CHIP_CLASS}`}>
          <TrendingUp className="h-3 w-3 text-mint-600 sm:h-3.5 sm:w-3.5" />
          Tier upgraded to 12%
        </div>
      </div>
    </div>
  )
}
