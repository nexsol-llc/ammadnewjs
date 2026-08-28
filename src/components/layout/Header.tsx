'use client'

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
    const onScroll = () => setScrolled(window.scrollY > 20)
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
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-brand-500 to-fuchsia-500"
        style={{ scaleX: progress }}
      />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-line bg-white/85 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between md:h-[4.5rem]">
          <Link href="/" className="heading text-lg tracking-tight">
            M<span className="text-brand-500">.</span>AMMAD
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/#revenue-calculator" className="btn btn-ghost !px-5 !py-2.5 text-sm">
              Estimate Revenue
            </Link>
            <a
              href={site.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary !px-5 !py-2.5 text-sm"
            >
              Book a Call
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full border border-line bg-white p-2.5 text-ink-950 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-white/97 backdrop-blur-2xl md:hidden"
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
                className="mt-8 flex flex-col gap-3"
              >
                <Link href="/#revenue-calculator" className="btn btn-ghost">
                  Estimate Revenue
                </Link>
                <a
                  href={site.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Book a Free Growth Call
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
