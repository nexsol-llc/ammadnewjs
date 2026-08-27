import type { Metadata } from 'next'
import { CaseStudyArchive } from '@/components/sections/CaseStudyArchive'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { getCaseStudies, getCategories } from '@/lib/cms'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Influencer Marketing Case Studies',
  description:
    'Influencer campaign case studies — creator partnerships from micro to macro across beauty, fashion, skincare, and baby product niches, with campaign videos.',
}

export default async function InfluencerCaseStudiesPage() {
  const [studies, categories] = await Promise.all([
    getCaseStudies({ type: 'influencer' }),
    getCategories('influencer'),
  ])
  return (
    <>
      <CaseStudyArchive
        eyebrow="Influencer marketing"
        title={
          <>
            <span className="text-gradient-white">Creators your customers</span>{' '}
            <span className="text-gradient">already trust</span>
          </>
        }
        subtitle="Campaigns matched by audience fit, not follower count — from 3K micro-creators to 639K macro accounts."
        studies={studies}
        categories={categories}
        activeType="influencer"
      />
      <FinalCTA />
    </>
  )
}
