import Link from 'next/link'
import { Linkedin, Mail, MessageCircle, ArrowUpRight } from 'lucide-react'
import { nav, site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-ink-900/40">
      <div className="glow-line absolute inset-x-0 top-0" />
      <div className="container-x py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-xl font-bold tracking-tight text-white">
              M<span className="text-gradient">.</span>AMMAD
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Affiliate & influencer marketing for e-commerce and SaaS brands. Partnerships that
              compound — built, managed, and scaled for you.
            </p>
            <a
              href={site.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-400 hover:text-accent-500"
            >
              Book a free growth call <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/case-studies/affiliate-marketing"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Affiliate Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies/influencer-marketing"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Influencer Case Studies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 text-accent-400" /> {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 text-accent-400" /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  <Linkedin className="h-4 w-4 text-accent-400" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-medium tracking-wide">
            Partnerships that compound. <span className="text-gradient font-semibold">Own your growth.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
