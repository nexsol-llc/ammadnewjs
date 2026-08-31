import type { MetadataRoute } from 'next'
import { getCaseStudies, getCategories } from '@/lib/cms'
import { canonicalUrl } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = canonicalUrl

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/free-audit',
    '/testimonials',
    '/about',
    '/contact',
    '/case-studies',
    '/case-studies/affiliate-marketing',
    '/case-studies/influencer-marketing',
  ].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.8,
  }))

  const [studies, categories] = await Promise.all([getCaseStudies(), getCategories()])

  return [
    ...staticPages,
    ...studies.map((s) => ({
      url: `${base}/case-studies/${s.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...categories.map((c) => ({
      url: `${base}/case-studies/category/${c.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
