'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { NetworkInfo } from '@/lib/cms'

/**
 * Circular network slider: two counter-rotating rings of name chips around a
 * centre that showcases each network's logo in turn.
 *
 * Each chip counter-spins at exactly its ring's duration so labels stay upright.
 */
export function NetworkOrbit({ networks }: { networks: NetworkInfo[] }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)

  const split = Math.ceil(networks.length * 0.62)
  const outer = networks.slice(0, split)
  const inner = networks.slice(split)

  useEffect(() => {
    if (reduce || networks.length < 2) return
    const id = setInterval(() => setActive((v) => (v + 1) % networks.length), 2400)
    return () => clearInterval(id)
  }, [reduce, networks.length])

  if (!networks.length) return null
  const current = networks[active % networks.length]

  /* Chips are centred on the outer ring, so half of each one sits outside it.
     On a phone that pushed them past the screen edge — narrowing the orbit
     leaves the margin they need without shrinking the labels. */
  return (
    <div className="relative mx-auto aspect-square w-[76%] max-w-[30rem] sm:w-full">
      {/* Ring guides */}
      <div className="absolute inset-0 rounded-full border border-line" />
      <div className="absolute inset-[13%] rounded-full border border-line" />
      <div className="absolute inset-[26%] rounded-full border border-dashed border-line-strong" />
      <div className="absolute inset-[22%] rounded-full bg-brand-500/10 blur-3xl" />

      <Ring
        items={outer}
        radius={46}
        spin="animate-orbit-outer"
        counterSpin="animate-orbit-outer-rev"
        reduce={Boolean(reduce)}
        activeName={current.name}
      />
      <Ring
        items={inner}
        radius={34}
        spin="animate-orbit-inner"
        counterSpin="animate-orbit-inner-rev"
        reduce={Boolean(reduce)}
        activeName={current.name}
        small
      />

      {/* Centre — the logo showcase */}
      <div className="absolute inset-[30%] flex items-center justify-center">
        <div className="card relative flex h-full w-full items-center justify-center rounded-full px-5 text-center shadow-[0_20px_60px_-20px_rgba(91,51,245,0.45)]">
          <span
            className="absolute inset-0 animate-pulse-ring rounded-full border-2"
            style={{ borderColor: current.color }}
            aria-hidden
          />
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
            className="flex w-full items-center justify-center px-2"
          >
            {current.logo?.url ? (
              <Image
                src={current.logo.url}
                alt={current.name}
                width={320}
                height={120}
                priority
                className="h-auto max-h-[3.4rem] w-auto max-w-[9.5rem] object-contain sm:max-h-[4.2rem] sm:max-w-[11rem]"
                unoptimized={current.logo.mimeType === 'image/svg+xml'}
              />
            ) : (
              // Until the official logo is uploaded, show the name as a wordmark.
              <span
                className="heading text-center text-xl leading-tight sm:text-2xl"
                style={{ color: current.color }}
              >
                {current.name}
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Ring({
  items,
  radius,
  spin,
  counterSpin,
  reduce,
  activeName,
  small,
}: {
  items: NetworkInfo[]
  radius: number
  spin: string
  counterSpin: string
  reduce: boolean
  activeName: string
  small?: boolean
}) {
  if (!items.length) return null
  return (
    <div className={`absolute inset-0 ${reduce ? '' : spin}`}>
      {items.map((n, i) => {
        const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2
        const x = 50 + radius * Math.cos(angle)
        const y = 50 + radius * Math.sin(angle)
        const isActive = n.name === activeName
        return (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {/* Cancels the ring's rotation so the label stays upright. */}
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
