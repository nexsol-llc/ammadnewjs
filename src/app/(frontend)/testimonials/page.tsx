import type { Metadata } from 'next'
import { Reveal } from '@/components/ui/Reveal'
import { ReviewsSection } from '@/components/sections/ReviewsSection'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { StatsBand } from '@/components/sections/StatsBand'
import { getReviews } from '@/lib/cms'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Testimonials',
  description:
    'Video and written reviews from e-commerce and SaaS brands whose affiliate and influencer programs I built and scaled.',
}

export default async function TestimonialsPage() {
  const reviews = await getReviews({ limit: 50 })

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-4 md:pt-44">
        <div className="mesh-bg absolute inset-0" />
        <div className="grid-fade absolute inset-0" />
        <div className="container-x relative text-center">
          <Reveal>
            <span className="pill">Testimonials</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="heading mx-auto mt-6 max-w-3xl text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
              Don&apos;t take my word for it —{' '}
              <span className="text-gradient">take theirs</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-2xl text-base text-ink-500 sm:text-lg">
              Founders and marketing leads talking about what changed once partnerships became a
              real channel for their brand.
            </p>
          </Reveal>
        </div>
      </section>

      <ReviewsSection reviews={reviews} showAllLink={false} alt={false} heading={false} />
      <StatsBand />
      <FinalCTA />
    </>
  )
}
