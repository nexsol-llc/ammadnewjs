import { MailCheck } from 'lucide-react'
import { CHIP_CLASS } from '@/components/fx/chip'

/**
 * Creator outreach, as a moving diagram: a pipeline that narrows from a long
 * sourced list down to signed creators, with candidates moving between stages.
 *
 * Same 5:4 stage and 400×320 connector space as the other services
 * illustrations. Motion is pure CSS, so this stays a server component.
 */

const STAGES = [
  { label: 'Sourced', count: '240', y: 16, w: 84, delay: 0 },
  { label: 'Contacted', count: '96', y: 37, w: 68, delay: 1.2 },
  { label: 'Replied', count: '34', y: 58, w: 52, delay: 2.4 },
  { label: 'Onboarded', count: '12', y: 79, w: 38, delay: 3.6 },
]

/* The drop between one stage and the next. */
const LINKS = [
  { d: 'M 200 73 L 200 96', delay: 0 },
  { d: 'M 200 140 L 200 164', delay: 0.5 },
  { d: 'M 200 208 L 200 231', delay: 1 },
]

export function OutreachFlow() {
  return (
    <div aria-hidden className="relative aspect-[5/4] w-full select-none">
      <svg viewBox="0 0 400 320" fill="none" className="absolute inset-0 h-full w-full">
        {LINKS.map((l) => (
          <g key={l.d}>
            <path d={l.d} stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
            <path
              d={l.d}
              className="animate-flow-tight"
              stroke="var(--color-brand-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="3 7"
              style={{ animationDelay: `${l.delay}s` }}
            />
          </g>
        ))}
      </svg>

      {STAGES.map((s) => (
        <div
          key={s.label}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${s.y}%`, width: `${s.w}%` }}
        >
          <div
            className="animate-row-glow flex items-center justify-between gap-2 rounded-full border border-line bg-white px-3 py-2 shadow-[0_10px_24px_-16px_rgba(16,16,40,0.5)]"
            style={{ animationDelay: `${s.delay}s` }}
          >
            <span className="flex items-center gap-1.5">
              <span className="flex -space-x-1">
                {['from-brand-400 to-brand-600', 'from-fuchsia-400 to-fuchsia-600'].map((g) => (
                  <span
                    key={g}
                    className={`h-2.5 w-2.5 rounded-full border border-white bg-gradient-to-br sm:h-3 sm:w-3 ${g}`}
                  />
                ))}
              </span>
              <span className="text-[0.58rem] font-semibold text-ink-700 sm:text-[0.66rem]">
                {s.label}
              </span>
            </span>
            <span className="text-[0.58rem] font-bold tabular-nums text-brand-600 sm:text-[0.66rem]">
              {s.count}
            </span>
          </div>
        </div>
      ))}

      {/* The moment the pipeline pays off. Anchored to the right edge rather
          than centred, so it can never overflow the stage on a narrow screen,
          and sat below the funnel where nothing else lives. */}
      <div className="absolute right-[3%] top-[93%] -translate-y-1/2">
        <div className={`animate-badge ${CHIP_CLASS}`}>
          <MailCheck className="h-3 w-3 text-mint-600 sm:h-3.5 sm:w-3.5" />
          Reply received
        </div>
      </div>
    </div>
  )
}
