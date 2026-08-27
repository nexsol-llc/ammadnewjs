import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stagger, StaggerItem, Reveal } from '@/components/ui/Reveal'
import { CaseStudyCard } from '@/components/cards/CaseStudyCard'
import type { CaseStudyItem } from '@/lib/cms'

export function FeaturedCaseStudies({ studies }: { studies: CaseStudyItem[] }) {
  if (!studies.length) return null
  return (
    <section className="section-alt relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Case studies"
          title={
            <>
              Real brands. <span className="text-gradient">Real revenue.</span>
            </>
          }
          subtitle="Every number below comes from a tracked network dashboard — Awin, Impact.com, ADCELL, or Daisycon. No vanity metrics."
        />
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.1}>
          {studies.slice(0, 6).map((s) => (
            <StaggerItem key={s.id} className="h-full">
              <CaseStudyCard study={s} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal delay={0.2} className="mt-12 text-center">
          <Link href="/case-studies" className="btn btn-ghost">
            View all case studies
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
