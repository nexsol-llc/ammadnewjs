'use client'

import { BadgeDollarSign } from 'lucide-react'
import { useState } from 'react'

/**
 * The commission badge in [AffiliateFlow] — a new sale every time the badge
 * comes back around, so the network reads as continuously earning.
 *
 * The amounts are a fixed list rather than generated, so the first paint matches
 * the server; the jump between them is randomised on the client. Swapping on
 * `animationiteration` means the number only ever changes at the exact moment
 * the badge is invisible, never mid-flight.
 */
const SALES = [
  '250',
  '375',
  '1,065',
  '499',
  '812',
  '2,340',
  '168',
  '640',
  '1,490',
  '305',
  '927',
  '1,875',
]

export function CommissionTicker() {
  const [i, setI] = useState(0)

  const nextSale = () => {
    // 1..n-1 so a sale never repeats back to back
    const step = 1 + Math.floor(Math.random() * (SALES.length - 1))
    setI((n) => (n + step) % SALES.length)
  }

  return (
    <div className="absolute left-1/2 top-[19%] -translate-x-1/2">
      <div
        onAnimationIteration={nextSale}
        className="animate-badge flex items-center gap-1.5 whitespace-nowrap rounded-full border border-mint-500/30 bg-mint-50 px-2 py-1 text-[0.65rem] font-bold text-mint-600 shadow-[0_8px_18px_-10px_rgba(4,120,87,0.6)] sm:px-2.5 sm:text-[0.75rem]"
      >
        <BadgeDollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="tabular-nums">+${SALES[i]}</span>
      </div>
    </div>
  )
}
