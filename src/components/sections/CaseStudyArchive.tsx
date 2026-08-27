import Link from 'next/link'
import { GlowOrbs } from '@/components/fx/GlowOrbs'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { CaseStudyCard } from '@/components/cards/CaseStudyCard'
import type { CaseStudyItem, CategoryInfo } from '@/lib/cms'

type Props = {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  studies: CaseStudyItem[]
  categories?: CategoryInfo[]
  activeCategorySlug?: string
  activeType?: 'affiliate' | 'influencer' | 'all'
  basePath?: string
}

export function CaseStudyArchive({
  eyebrow,
  title,
  subtitle,
  studies,
  categories = [],
  activeCategorySlug,
  activeType = 'all',
}: Props) {
  const typeTabs = [
    { label: 'All', href: '/case-studies', value: 'all' },
    { label: 'Affiliate Marketing', href: '/case-studies/affiliate-marketing', value: 'affiliate' },
    { label: 'Influencer Marketing', href: '/case-studies/influencer-marketing', value: 'influencer' },
  ]

  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <GlowOrbs variant="hero" />
      <div className="grid-bg absolute inset-0" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-400">
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl">
              {title}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.2}>
              <p className="mt-6 text-base text-zinc-400 sm:text-lg">{subtitle}</p>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.25}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {typeTabs.map((t) => (
              <Link
                key={t.value}
                href={t.href}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeType === t.value && !activeCategorySlug
                    ? 'bg-gradient-to-r from-accent-500 to-violet-500 text-white shadow-[0_0_22px_rgba(34,211,238,0.3)]'
                    : 'glass text-zinc-400 hover:text-white'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </Reveal>

        {categories.length > 0 && (
          <Reveal delay={0.3}>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/case-studies/category/${c.slug}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                    activeCategorySlug === c.slug
                      ? 'border border-accent-500/50 bg-accent-500/15 text-accent-400'
                      : 'border border-white/10 text-zinc-500 hover:border-white/25 hover:text-zinc-200'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {studies.length ? (
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.09}>
            {studies.map((s) => (
              <StaggerItem key={s.id} className="h-full">
                <CaseStudyCard study={s} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal delay={0.3}>
            <div className="card-surface mx-auto mt-14 max-w-md p-10 text-center">
              <p className="font-display text-lg font-semibold text-white">Nothing here yet</p>
              <p className="mt-2 text-sm text-zinc-400">
                Case studies for this selection are on their way — check the other categories in the
                meantime.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
