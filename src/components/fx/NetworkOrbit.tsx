'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { networks } from '@/lib/site'

/**
 * Circular network slider: two counter-rotating rings of network chips.
 * Each chip counter-spins so its label stays upright, and one network is
 * highlighted at a time in the centre.
 */
export function NetworkOrbit() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)

  const outer = networks.slice(0, 8)
  const inner = networks.slice(8)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setActive((v) => (v + 1) % networks.length), 2200)
    return () => clearInterval(id)
  }, [reduce])

  const current = networks[active]

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
      {/* Ring guides */}
      <div className="absolute inset-0 rounded-full border border-line" />
      <div className="absolute inset-[13%] rounded-full border border-line" />
      <div className="absolute inset-[26%] rounded-full border border-dashed border-line-strong" />

      {/* Soft glow behind the core */}
      <div className="absolute inset-[22%] rounded-full bg-brand-500/10 blur-3xl" />

      {/* Outer ring */}
      <Ring items={outer} radius={46} spin="animate-orbit" reduce={Boolean(reduce)} activeName={current.name} />
      {/* Inner ring, opposite direction */}
      <Ring
        items={inner}
        radius={34}
        spin="animate-orbit-rev"
        reduce={Boolean(reduce)}
        activeName={current.name}
        small
      />

      {/* Centre core */}
      <div className="absolute inset-[30%] flex items-center justify-center">
        <div className="card relative flex h-full w-full flex-col items-center justify-center rounded-full text-center shadow-[0_20px_60px_-20px_rgba(91,51,245,0.45)]">
          <span
            className="absolute inset-0 animate-pulse-ring rounded-full border-2"
            style={{ borderColor: current.color }}
            aria-hidden
          />
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink-400">
            Now managing
          </p>
          <motion.p
            key={current.name}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="heading mt-1 px-4 text-base leading-tight sm:text-lg"
          >
            {current.name}
          </motion.p>
          <span
            className="mt-2 h-1.5 w-8 rounded-full"
            style={{ background: current.color }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

function Ring({
  items,
  radius,
  spin,
  reduce,
  activeName,
  small,
}: {
  items: { name: string; color: string }[]
  radius: number
  spin: string
  reduce: boolean
  activeName: string
  small?: boolean
}) {
  const counterSpin = spin === 'animate-orbit' ? 'animate-orbit-rev' : 'animate-orbit'
  return (
    <div className={`absolute inset-0 ${reduce ? '' : spin}`}>
      {items.map((n, i) => {
        const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2
        const x = 50 + radius * Math.cos(angle)
        const y = 50 + radius * Math.sin(angle)
        const isActive = n.name === activeName
        return (
          <div
            key={n.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {/* counter-rotate so the label stays upright */}
            <div className={reduce ? '' : counterSpin}>
              <div
                className={`flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1.5 shadow-[0_4px_14px_-6px_rgba(16,16,40,0.25)] transition-all duration-500 ${
                  small ? 'text-[0.62rem]' : 'text-[0.7rem]'
                } ${isActive ? 'scale-110 border-brand-300 shadow-[0_8px_22px_-8px_rgba(91,51,245,0.5)]' : 'border-line'}`}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: n.color, opacity: isActive ? 1 : 0.55 }}
                />
                <span
                  className={`whitespace-nowrap font-semibold ${isActive ? 'text-ink-950' : 'text-ink-500'}`}
                >
                  {n.name}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
