import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ReviewCarousel } from '@/components/sections/ReviewCarousel'
import { VideoReviewRail } from '@/components/sections/VideoReviewRail'
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
    <section className={`relative ${heading ? 'py-16 md:py-20' : 'pb-16 pt-4 md:pb-20'} ${alt ? 'section-alt' : ''}`}>
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
          <Reveal>
            <VideoReviewRail reviews={videos} />
          </Reveal>
        )}

        {images.length > 0 && (
          <Reveal className={videos.length ? 'mt-14' : ''}>
            <ReviewCarousel reviews={images} />
          </Reveal>
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
