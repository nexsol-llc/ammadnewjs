import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, TrendingUp, Users } from 'lucide-react'
import type { CaseStudyItem } from '@/lib/cms'

export function CaseStudyCard({ study }: { study: CaseStudyItem }) {
  const img = study.thumbnail?.cardUrl || study.thumbnail?.url
  const metrics = study.metrics.slice(0, 3)
  const isInfluencer = study.type === 'influencer'

  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-3">
        {img ? (
          <Image
            src={img}
            alt={study.thumbnail?.alt || study.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-50 to-surface-3">
            <TrendingUp className="h-10 w-10 text-brand-300" />
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider backdrop-blur-md ${
              isInfluencer ? 'bg-fuchsia-500/90 text-white' : 'bg-brand-500/90 text-white'
            }`}
          >
            {isInfluencer ? 'Influencer' : 'Affiliate'}
          </span>
          {study.category && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold text-ink-700 backdrop-blur-md">
              {study.category.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="heading text-base leading-snug transition-colors group-hover:text-brand-600">
          {study.title}
        </h3>
        <p className="mt-2 text-sm text-ink-400">
          {isInfluencer && study.influencer?.handle ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {study.influencer.handle}
              {study.influencer.followers ? ` · ${study.influencer.followers}` : ''}
            </span>
          ) : (
            [study.client, study.industry].filter(Boolean).join(' · ')
          )}
        </p>

        {metrics.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="heading text-sm sm:text-base">{m.value}</p>
                <p className="mt-0.5 text-[0.68rem] leading-tight text-ink-400">{m.label}</p>
                {m.change && (
                  <p className="mt-0.5 text-[0.68rem] font-semibold text-mint-500">▲ {m.change}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand-600">
          Read case study
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
