import Link from 'next/link'
import { ArrowRight, Check, Handshake, Megaphone, Search, Users } from 'lucide-react'
import { AffiliateFlow } from '@/components/fx/AffiliateFlow'
import { InfluencerFlow } from '@/components/fx/InfluencerFlow'
import { OutreachFlow } from '@/components/fx/OutreachFlow'
import { PartnershipFlow } from '@/components/fx/PartnershipFlow'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { services } from '@/lib/site'

export function ServicesSection({
  compact = false,
  tightTop = false,
}: {
  compact?: boolean
  /** Sits the section right under a hero/logo strip instead of a full section gap. */
  tightTop?: boolean
}) {
  /* Each service gets a row: the copy on one side, a moving diagram of how the
     service works on the other. Rows alternate, so every diagram sits under the
     copy of the service before it. */
  const rows = [
    {
      ...services.affiliate,
      icon: Handshake,
      href: '/case-studies/affiliate-marketing',
      cta: 'See affiliate results',
      art: AffiliateFlow,
      artFirst: false,
    },
    {
      ...services.influencer,
      icon: Megaphone,
      href: '/case-studies/influencer-marketing',
      cta: 'See influencer results',
      art: InfluencerFlow,
      artFirst: true,
    },
    {
      ...services.extras[0],
      icon: Users,
      href: '/case-studies/affiliate-marketing',
      cta: 'See managed programs',
      art: PartnershipFlow,
      artFirst: false,
    },
    {
      ...services.extras[1],
      icon: Search,
      href: '/case-studies/influencer-marketing',
      cta: 'See creator campaigns',
      art: OutreachFlow,
      artFirst: true,
    },
  ]
  const shown = compact ? rows.slice(0, 2) : rows

  return (
    <section
      className={`relative pb-16 md:pb-20 ${tightTop ? 'pt-12 md:pt-16' : 'pt-16 md:pt-20'}`}
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              Turn Partnerships Into a{' '}
              <span className="text-gradient">Predictable Growth Channel.</span>
            </>
          }
          subtitle="Every service follows the same principle: build a partner ecosystem your brand owns, then scale it into a channel that outperforms paid ads."
        />

        <div className="grid gap-6 lg:gap-8">
          {shown.map((s) => (
            <div key={s.title} className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <Reveal className={s.artFirst ? 'lg:order-2' : undefined}>
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

              <Reveal delay={0.12} className={s.artFirst ? 'lg:order-1' : undefined}>
                <div className="card relative flex h-full items-center justify-center overflow-hidden p-5 sm:p-8">
                  <div className="mesh-bg absolute inset-0" />
                  <div className="grid-fade absolute inset-0" />
                  <div className="relative w-full max-w-[30rem]">
                    <s.art />
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
