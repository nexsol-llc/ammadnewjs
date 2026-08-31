'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, ClipboardCheck, PhoneCall } from 'lucide-react'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

/**
 * App-style action bar pinned to the bottom on phones and tablets — the same
 * floating capsule treatment as the header, mirrored. It carries the three
 * CTAs the header can only show from lg up, so they stay one thumb-reach away
 * on every page. Hidden at lg, where the header shows them itself.
 *
 * The highlight marks where the visitor actually is, not which item we would
 * rather they pressed: the audit page when they are on it, and the calculator
 * while that section holds the screen. Book a Call leaves the site, so it never
 * highlights, and on every other page nothing is marked.
 */
const ITEMS = [
  { key: 'audit', label: 'Free Audit', href: '/free-audit', icon: ClipboardCheck },
  { key: 'calc', label: 'Estimate Revenue', href: '/#revenue-calculator', icon: Calculator },
  { key: 'call', label: 'Book a Call', href: site.calendly, icon: PhoneCall, external: true },
] as const

export function BottomBar() {
  const pathname = usePathname()
  const [calcOnScreen, setCalcOnScreen] = useState(false)

  useEffect(() => {
    const section = document.getElementById('revenue-calculator')
    if (!section) {
      setCalcOnScreen(false)
      return
    }
    /* The negative margins mean it only counts once the section actually holds
       the middle of the screen, rather than the moment an edge appears. */
    const observer = new IntersectionObserver(
      ([entry]) => setCalcOnScreen(entry.isIntersecting),
      { rootMargin: '-35% 0px -35% 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [pathname])

  const activeKey = calcOnScreen ? 'calc' : pathname === '/free-audit' ? 'audit' : null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="container-x">
        <nav
          aria-label="Quick actions"
          className="grid grid-cols-3 overflow-hidden rounded-full border border-line-strong bg-white/85 shadow-[0_-6px_28px_-10px_rgba(16,16,40,0.22)] backdrop-blur-xl"
        >
          {ITEMS.map((item) => {
            const active = item.key === activeKey
            const inner = (
              <>
                <item.icon className="h-[1.15rem] w-[1.15rem]" />
                <span className="whitespace-nowrap text-[0.62rem] font-semibold leading-none min-[360px]:text-[0.68rem]">
                  {item.label}
                </span>
              </>
            )
            const className = `flex flex-col items-center justify-center gap-1.5 py-3 transition-colors ${
              active ? 'bg-brand-50 text-brand-600' : 'text-ink-500 active:bg-surface-3'
            }`
            return 'external' in item && item.external ? (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={className}
              >
                {inner}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
