import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  slow?: boolean
  className?: string
  /** Space between items — Tailwind gap class. */
  gapClass?: string
}

/**
 * Infinite horizontal marquee.
 *
 * The children are rendered twice for a seamless loop. Each copy lives in its
 * own wrapper so keys stay unique per copy, and the duplicate is hidden from
 * assistive tech since it is purely visual.
 */
export function Marquee({ children, slow, className, gapClass = 'gap-14' }: Props) {
  const copy = `flex shrink-0 items-center ${gapClass} pr-14`
  return (
    <div
      className={`group relative overflow-hidden ${className || ''}`}
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div
        className={`flex w-max ${slow ? 'animate-marquee-slow' : 'animate-marquee'} group-hover:[animation-play-state:paused]`}
      >
        <div className={copy}>{children}</div>
        <div className={copy} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
