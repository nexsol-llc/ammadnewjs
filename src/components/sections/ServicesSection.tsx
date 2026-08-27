import Link from 'next/link'
import { ArrowRight, Check, Handshake, Megaphone, Search, Users } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { services } from '@/lib/site'

export function ServicesSection({ compact = false }: { compact?: boolean }) {
  const mains = [
    {
      ...services.affiliate,
      icon: Handshake,
      href: '/case-studies/affiliate-marketing',
      cta: 'See affiliate results',
    },
    {
      ...services.influencer,
      icon: Megaphone,
      href: '/case-studies/influencer-marketing',
      cta: 'See influencer results',
    },
  ]

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              One operator. <span className="text-gradient">Two compounding channels.</span>
            </>
          }
          subtitle="Both services follow the same principle: build a partner ecosystem your brand owns, then scale it into a channel that outperforms paid ads."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {mains.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="card card-hover group h-full p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="heading mt-6 text-2xl md:text-[1.7rem]">{s.title}</h3>
                <p className="mt-2 text-sm font-semibold text-brand-600">{s.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink-500 md:text-base">
                  {s.description}
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.href}
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {s.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {!compact && (
          <Stagger className="mt-6 grid gap-6 md:grid-cols-2" delay={0.1}>
            {services.extras.map((s, i) => {
              const Icon = i === 0 ? Users : Search
              return (
                <StaggerItem key={s.title}>
                  <div className="card card-hover flex h-full items-start gap-5 p-7">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-3 text-ink-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="heading text-lg">{s.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
      </div>
    </section>
  )
}
