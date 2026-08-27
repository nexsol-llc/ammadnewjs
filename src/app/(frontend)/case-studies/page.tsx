import type { Metadata } from 'next'
import { CaseStudyArchive } from '@/components/sections/CaseStudyArchive'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { getCaseStudies, getCategories } from '@/lib/cms'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Affiliate and influencer marketing case studies — real revenue numbers from tracked network dashboards across e-commerce and SaaS brands.',
}

export default async function CaseStudiesPage() {
  const [studies, categories] = await Promise.all([getCaseStudies(), getCategories()])
  return (
    <>
      <CaseStudyArchive
        eyebrow="Case studies"
        title={
          <>
            <span className="text-gradient-white">The numbers</span>{' '}
            <span className="text-gradient">speak first</span>
          </>
        }
        subtitle="Every case study below is backed by a tracked network dashboard. Filter by service or industry."
        studies={studies}
        categories={categories}
        activeType="all"
      />
      <FinalCTA />
    </>
  )
}
