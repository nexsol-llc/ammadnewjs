import type { Metadata } from 'next'
import { CaseStudyArchive } from '@/components/sections/CaseStudyArchive'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { getCaseStudies, getCategories } from '@/lib/cms'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Affiliate Marketing Case Studies',
  description:
    'Affiliate program case studies with tracked results — revenue growth, ROAS, and partner recruitment numbers from Awin, Impact.com, ADCELL, and Daisycon.',
}

export default async function AffiliateCaseStudiesPage() {
  const [studies, categories] = await Promise.all([
    getCaseStudies({ type: 'affiliate' }),
    getCategories('affiliate'),
  ])
  return (
    <>
      <CaseStudyArchive
        eyebrow="Affiliate marketing"
        title={
          <>
            <span className="text-gradient-white">Affiliate programs that</span>{' '}
            <span className="text-gradient">outperform paid ads</span>
          </>
        }
        subtitle="From zero-to-launch builds to rescued dormant programs — tracked on Awin, Impact.com, ADCELL, and Daisycon."
        studies={studies}
        categories={categories}
        activeType="affiliate"
      />
      <FinalCTA />
    </>
  )
}
