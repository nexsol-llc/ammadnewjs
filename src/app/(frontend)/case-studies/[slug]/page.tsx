import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Globe, TrendingUp, Users } from 'lucide-react'
import { GlowOrbs } from '@/components/fx/GlowOrbs'
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

const narrative = (study: NonNullable<Awaited<ReturnType<typeof getCaseStudyBySlug>>>) =>
  [
    { label: 'Overview', text: study.overview },
    { label: 'The Problem', text: study.problem },
    { label: 'The Solution', text: study.solution },
    { label: 'The Outcome', text: study.outcome },
  ].filter((s): s is { label: string; text: string } => Boolean(s.text))

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

  const sections = narrative(study)

  return (
    <>
      <article>
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-14 md:pt-40">
          <GlowOrbs variant="hero" />
          <div className="grid-bg absolute inset-0" />
          <div className="container-x relative">
            <Reveal>
              <Link
                href={isInfluencer ? '/case-studies/influencer-marketing' : '/case-studies/affiliate-marketing'}
                className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {isInfluencer ? 'Influencer case studies' : 'Affiliate case studies'}
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                    isInfluencer
                      ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                      : 'bg-accent-500/15 text-accent-400 border border-accent-500/30'
                  }`}
                >
                  {isInfluencer ? 'Influencer Marketing' : 'Affiliate Marketing'}
                </span>
                {study.category && (
                  <Link
                    href={`/case-studies/category/${study.category.slug}`}
                    className="glass rounded-full px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:text-white"
                  >
                    {study.category.name}
                  </Link>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <h1 className="font-display mt-6 max-w-4xl text-3xl font-bold leading-[1.12] sm:text-4xl md:text-5xl">
                <span className="text-gradient-white">{study.title}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="card-surface mt-10 grid grid-cols-2 gap-x-6 gap-y-5 p-7 md:grid-cols-4">
                {meta
                  .filter((m) => m.value)
                  .map((m) => (
                    <div key={m.label}>
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                        {m.label}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold capitalize text-white">{m.value}</p>
                    </div>
                  ))}
                {isInfluencer && study.influencer?.brandUrl && (
                  <a
                    href={study.influencer.brandUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-400 md:col-span-4"
                  >
                    <Globe className="h-4 w-4" /> Visit brand website{' '}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Metrics ──────────────────────────────────── */}
        {study.metrics.length > 0 && (
          <section className="relative border-y border-white/6 bg-gradient-to-r from-accent-500/5 via-transparent to-violet-500/5 py-12">
            <div className="container-x">
              <Stagger
                className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"
                gap={0.07}
              >
                {study.metrics.slice(0, 6).map((m) => (
                  <StaggerItem key={m.label} className="text-center">
                    <p className="font-display text-xl font-bold text-white sm:text-2xl">{m.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500">{m.label}</p>
                    {m.change && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
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
              <div className="card-surface overflow-hidden">
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
            <div className="mx-auto max-w-3xl space-y-14">
              {sections.map((s, i) => (
                <Reveal key={s.label}>
                  <div className="relative pl-6 md:pl-0">
                    <div className="absolute left-0 top-1 h-full w-px bg-gradient-to-b from-accent-400/60 to-transparent md:-left-8" />
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-400">
                      {String(i + 1).padStart(2, '0')} · {s.label}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-zinc-300 md:text-lg">{s.text}</p>
                  </div>
                </Reveal>
              ))}

              {study.outcomes.length > 0 && (
                <Reveal>
                  <div className="card-surface p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-400">
                      Campaign results
                    </p>
                    <ul className="mt-5 space-y-3.5">
                      {study.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300 md:text-base">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
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
              <div className="card-surface overflow-hidden">
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
          <section className="relative py-16 md:py-24">
            <GlowOrbs variant="section" />
            <div className="container-x relative">
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
                    ? 'mx-auto max-w-2xl'
                    : study.videos.length === 2
                      ? 'mx-auto max-w-4xl sm:grid-cols-2'
                      : 'sm:grid-cols-2 lg:grid-cols-3'
                }`}
                gap={0.1}
              >
                {study.videos.map((v, i) => (
                  <StaggerItem key={i}>
                    <div>
                      <VideoPlayer video={v} className="aspect-[9/16]" />
                      {v.caption && <p className="mt-3 text-center text-sm text-zinc-500">{v.caption}</p>}
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
              <h2 className="font-display text-2xl font-semibold text-gradient-white sm:text-3xl">
                More {isInfluencer ? 'influencer' : 'affiliate'} wins
              </h2>
              <Link
                href="/case-studies"
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-400 hover:text-accent-500 sm:inline-flex"
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
