import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { ReviewCard } from '@/components/cards/ReviewCard'
import { GlowOrbs } from '@/components/fx/GlowOrbs'
import type { ReviewItem } from '@/lib/cms'

export function ReviewsSection({ reviews }: { reviews: ReviewItem[] }) {
  if (!reviews.length) return null
  const videos = reviews.filter((r) => r.type === 'video')
  const images = reviews.filter((r) => r.type === 'image')

  return (
    <section className="relative py-24 md:py-32">
      <GlowOrbs variant="section" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Client love"
          title={
            <>
              What partners say <span className="text-gradient">on camera & on record</span>
            </>
          }
          subtitle="Unscripted video reviews and real screenshots from the brands and partners I work with."
        />

        {videos.length > 0 && (
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.12}>
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
            gap={0.1}
          >
            {images.map((r) => (
              <StaggerItem key={r.id} className="h-full">
                <ReviewCard review={r} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}
