'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import type { MouseEvent, ReactNode } from 'react'
import { useRef } from 'react'

type BtnProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'dark'
  className?: string
  external?: boolean
}

/** CTA link that leans slightly toward the cursor. */
export function MagneticButton({ href, children, variant = 'primary', className, external }: BtnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18 })
  const sy = useSpring(y, { stiffness: 220, damping: 18 })

  const onMove = (e: MouseEvent) => {
    if (!ref.current || reduce) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const variantCls =
    variant === 'primary' ? 'btn-primary' : variant === 'dark' ? 'btn-dark' : 'btn-ghost'
  const anchorProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="inline-block max-sm:w-full"
    >
      <Link
        href={href}
        {...anchorProps}
        className={`btn ${variantCls} group max-sm:w-full ${className || ''}`}
      >
        {children}
      </Link>
    </motion.div>
  )
}
