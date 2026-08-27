import Link from 'next/link'
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
      <div className="mesh-bg absolute inset-0 h-[36rem]" />
      <div className="grid-fade absolute inset-0 h-[36rem]" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="pill">{eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="heading mt-6 text-4xl leading-[1.08] sm:text-5xl md:text-6xl">{title}</h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.16}>
              <p className="mt-6 text-base text-ink-500 sm:text-lg">{subtitle}</p>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.22}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {typeTabs.map((t) => {
              const isActive = activeType === t.value && !activeCategorySlug
              return (
                <Link
                  key={t.value}
                  href={t.href}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-b from-brand-400 to-brand-600 text-white shadow-[0_8px_20px_-8px_rgba(91,51,245,0.6)]'
                      : 'border border-line-strong bg-white text-ink-500 hover:border-brand-300 hover:text-ink-950'
                  }`}
                >
                  {t.label}
                </Link>
              )
            })}
          </div>
        </Reveal>

        {categories.length > 0 && (
          <Reveal delay={0.28}>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/case-studies/category/${c.slug}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                    activeCategorySlug === c.slug
                      ? 'border border-brand-300 bg-brand-50 text-brand-700'
                      : 'border border-line text-ink-400 hover:border-ink-300 hover:text-ink-700'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {studies.length ? (
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {studies.map((s) => (
              <StaggerItem key={s.id} className="h-full">
                <CaseStudyCard study={s} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal delay={0.3}>
            <div className="card mx-auto mt-14 max-w-md p-10 text-center">
              <p className="heading text-lg">Nothing here yet</p>
              <p className="mt-2 text-sm text-ink-500">
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
