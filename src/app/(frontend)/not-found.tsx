import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { GlowOrbs } from '@/components/fx/GlowOrbs'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-24">
      <GlowOrbs variant="hero" />
      <div className="grid-bg absolute inset-0" />
      <div className="container-x relative text-center">
        <p className="font-display text-8xl font-bold text-gradient sm:text-9xl">404</p>
        <h1 className="font-display mt-4 text-2xl font-semibold text-white sm:text-3xl">
          This page didn&apos;t convert
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
          The link you followed doesn&apos;t exist anymore — but the results do.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <Link
            href="/case-studies"
            className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Browse case studies
          </Link>
        </div>
      </div>
    </section>
  )
}
