import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stagger, StaggerItem, Reveal } from '@/components/ui/Reveal'
import { CaseStudyCard } from '@/components/cards/CaseStudyCard'
import type { CaseStudyItem } from '@/lib/cms'

export function FeaturedCaseStudies({ studies }: { studies: CaseStudyItem[] }) {
  if (!studies.length) return null
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Proof over promises"
          title={
            <>
              Real brands. <span className="text-gradient">Real revenue.</span>
            </>
          }
          subtitle="Every number below is from a tracked network dashboard — Awin, Impact.com, ADCELL, or Daisycon. No vanity metrics."
        />
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.12}>
          {studies.slice(0, 6).map((s) => (
            <StaggerItem key={s.id} className="h-full">
              <CaseStudyCard study={s} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal delay={0.2} className="mt-12 text-center">
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            View all case studies
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
