import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Star } from 'lucide-react'
import { HeroVideoStack } from '@/components/media/CampaignVideos'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/lib/site'
import type { CaseStudyItem } from '@/lib/cms'

/* Stills lifted from the video testimonials on /testimonials — real clients,
   not stock. */
const FACES = ['/faces/client-1.webp', '/faces/client-2.webp', '/faces/client-3.webp']

/**
 * The dark opening of an influencer case study: the campaign in a sentence,
 * two calls to action, and the campaign's own videos fanned out beside it.
 *
 * Everything the client writes lives in the `hero` group on the case study.
 * Anything left blank falls back to the title, the overview and the campaign
 * facts, so a case study published without touching the group still reads.
 */
export function CaseStudyHero({ study }: { study: CaseStudyItem }) {
  const hero = study.hero
  const headline = hero?.headlineStart || hero?.headlineAccent || hero?.headlineEnd
  const description = hero?.description || study.overview

  const primary = {
    label: hero?.primaryCtaLabel || 'Book a Call',
    href: hero?.primaryCtaUrl || site.calendly,
  }
  const secondary = {
    label: hero?.secondaryCtaLabel || 'See All Case Studies',
    href: hero?.secondaryCtaUrl || '/case-studies',
  }
  const primaryExternal = /^https?:\/\//.test(primary.href)
  const secondaryExternal = /^https?:\/\//.test(secondary.href)

  /* Without hand-written proof numbers, the campaign's own facts do the job. */
  const stats = hero?.stats.length
    ? hero.stats
    : [
        { value: study.influencer?.followers, label: 'Followers' },
        { value: study.influencer?.platform, label: 'Platform' },
        { value: study.influencer?.brandPartner || study.client, label: 'Brand partner' },
      ]
        .filter((s): s is { value: string; label: string } => Boolean(s.value))
        .slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-ink-950 pb-16 pt-32 md:pb-20 md:pt-40">
      <div className="mesh-dark absolute inset-0" />

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="flex flex-col items-start gap-6">
          <Reveal>
            <Link
              href="/case-studies/influencer-marketing"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Influencer case studies
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="pill-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" aria-hidden="true" />
                {hero?.eyebrow || 'Influencer Marketing'}
              </span>
              {study.category && (
                <Link
                  href={`/case-studies/category/${study.category.slug}`}
                  className="rounded-full border border-white/14 px-3.5 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/35 hover:text-white"
                >
                  {study.category.name}
                </Link>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <h1 className="font-display text-[clamp(2.3rem,5vw,4.1rem)] font-bold leading-[1.05] tracking-[-0.035em] text-balance text-white">
              {headline ? (
                <>
                  {hero?.headlineStart}{' '}
                  {hero?.headlineAccent && (
                    <span className="text-gradient-light pr-[0.12em] italic">{hero.headlineAccent}</span>
                  )}{' '}
                  {hero?.headlineEnd}
                </>
              ) : (
                study.title
              )}
            </h1>
          </Reveal>

          {description && (
            <Reveal delay={0.18}>
              <p className="max-w-[34rem] text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
                {description}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.24} className="w-full">
            <div className="flex flex-wrap gap-3 max-sm:w-full">
              <CtaLink {...primary} external={primaryExternal} variant="primary" />
              <CtaLink {...secondary} external={secondaryExternal} variant="dark" />
            </div>
          </Reveal>

          {hero?.trustNote !== '' && (
            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="flex -space-x-2.5">
                  {FACES.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={200}
                      height={200}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-ink-950"
                    />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm text-white/65">
                    {hero?.trustNote || 'Trusted by 1,000+ brands worldwide'}
                  </span>
                </div>
              </div>
            </Reveal>
          )}

          {stats.length > 0 && (
            <Reveal delay={0.36} className="w-full">
              <dl className="grid w-full max-w-lg grid-cols-3 gap-5 border-t border-white/10 pt-4 sm:gap-8">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse gap-1">
                    <dt className="text-[13px] text-white/50">{s.label}</dt>
                    <dd className="text-gradient-light font-display text-xl font-bold capitalize tracking-[-0.03em] sm:text-[1.75rem]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {study.influencer?.brandUrl && (
            <Reveal delay={0.42}>
              <a
                href={study.influencer.brandUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 transition-colors hover:text-white"
              >
                <Globe className="h-4 w-4" /> Visit brand website
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Reveal>
          )}
        </div>

        {study.videos.length > 0 && (
          <HeroVideoStack
            videos={study.videos}
            brand={study.influencer?.brandPartner || study.client}
          />
        )}
      </div>
    </section>
  )
}

/** Next's Link cannot handle an off-site href, so an external CTA stays an <a>. */
function CtaLink({
  href,
  label,
  external,
  variant,
}: {
  href: string
  label: string
  external: boolean
  variant: 'primary' | 'dark'
}) {
  const className = `btn btn-${variant} group max-sm:w-full`
  const body = (
    <>
      {label}
      {variant === 'primary' && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={href} className={className}>
      {body}
    </Link>
  )
}
