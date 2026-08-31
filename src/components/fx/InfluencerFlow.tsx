import { Eye, Heart } from 'lucide-react'
import type { CSSProperties } from 'react'
import { CHIP_CLASS } from '@/components/fx/chip'
import { OrdersTicker } from '@/components/fx/OrdersTicker'

/**
 * Influencer marketing, as a moving diagram: creators publish into a live feed,
 * and that content turns into reach, engagement, and orders.
 *
 * Same 5:4 stage and 400×320 connector space as [AffiliateFlow], so the two
 * illustrations read as one set. Motion is pure CSS — no client JS.
 */

const POSTS = [
  { id: 'a', hue: 'from-brand-200 to-fuchsia-200' },
  { id: 'b', hue: 'from-fuchsia-200 to-orange-200' },
  { id: 'c', hue: 'from-brand-300 to-brand-100' },
]

/* The orders chip is its own client component so the count can keep climbing —
   see [OrdersTicker]. */
const CHIPS = [
  { x: 78, y: 20, icon: Eye, label: '12.4K views', tone: 'text-brand-600', delay: 0 },
  { x: 84, y: 50, icon: Heart, label: '8.4% engaged', tone: 'text-fuchsia-500', delay: 1.8 },
]

const LINKS = [
  { d: 'M 196 96 Q 244 76 266 70', delay: 0 },
  { d: 'M 198 166 Q 250 164 290 160', delay: 0.55 },
  { d: 'M 196 234 Q 240 250 260 254', delay: 1.1 },
]

const HEARTS = [
  { x: 33, y: 64, delay: 0, drift: 20 },
  { x: 41, y: 72, delay: 1.5, drift: -16 },
  { x: 28, y: 76, delay: 2.7, drift: 26 },
  { x: 44, y: 60, delay: 3.8, drift: 12 },
]

function Post({ hue }: { hue: string }) {
  return (
    <div className="mb-[6%] rounded-[9%] border border-line bg-white p-[7%]">
      <div className="flex items-center gap-[5%]">
        <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-400" />
        <span className="h-1 w-1/2 rounded-full bg-surface-3" />
      </div>
      <div className={`mt-[7%] h-7 rounded-[7%] bg-gradient-to-br ${hue}`} />
      <div className="mt-[7%] flex items-center gap-[5%]">
        <Heart className="h-2.5 w-2.5 shrink-0 text-fuchsia-400" fill="currentColor" />
        <span className="h-1 w-1/3 rounded-full bg-surface-3" />
      </div>
    </div>
  )
}

export function InfluencerFlow() {
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

      {/* Creator roster feeding the feed below */}
      <div className="absolute left-[30%] top-[2%] -translate-x-1/2">
        <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-2 py-1 shadow-[0_10px_22px_-14px_rgba(16,16,40,0.5)] sm:px-2.5 sm:py-1.5">
          <span className="flex -space-x-1.5">
            {['from-brand-400 to-brand-600', 'from-fuchsia-400 to-fuchsia-600', 'from-orange-300 to-orange-500'].map(
              (g) => (
                <span
                  key={g}
                  className={`h-3 w-3 rounded-full border border-white bg-gradient-to-br sm:h-3.5 sm:w-3.5 ${g}`}
                />
              ),
            )}
          </span>
          <span className="text-[0.56rem] font-semibold text-ink-500 sm:text-[0.62rem]">24 creators live</span>
        </div>
      </div>

      {/* The phone: an endlessly scrolling feed */}
      <div className="absolute left-[30%] top-[52%] h-[72%] w-[36%] -translate-x-1/2 -translate-y-1/2">
        <div className="animate-float h-full w-full rounded-[15%] border border-line-strong bg-white p-[4%] shadow-[0_20px_44px_-20px_rgba(16,16,40,0.5)]">
          <div className="relative h-full w-full overflow-hidden rounded-[12%] bg-surface-2">
            <div className="animate-feed absolute inset-x-0 top-0 p-[7%]">
              {[0, 1].map((copy) =>
                POSTS.map((p) => <Post key={`${copy}-${p.id}`} hue={p.hue} />),
              )}
            </div>
          </div>
        </div>
      </div>

      {HEARTS.map((h) => (
        <div
          key={`${h.x}-${h.y}`}
          className="absolute -translate-x-1/2"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <div
            className="animate-heart"
            style={{ animationDelay: `${h.delay}s`, '--drift': `${h.drift}px` } as CSSProperties}
          >
            <Heart className="h-3.5 w-3.5 text-fuchsia-400" fill="currentColor" />
          </div>
        </div>
      ))}

      {CHIPS.map((c) => (
        <div
          key={c.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
        >
          <div className={`animate-float ${CHIP_CLASS}`} style={{ animationDelay: `${c.delay}s` }}>
            <c.icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${c.tone}`} />
            {c.label}
          </div>
        </div>
      ))}

      <OrdersTicker />
    </div>
  )
}
