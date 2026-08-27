'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import type { MouseEvent, ReactNode } from 'react'
import { useRef } from 'react'

type BtnProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
  external?: boolean
}

/** Magnetic CTA button — leans toward the cursor. */
export function MagneticButton({ href, children, variant = 'primary', className, external }: BtnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 16 })
  const sy = useSpring(y, { stiffness: 200, damping: 16 })

  const onMove = (e: MouseEvent) => {
    if (!ref.current || reduce) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const base =
    'group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-shadow duration-300'
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-accent-500 to-violet-500 text-white shadow-[0_0_28px_rgba(34,211,238,0.28)] hover:shadow-[0_0_44px_rgba(139,92,246,0.45)]'
      : 'glass text-zinc-100 hover:bg-white/10'

  const anchorProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }} className="inline-block">
      <Link href={href} {...anchorProps} className={`${base} ${styles} ${className || ''}`}>
        {children}
      </Link>
    </motion.div>
  )
}
