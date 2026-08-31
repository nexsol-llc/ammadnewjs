import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BookCallFab } from '@/components/ui/BookCallFab'
import { BottomBar } from '@/components/layout/BottomBar'
import { Tracker } from '@/components/analytics/Tracker'
import { canonicalUrl, site } from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const siteUrl = canonicalUrl

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: '%s · M. Ammad',
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: 'M. Ammad — Affiliate & Influencer Marketing',
    title: site.title,
    description: site.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'M. Ammad — Affiliate & Influencer Marketing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      {/* Bottom padding clears the fixed action bar on small screens. */}
      <body className="pb-[5.25rem] lg:pb-0">
        <Header />
        <main>{children}</main>
        <Footer />
        <BookCallFab />
        <BottomBar />
        <Tracker />
      </body>
    </html>
  )
}
