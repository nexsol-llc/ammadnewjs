import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Media is served from Cloudflare R2, so its hostname has to be allowed here or
 * next/image refuses to optimise it. Reading it from R2_PUBLIC_URL means the
 * allowlist follows the bucket — change the domain in one place, not two.
 */
const r2Host = (() => {
  try {
    return process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : null
  } catch {
    return null
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...(r2Host ? [{ protocol: 'https', hostname: r2Host }] : []),
      // The r2.dev fallback address, for a bucket without a custom domain.
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

export default withPayload(nextConfig)
