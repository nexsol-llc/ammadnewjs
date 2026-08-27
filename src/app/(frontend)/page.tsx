import { Hero } from '@/components/sections/Hero'
import { LogoMarquee } from '@/components/sections/LogoMarquee'
import { RevenueCalculator } from '@/components/sections/RevenueCalculator'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { RoadmapSection } from '@/components/sections/RoadmapSection'
import { StatsBand } from '@/components/sections/StatsBand'
import { FeaturedCaseStudies } from '@/components/sections/FeaturedCaseStudies'
import { ReviewsSection } from '@/components/sections/ReviewsSection'
import { AboutTeaser } from '@/components/sections/AboutTeaser'
import { FAQSection } from '@/components/sections/FAQSection'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { getCaseStudies, getReviews } from '@/lib/cms'

export const revalidate = 120

export default async function HomePage() {
  const [featured, reviews] = await Promise.all([
    getCaseStudies({ featuredOnly: true, limit: 6 }),
    getReviews({ featuredOnly: true, limit: 7 }),
  ])
  const studies = featured.length ? featured : await getCaseStudies({ limit: 6 })

  return (
    <>
      <Hero />
      <LogoMarquee />
      <RevenueCalculator />
      <ServicesSection />
      <RoadmapSection />
      <StatsBand />
      <FeaturedCaseStudies studies={studies} />
      <ReviewsSection reviews={reviews} alt={false} />
      <AboutTeaser />
      <FAQSection />
      <FinalCTA />
    </>
  )
}
