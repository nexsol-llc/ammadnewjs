import type { Metadata } from 'next'
import { ArrowUpRight, CalendarClock, Linkedin, Mail, MessageCircle } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from '@/components/forms/ContactForm'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch about affiliate program management or influencer marketing for your brand — or book a free 30-minute growth call directly.',
}

const channels = [
  {
    icon: CalendarClock,
    label: 'Book a free growth call',
    value: '30 minutes · no pitch, just strategy',
    href: site.calendly,
    highlight: true,
  },
  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: MessageCircle, label: 'WhatsApp', value: site.whatsappDisplay, href: site.whatsapp },
  { icon: Linkedin, label: 'LinkedIn', value: 'affiliate-manager-ammad', href: site.linkedin },
]

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="mesh-bg absolute inset-0 h-[34rem]" />
      <div className="grid-fade absolute inset-0 h-[34rem]" />
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="pill">Contact</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="heading mt-6 text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
              Let&apos;s talk about <span className="text-gradient">your growth</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-base text-ink-500 sm:text-lg">
              Tell me about your brand and I&apos;ll come back with an honest read on whether an
              affiliate or influencer channel fits — usually within 24 hours.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-3">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={0.1 + i * 0.06}>
                <a
                  href={c.href}
                  target={c.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 ${
                    c.highlight
                      ? 'border border-brand-200 bg-brand-50 hover:border-brand-400'
                      : 'card card-hover'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      c.highlight ? 'bg-white text-brand-600' : 'bg-surface-3 text-ink-700'
                    }`}
                  >
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink-950">{c.label}</span>
                    <span className="block truncate text-xs text-ink-500">{c.value}</span>
                  </span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-ink-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </a>
              </Reveal>
            ))}
            <Reveal delay={0.4}>
              <p className="px-2 pt-3 text-xs leading-relaxed text-ink-400">
                Prefer async? The form works great — every message lands directly in my inbox, not a
                shared team queue.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
