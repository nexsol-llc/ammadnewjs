'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { nav, site } from '@/lib/site'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-brand-500 to-fuchsia-500"
        style={{ scaleX: progress }}
      />

      {/* Floating capsule */}
      <header className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-5">
        <div className="container-x">
          <div
            className={`flex items-center justify-between gap-4 rounded-full border bg-white/85 pl-5 pr-2 backdrop-blur-xl transition-all duration-300 md:pl-7 ${
              scrolled
                ? 'border-line-strong shadow-[0_10px_34px_-10px_rgba(16,16,40,0.22)]'
                : 'border-line shadow-[0_6px_26px_-14px_rgba(16,16,40,0.18)]'
            }`}
          >
            <Link href="/" className="flex shrink-0 items-center gap-2.5 py-2">
              <Image
                src="/avatar.webp"
                alt=""
                width={80}
                height={80}
                priority
                className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-100"
              />
              <span className="heading text-lg tracking-tight">
                M<span className="text-brand-500">.</span>AMMAD
              </span>
            </Link>

            <nav className="hidden items-center gap-0.5 lg:flex">
              {nav.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors ${
                      active ? 'text-ink-950' : 'text-ink-500 hover:text-ink-950'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-surface-3"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right group — keeps the CTAs and menu button together at the edge */}
            <div className="flex shrink-0 items-center gap-1 py-2">
              <Link
                href="/#revenue-calculator"
                className="hidden rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-ink-500 transition-colors hover:text-ink-950 xl:block"
              >
                Estimate Revenue
              </Link>
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full border border-line-strong px-4 py-2 text-[0.92rem] font-semibold text-ink-950 transition-colors hover:border-brand-300 hover:bg-brand-50 lg:inline-flex"
              >
                Book a Call
              </a>
              <Link
                href="/free-audit"
                className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-400 to-brand-600 px-5 py-2.5 text-[0.92rem] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_8px_20px_-8px_rgba(91,51,245,0.65)] transition-shadow hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_12px_26px_-8px_rgba(91,51,245,0.8)] md:inline-flex"
              >
                Claim Free Audit
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={open}
                className="rounded-full bg-surface-3 p-2.5 text-ink-950 transition-colors hover:bg-surface-2 lg:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-white/97 backdrop-blur-2xl lg:hidden"
          >
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
              className="flex h-full flex-col items-center justify-center gap-1 px-8"
            >
              {nav.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                >
                  <Link href={item.href} className="heading block py-3 text-3xl">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
                className="mt-8 flex w-full max-w-xs flex-col gap-3"
              >
                <Link href="/free-audit" className="btn btn-primary w-full">
                  Claim Free Audit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={site.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost w-full"
                >
                  Book a Free Growth Call
                </a>
                <Link href="/#revenue-calculator" className="btn btn-ghost w-full">
                  Estimate Revenue
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
