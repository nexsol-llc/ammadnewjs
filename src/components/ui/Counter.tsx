'use client'

import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

type Props = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

/** Animated count-up that starts when scrolled into view. */
export function Counter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    if (reduce) {
      el.textContent = `${prefix}${value.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}${suffix}`
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 0.8, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${v.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, prefix, suffix, decimals, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
