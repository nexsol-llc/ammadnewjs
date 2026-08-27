import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { ReviewCard } from '@/components/cards/ReviewCard'
import type { ReviewItem } from '@/lib/cms'

type Props = {
  reviews: ReviewItem[]
  showAllLink?: boolean
  alt?: boolean
  /** Hide the section heading when the page already has its own. */
  heading?: boolean
}

export function ReviewsSection({ reviews, showAllLink = true, alt = true, heading = true }: Props) {
  if (!reviews.length) return null
  const videos = reviews.filter((r) => r.type === 'video')
  const images = reviews.filter((r) => r.type === 'image')

  return (
    <section className={`relative ${heading ? 'py-24 md:py-32' : 'pb-24 pt-4 md:pb-32'} ${alt ? 'section-alt' : ''}`}>
      <div className="container-x">
        {heading && (
          <SectionHeading
            eyebrow="Testimonials"
            title={
              <>
                What partners say <span className="text-gradient">on camera & on record</span>
              </>
            }
            subtitle="Unscripted video reviews and real screenshots from the brands and partners I work with."
          />
        )}

        {videos.length > 0 && (
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.1}>
            {videos.map((r) => (
              <StaggerItem key={r.id} className="h-full">
                <ReviewCard review={r} />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {images.length > 0 && (
          <Stagger
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${videos.length ? 'mt-6' : ''}`}
            gap={0.08}
          >
            {images.map((r) => (
              <StaggerItem key={r.id} className="h-full">
                <ReviewCard review={r} />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {showAllLink && (
          <Reveal delay={0.15} className="mt-12 text-center">
            <Link href="/testimonials" className="btn btn-ghost">
              See all testimonials
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
