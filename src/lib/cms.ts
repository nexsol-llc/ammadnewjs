import { getPayload } from 'payload'
import config from '@payload-config'

/* Plain, serializable shapes passed from server components to client components. */

export type MediaInfo = {
  url: string
  alt: string
  width?: number
  height?: number
  mimeType?: string
  thumbnailUrl?: string
  cardUrl?: string
  heroUrl?: string
}

export type VideoItem = {
  source: 'upload' | 'embed'
  media?: MediaInfo
  embedUrl?: string
  caption?: string
}

export type MetricItem = { label: string; value: string; change?: string }

export type CategoryInfo = {
  id: string
  name: string
  slug: string
  type: 'affiliate' | 'influencer'
  description?: string
}

export type CaseStudyItem = {
  id: string
  title: string
  slug: string
  type: 'affiliate' | 'influencer'
  featured: boolean
  client?: string
  industry?: string
  network?: string
  networkLogo?: NetworkInfo
  duration?: string
  category?: CategoryInfo
  influencer?: {
    handle?: string
    platform?: string
    followers?: string
    brandPartner?: string
    brandUrl?: string
  }
  metrics: MetricItem[]
  overview?: string
  problem?: string
  solution?: string
  outcome?: string
  outcomes: string[]
  thumbnail?: MediaInfo
  heroImage?: MediaInfo
  resultsImage?: MediaInfo
  videos: VideoItem[]
}

export type ReviewItem = {
  id: string
  reviewerName: string
  role?: string
  type: 'image' | 'video'
  rating: number
  quote?: string
  image?: MediaInfo
  video?: MediaInfo
  embedUrl?: string
}

const cms = () => getPayload({ config })

/* eslint-disable @typescript-eslint/no-explicit-any */

const mapMedia = (m: any): MediaInfo | undefined => {
  if (!m || typeof m !== 'object' || !m.url) return undefined
  return {
    url: m.url,
    alt: m.alt || '',
    width: m.width || undefined,
    height: m.height || undefined,
    mimeType: m.mimeType || undefined,
    thumbnailUrl: m.sizes?.thumbnail?.url || undefined,
    cardUrl: m.sizes?.card?.url || undefined,
    heroUrl: m.sizes?.hero?.url || undefined,
  }
}

const mapNetwork = (n: any): NetworkInfo | undefined => {
  if (!n || typeof n !== 'object' || !n.name) return undefined
  return {
    id: String(n.id),
    name: n.name,
    color: n.color || '#6d4aff',
    logo: mapMedia(n.logo),
  }
}

const mapCategory = (c: any): CategoryInfo | undefined => {
  if (!c || typeof c !== 'object') return undefined
  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    type: c.type,
    description: c.description || undefined,
  }
}

const mapCaseStudy = (d: any): CaseStudyItem => ({
  id: String(d.id),
  title: d.title,
  slug: d.slug,
  type: d.type,
  featured: Boolean(d.featured),
  client: d.client || undefined,
  industry: d.industry || undefined,
  network: d.network || undefined,
  networkLogo: mapNetwork(d.networkLogo),
  duration: d.duration || undefined,
  category: mapCategory(d.category),
  influencer: d.influencer
    ? {
        handle: d.influencer.handle || undefined,
        platform: d.influencer.platform || undefined,
        followers: d.influencer.followers || undefined,
        brandPartner: d.influencer.brandPartner || undefined,
        brandUrl: d.influencer.brandUrl || undefined,
      }
    : undefined,
  metrics: (d.metrics || []).map((m: any) => ({
    label: m.label,
    value: m.value,
    change: m.change || undefined,
  })),
  overview: d.overview || undefined,
  problem: d.problem || undefined,
  solution: d.solution || undefined,
  outcome: d.outcome || undefined,
  outcomes: (d.outcomes || []).map((o: any) => o.text).filter(Boolean),
  thumbnail: mapMedia(d.thumbnail),
  heroImage: mapMedia(d.heroImage),
  resultsImage: mapMedia(d.resultsImage),
  videos: (d.videos || [])
    .map((v: any) => ({
      source: v.source || 'upload',
      media: mapMedia(v.video),
      embedUrl: v.embedUrl || undefined,
      caption: v.caption || undefined,
    }))
    .filter((v: VideoItem) => v.media || v.embedUrl),
})

