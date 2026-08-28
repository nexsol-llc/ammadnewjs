import type { Metadata } from 'next'
import { AlertTriangle, ArrowRight, Check, Clock, FileText, ShieldCheck, X } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { AuditForm } from '@/components/forms/AuditForm'
import { StatsBand } from '@/components/sections/StatsBand'
import { ReviewsSection } from '@/components/sections/ReviewsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import {
  auditBottlenecks,
  auditDeliverables,
  auditFaqs,
  auditFor,
  auditHero,
  auditSteps,
} from '@/lib/audit'
import { getReviews } from '@/lib/cms'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Free Affiliate Program Audit',
  description:
    'A free, no-obligation audit of your existing affiliate program. I find where revenue is leaking — dormant partners, commission cannibalisation, broken tracking — and give you a prioritised 90-day fix list.',
}

export default async function FreeAuditPage() {
  const reviews = await getReviews({ featuredOnly: true, limit: 3 })

  return (
    <>
      {/* ── Hero: hook + form ─────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="mesh-bg absolute inset-0" />
        <div className="grid-fade absolute inset-0" />

        <div className="container-x relative">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="pill">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-500 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint-500" />
                  </span>
                  {auditHero.badge}
                </span>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="heading mt-6 text-[2.5rem] leading-[1.06] sm:text-5xl lg:text-[3.6rem]">
                  {auditHero.headline}{' '}
                  <span className="text-gradient">{auditHero.headlineAccent}</span>
                  <span className="block">{auditHero.headlineTail}</span>
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
                  {auditHero.sub}
                </p>
              </Reveal>

              <Stagger className="mt-8 space-y-3" delay={0.2} gap={0.07}>
                {auditHero.bullets.map((b) => (
                  <StaggerItem key={b}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-50">
                        <Check className="h-3 w-3 text-mint-500" />
                      </span>
                      <span className="text-sm text-ink-700 sm:text-[0.95rem]">{b}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.45}>
                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-7">
                  <div>
                    <p className="heading text-xl">$350K+</p>
                    <p className="text-xs text-ink-400">Partner revenue tracked</p>
                  </div>
                  <div>
                    <p className="heading text-xl">15+</p>
                    <p className="text-xs text-ink-400">Programs audited & scaled</p>
                  </div>
                  <div>
                    <p className="heading text-xl">5 days</p>
                    <p className="text-xs text-ink-400">Turnaround</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form — visible immediately beside the hook */}
            <Reveal delay={0.12} y={20}>
              <div className="lg:sticky lg:top-28">
                <div className="mb-4 text-center lg:text-left">
                  <h2 className="heading text-2xl">{auditHero.formTitle}</h2>
                  <p className="mt-1.5 text-sm text-ink-500">{auditHero.formSub}</p>
                </div>
                <AuditForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Bottlenecks ───────────────────────────────── */}
      <section className="section-alt relative py-24 md:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="What I look for"
            title={
              <>
                Six places programs <span className="text-gradient">lose money</span>
              </>
            }
            subtitle="Nearly every underperforming program I open up is losing revenue to some combination of these. The audit tells you which ones are yours, and what each is costing."
          />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {auditBottlenecks.map((b) => (
              <StaggerItem key={b.n} className="h-full">
                <div className="card card-hover group h-full p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-transform duration-300 group-hover:scale-110">
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </span>
                    <span className="heading text-sm text-ink-300">{b.n}</span>
                  </div>
                  <h3 className="heading mt-5 text-lg">{b.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{b.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── What you get ──────────────────────────────── */}
      <section className="relative py-24 md:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="What you get"
            title={
              <>
                A real report — <span className="text-gradient">not a sales deck</span>
              </>
            }
            subtitle="Delivered as a written breakdown plus a recorded walkthrough, so you can share it with your team. Yours to keep either way."
          />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {auditDeliverables.map((d) => (
              <StaggerItem key={d.title} className="h-full">
                <div className="card card-hover group h-full p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110">
                    <FileText className="h-5 w-5" />
                  </span>
                  <h3 className="heading mt-5 text-lg">{d.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{d.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <StatsBand />

      {/* ── How it works ──────────────────────────────── */}
      <section className="relative py-24 md:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Three steps, <span className="text-gradient">five working days</span>
              </>
            }
          />
          <Stagger className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3" gap={0.1}>
            {auditSteps.map((s) => (
              <StaggerItem key={s.n} className="h-full">
                <div className="card h-full p-7">
                  <span className="heading inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-brand-400 to-brand-600 text-sm text-white">
                    {s.n}
                  </span>
                  <h3 className="heading mt-5 text-lg">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-7 gap-y-3 rounded-2xl border border-line bg-surface-2 px-6 py-5 text-sm text-ink-500">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-500" /> 5 working days
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-500" /> NDA on request
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-500" /> No cost, no obligation
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Who it is for ─────────────────────────────── */}
      <section className="section-alt relative py-24 md:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Honest filter"
            title={
              <>
                Is this <span className="text-gradient">worth your time?</span>
              </>
            }
            subtitle="I would rather tell you now than waste a week of both our time."
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal>
              <div className="card h-full p-8">
                <h3 className="heading flex items-center gap-2.5 text-lg">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint-50">
                    <Check className="h-4 w-4 text-mint-500" />
                  </span>
                  A good fit if…
                </h3>
                <ul className="mt-5 space-y-3">
                  {auditFor.yes.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card h-full p-8">
                <h3 className="heading flex items-center gap-2.5 text-lg">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
                    <X className="h-4 w-4 text-red-500" />
                  </span>
                  Probably not if…
                </h3>
                <ul className="mt-5 space-y-3">
                  {auditFor.no.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-ink-400">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} showAllLink alt={false} />

      <FAQSection faqs={auditFaqs} eyebrow="Audit FAQ" />

      {/* ── Closing CTA with the form again ───────────── */}
      <section className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
        <div className="mesh-dark absolute inset-0" />
        <div className="container-x relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <span className="pill-dark">Last thing</span>
              <h2 className="heading mt-6 text-3xl leading-[1.1] text-white sm:text-4xl">
                Every month you wait, the leak{' '}
                <span className="bg-gradient-to-r from-brand-300 to-fuchsia-400 bg-clip-text text-transparent">
                  keeps costing you.
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-base text-white/60">
                The audit costs nothing and takes three minutes to request. Worst case, you learn
                your program is healthier than you thought and you keep the action plan anyway.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
                {[
                  ['Free', 'No cost, no obligation'],
                  ['5 days', 'From data to report'],
                  ['Yours', 'Keep the plan regardless'],
                ].map(([big, small]) => (
                  <div key={big}>
                    <p className="heading text-xl text-white">{big}</p>
                    <p className="text-xs text-white/45">{small}</p>
                  </div>
                ))}
              </div>
              <a
                href="#top"
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200 lg:hidden"
              >
                Back to the form <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="hidden lg:block">
              <AuditForm compact />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
