import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-24">
      <div className="mesh-bg absolute inset-0" />
      <div className="grid-fade absolute inset-0" />
      <div className="container-x relative text-center">
        <p className="heading text-gradient text-8xl sm:text-9xl">404</p>
        <h1 className="heading mt-4 text-2xl sm:text-3xl">This page didn&apos;t convert</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
          The link you followed doesn&apos;t exist anymore — but the results do.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <Link href="/case-studies" className="btn btn-ghost">
            Browse case studies
          </Link>
        </div>
      </div>
    </section>
  )
}
