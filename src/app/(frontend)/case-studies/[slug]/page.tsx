import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Globe, TrendingUp } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CaseStudyCard } from '@/components/cards/CaseStudyCard'
import { VideoPlayer } from '@/components/media/VideoPlayer'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { getCaseStudies, getCaseStudyBySlug } from '@/lib/cms'

export const revalidate = 120
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const studies = await getCaseStudies()
  return studies.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudyBySlug(slug)
  if (!study) return { title: 'Case Study' }
  return {
    title: study.title,
    description: study.overview?.slice(0, 155) || `${study.client} case study.`,
    openGraph: study.thumbnail?.url
      ? { images: [{ url: study.thumbnail.cardUrl || study.thumbnail.url }] }
      : undefined,
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const study = await getCaseStudyBySlug(slug)
  if (!study) notFound()

  const related = (await getCaseStudies({ type: study.type, limit: 4 }))
    .filter((s) => s.id !== study.id)
    .slice(0, 3)

  const isInfluencer = study.type === 'influencer'
  const meta = isInfluencer
    ? [
        { label: 'Creator', value: study.influencer?.handle },
        { label: 'Platform', value: study.influencer?.platform },
        { label: 'Followers', value: study.influencer?.followers },
        { label: 'Brand Partner', value: study.influencer?.brandPartner },
      ]
    : [
        { label: 'Client', value: study.client },
        { label: 'Industry', value: study.industry },
        { label: 'Network', value: study.network },
        { label: 'Duration', value: study.duration },
      ]

  const sections = [
    { label: 'Overview', text: study.overview },
    { label: 'The Problem', text: study.problem },
    { label: 'The Solution', text: study.solution },
    { label: 'The Outcome', text: study.outcome },
  ].filter((s): s is { label: string; text: string } => Boolean(s.text))

  return (
    <>
      <article>
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-14 md:pt-40">
          <div className="mesh-bg absolute inset-0" />
          <div className="grid-fade absolute inset-0" />
          <div className="container-x relative">
            <Reveal>
              <Link
                href={isInfluencer ? '/case-studies/influencer-marketing' : '/case-studies/affiliate-marketing'}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-brand-600"
              >
                <ArrowLeft className="h-4 w-4" />
                {isInfluencer ? 'Influencer case studies' : 'Affiliate case studies'}
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                <span
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white ${
                    isInfluencer ? 'bg-fuchsia-500' : 'bg-brand-500'
                  }`}
                >
                  {isInfluencer ? 'Influencer Marketing' : 'Affiliate Marketing'}
                </span>
                {study.category && (
                  <Link
                    href={`/case-studies/category/${study.category.slug}`}
                    className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-600"
                  >
                    {study.category.name}
                  </Link>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <h1 className="heading mt-6 max-w-4xl text-3xl leading-[1.12] sm:text-4xl md:text-5xl">
                {study.title}
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="card mt-10 grid grid-cols-2 gap-x-6 gap-y-5 p-7 md:grid-cols-4">
                {meta
                  .filter((m) => m.value)
                  .map((m) => (
                    <div key={m.label}>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                        {m.label}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold capitalize text-ink-950">{m.value}</p>
                    </div>
                  ))}
                {isInfluencer && study.influencer?.brandUrl && (
                  <a
                    href={study.influencer.brandUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 md:col-span-4"
                  >
                    <Globe className="h-4 w-4" /> Visit brand website
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Metrics ──────────────────────────────────── */}
        {study.metrics.length > 0 && (
          <section className="border-y border-line bg-white py-12">
            <div className="container-x">
              <Stagger className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6" gap={0.06}>
                {study.metrics.slice(0, 6).map((m) => (
                  <StaggerItem key={m.label} className="text-center">
                    <p className="heading text-xl sm:text-2xl">{m.value}</p>
                    <p className="mt-1 text-[0.68rem] uppercase tracking-wider text-ink-400">
                      {m.label}
                    </p>
                    {m.change && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-mint-500">
                        <TrendingUp className="h-3 w-3" /> {m.change}
                      </p>
                    )}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        )}

        {/* ── Hero image ───────────────────────────────── */}
        {study.heroImage?.url && (
          <section className="container-x pt-16">
            <Reveal>
              <div className="card overflow-hidden p-0">
                <Image
                  src={study.heroImage.heroUrl || study.heroImage.url}
                  alt={study.heroImage.alt || study.title}
                  width={study.heroImage.width || 1600}
                  height={study.heroImage.height || 900}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          </section>
        )}

        {/* ── Narrative ────────────────────────────────── */}
        {sections.length > 0 && (
          <section className="container-x py-16 md:py-24">
            <div className="mx-auto max-w-3xl space-y-12">
              {sections.map((s, i) => (
                <Reveal key={s.label}>
                  <div className="border-l-2 border-brand-200 pl-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                      {String(i + 1).padStart(2, '0')} · {s.label}
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-ink-700 md:text-lg">{s.text}</p>
                  </div>
                </Reveal>
              ))}

              {study.outcomes.length > 0 && (
                <Reveal>
                  <div className="card bg-surface-2 p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                      Campaign results
                    </p>
                    <ul className="mt-5 space-y-3.5">
                      {study.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-3 text-sm leading-relaxed text-ink-700 md:text-base">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-500" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* ── Results screenshot ───────────────────────── */}
        {study.resultsImage?.url && (
          <section className="container-x pb-16">
            <Reveal>
              <div className="card overflow-hidden p-0">
                <Image
                  src={study.resultsImage.heroUrl || study.resultsImage.url}
                  alt={study.resultsImage.alt || `${study.title} — results`}
                  width={study.resultsImage.width || 1600}
                  height={study.resultsImage.height || 900}
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          </section>
        )}

        {/* ── Campaign videos ──────────────────────────── */}
        {study.videos.length > 0 && (
          <section className="section-alt py-16 md:py-24">
            <div className="container-x">
              <SectionHeading
                eyebrow="Campaign content"
                title={
                  <>
                    Watch the <span className="text-gradient">creative in action</span>
                  </>
                }
              />
              <Stagger
                className={`grid gap-6 ${
                  study.videos.length === 1
                    ? 'mx-auto max-w-sm'
                    : study.videos.length === 2
                      ? 'mx-auto max-w-3xl sm:grid-cols-2'
                      : 'sm:grid-cols-2 lg:grid-cols-3'
                }`}
                gap={0.1}
              >
                {study.videos.map((v, i) => (
                  <StaggerItem key={i}>
                    <div>
                      <VideoPlayer video={v} className="aspect-[9/16]" />
                      {v.caption && (
                        <p className="mt-3 text-center text-sm text-ink-400">{v.caption}</p>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        )}

        {/* ── Related ──────────────────────────────────── */}
        {related.length > 0 && (
          <section className="container-x py-16 md:py-24">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="heading text-2xl sm:text-3xl">
                More {isInfluencer ? 'influencer' : 'affiliate'} wins
              </h2>
              <Link
                href="/case-studies"
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex"
              >
                View all <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.1}>
              {related.map((s) => (
                <StaggerItem key={s.id} className="h-full">
                  <CaseStudyCard study={s} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </article>

      <FinalCTA />
    </>
  )
}
