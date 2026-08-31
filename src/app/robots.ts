import type { MetadataRoute } from 'next'
import { canonicalUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const base = canonicalUrl
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
