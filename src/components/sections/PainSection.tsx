import { TrendingDown, Lock, Clock } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { painPoints } from '@/lib/site'

const icons = [TrendingDown, Lock, Clock]

export function PainSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="The problem"
          title={
            <>
              Paid ads are eating your <span className="text-gradient">margins</span>
          </>
          }
          subtitle="Every quarter the same story: CPMs up, ROAS down, and 100% of your growth switched off the moment you pause spend."
        />
        <Stagger className="grid gap-6 md:grid-cols-3">
          {painPoints.map((p, i) => {
            const Icon = icons[i % icons.length]
            return (
              <StaggerItem key={p.title}>
                <div className="card-surface group h-full p-8 transition-colors duration-300 hover:border-red-400/25">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display mt-6 text-xl font-semibold text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.description}</p>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
