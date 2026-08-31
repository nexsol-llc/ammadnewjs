'use client'

import { useReducedMotion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CHIP_CLASS } from './chip'

/**
 * The orders counter in [InfluencerFlow] — it keeps climbing while the visitor
 * is on the page, so the campaign reads as still selling rather than as a
 * finished number. Starts from a fixed value so the first paint matches the
 * server, and holds still for anyone who asked for reduced motion.
 */
const START = 312
const EVERY_MS = 3200

export function OrdersTicker() {
  const reduce = useReducedMotion()
  const [orders, setOrders] = useState(START)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setOrders((n) => n + 2 + Math.floor(Math.random() * 3)), EVERY_MS)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <div className="absolute left-[76%] top-[80%] -translate-x-1/2 -translate-y-1/2">
      <div className={`animate-float ${CHIP_CLASS}`} style={{ animationDelay: '3.1s' }}>
        <ShoppingBag className="h-3 w-3 text-mint-600 sm:h-3.5 sm:w-3.5" />
        {/* Remounting on each new order restarts the pop */}
        <span key={orders} className="animate-order-pop tabular-nums">
          +{orders} orders
        </span>
      </div>
    </div>
  )
}
