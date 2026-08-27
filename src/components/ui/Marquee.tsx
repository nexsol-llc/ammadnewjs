import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  slow?: boolean
  className?: string
}

/** Infinite horizontal marquee. Children are rendered twice for a seamless loop. */
export function Marquee({ children, slow, className }: Props) {
  return (
    <div
      className={`group relative overflow-hidden ${className || ''}`}
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div
        className={`flex w-max items-center gap-14 pr-14 ${slow ? 'animate-marquee-slow' : 'animate-marquee'} group-hover:[animation-play-state:paused]`}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
