import { Counter } from '@/components/ui/Counter'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { headlineStats } from '@/lib/site'

export function StatsBand() {
  return (
    <section className="border-y border-line bg-white py-14 md:py-16">
      <div className="container-x">
        <Stagger className="grid grid-cols-2 gap-10 lg:grid-cols-4" gap={0.1}>
          {headlineStats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="heading text-4xl md:text-5xl">
                <Counter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={'decimals' in s ? (s.decimals as number) : 0}
                  className="text-gradient"
                />
              </p>
              <p className="mt-2 text-xs text-ink-400 md:text-sm">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
