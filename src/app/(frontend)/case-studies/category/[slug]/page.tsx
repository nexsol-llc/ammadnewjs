import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudyArchive } from '@/components/sections/CaseStudyArchive'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { getCaseStudies, getCategories, getCategoryBySlug } from '@/lib/cms'

export const revalidate = 120
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category' }
  return {
    title: `${category.name} Case Studies`,
    description:
      category.description ||
      `${category.name} case studies — tracked affiliate and influencer marketing results.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [studies, categories] = await Promise.all([
    getCaseStudies({ categorySlug: slug }),
    getCategories(category.type),
  ])

  return (
    <>
      <CaseStudyArchive
        eyebrow={category.type === 'affiliate' ? 'Affiliate marketing' : 'Influencer marketing'}
        title={
          <>
            <span className="text-gradient-white">{category.name}</span>{' '}
            <span className="text-gradient">case studies</span>
          </>
        }
        subtitle={category.description}
        studies={studies}
        categories={categories}
        activeCategorySlug={slug}
        activeType={category.type}
      />
      <FinalCTA />
    </>
  )
}
