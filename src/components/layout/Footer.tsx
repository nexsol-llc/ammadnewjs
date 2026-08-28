import Link from 'next/link'
import { ArrowRight, Linkedin, Mail, MessageCircle } from 'lucide-react'
import { nav, site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="container-x py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="heading text-xl tracking-tight">
              M<span className="text-brand-500">.</span>AMMAD
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              Affiliate & influencer marketing for e-commerce and SaaS brands. Partnerships that
              compound — built, managed, and scaled for you.
            </p>
            <a
              href={site.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-6 !px-5 !py-2.5 text-sm"
            >
              Book a free growth call
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-ink-500 transition-colors hover:text-brand-600">
                  Home
                </Link>
              </li>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/free-audit"
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Claim Free Audit
                </Link>
              </li>
              <li>
                <Link
                  href="/#revenue-calculator"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Revenue Calculator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2.5 text-sm text-ink-500 transition-colors hover:text-brand-600"
                >
                  <Mail className="h-4 w-4 text-brand-500" /> {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-ink-500 transition-colors hover:text-brand-600"
                >
                  <MessageCircle className="h-4 w-4 text-brand-500" /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-ink-500 transition-colors hover:text-brand-600"
                >
                  <Linkedin className="h-4 w-4 text-brand-500" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-8 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>
            Partnerships that compound.{' '}
            <span className="font-semibold text-brand-600">Own your growth.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
