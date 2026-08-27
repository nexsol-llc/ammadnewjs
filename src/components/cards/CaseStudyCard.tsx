'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, TrendingUp, Users } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'
import type { CaseStudyItem } from '@/lib/cms'

export function CaseStudyCard({ study }: { study: CaseStudyItem }) {
  const img = study.thumbnail?.cardUrl || study.thumbnail?.url
  const metrics = study.metrics.slice(0, 3)

  return (
    <TiltCard className="group h-full">
      <Link
        href={`/case-studies/${study.slug}`}
        className="card-surface flex h-full flex-col transition-colors duration-300 hover:border-white/16"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
          {img ? (
            <Image
              src={img}
              alt={study.thumbnail?.alt || study.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-700">
              <TrendingUp className="h-10 w-10 text-accent-400/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md ${
                study.type === 'affiliate'
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              }`}
            >
              {study.type === 'affiliate' ? 'Affiliate' : 'Influencer'}
            </span>
            {study.category && (
              <span className="glass rounded-full px-3 py-1 text-[11px] font-medium text-zinc-300">
                {study.category.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-accent-400">
            {study.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            {study.type === 'influencer' && study.influencer?.handle ? (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {study.influencer.handle}
                {study.influencer.followers ? ` · ${study.influencer.followers} followers` : ''}
              </span>
            ) : (
              [study.client, study.industry].filter(Boolean).join(' · ')
            )}
          </p>

          {metrics.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/8 pt-5">
              {metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-sm font-bold text-white sm:text-base">{m.value}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-zinc-500">{m.label}</p>
                  {m.change && (
                    <p className="mt-0.5 text-[11px] font-semibold text-emerald-400">▲ {m.change}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-accent-400">
            Read case study
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </TiltCard>
  )
}