const mapReview = (d: any): ReviewItem => ({
  id: String(d.id),
  reviewerName: d.reviewerName,
  role: d.role || undefined,
  type: d.type,
  rating: d.rating ?? 5,
  quote: d.quote || undefined,
  image: mapMedia(d.image),
  video: mapMedia(d.video),
  embedUrl: d.embedUrl || undefined,
})

export async function getCaseStudies(opts?: {
  type?: 'affiliate' | 'influencer'
  categorySlug?: string
  featuredOnly?: boolean
  limit?: number
}): Promise<CaseStudyItem[]> {
  try {
    const payload = await cms()
    const where: any = { and: [] }
    if (opts?.type) where.and.push({ type: { equals: opts.type } })
    if (opts?.categorySlug) where.and.push({ 'category.slug': { equals: opts.categorySlug } })
    if (opts?.featuredOnly) where.and.push({ featured: { equals: true } })
    const res = await payload.find({
      collection: 'case-studies',
      where: where.and.length ? where : undefined,
      sort: 'order',
      depth: 1,
      limit: opts?.limit || 100,
    })
    return res.docs.map(mapCaseStudy)
  } catch (err) {
    console.error('getCaseStudies failed:', err)
    return []
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyItem | null> {
  try {
    const payload = await cms()
    const res = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return res.docs[0] ? mapCaseStudy(res.docs[0]) : null
  } catch (err) {
    console.error('getCaseStudyBySlug failed:', err)
    return null
  }
}

export async function getCategories(type?: 'affiliate' | 'influencer'): Promise<CategoryInfo[]> {
  try {
    const payload = await cms()
    const res = await payload.find({
      collection: 'categories',
      where: type ? { type: { equals: type } } : undefined,
      sort: 'name',
      limit: 100,
    })
    return res.docs.map((c) => mapCategory(c)!).filter(Boolean)
  } catch (err) {
    console.error('getCategories failed:', err)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryInfo | null> {
  try {
    const payload = await cms()
    const res = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return res.docs[0] ? mapCategory(res.docs[0])! : null
  } catch (err) {
    console.error('getCategoryBySlug failed:', err)
    return null
  }
}

export async function getReviews(opts?: {
  type?: 'image' | 'video'
  featuredOnly?: boolean
  limit?: number
}): Promise<ReviewItem[]> {
  try {
    const payload = await cms()
    const where: any = { and: [] }
    if (opts?.type) where.and.push({ type: { equals: opts.type } })
    if (opts?.featuredOnly) where.and.push({ featured: { equals: true } })
    const res = await payload.find({
      collection: 'reviews',
      where: where.and.length ? where : undefined,
      sort: 'order',
      depth: 1,
      limit: opts?.limit || 50,
    })
    return res.docs.map(mapReview)
  } catch (err) {
    console.error('getReviews failed:', err)
    return []
  }
}

export type NetworkInfo = {
  id: string
  name: string
  color: string
  logo?: MediaInfo
}

export async function getNetworks(): Promise<NetworkInfo[]> {
  try {
    const payload = await cms()
    const res = await payload.find({
      collection: 'networks',
      where: { active: { equals: true } },
      sort: 'order',
      depth: 1,
      limit: 60,
    })
    return res.docs.map((n: any) => ({
      id: String(n.id),
      name: n.name,
      color: n.color || '#6d4aff',
      logo: mapMedia(n.logo),
    }))
  } catch (err) {
    console.error('getNetworks failed:', err)
    return []
  }
}
