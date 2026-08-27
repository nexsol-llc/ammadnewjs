import { Counter } from '@/components/ui/Counter'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { headlineStats } from '@/lib/site'

export function StatsBand() {
  return (
    <section className="relative border-y border-white/6 bg-gradient-to-r from-accent-500/6 via-transparent to-violet-500/6 py-16 md:py-20">
      <div className="glow-line absolute inset-x-0 top-0" />
      <div className="glow-line absolute inset-x-0 bottom-0" />
      <div className="container-x">
        <Stagger className="grid grid-cols-2 gap-10 lg:grid-cols-4" gap={0.12}>
          {headlineStats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="font-display text-4xl font-bold text-white md:text-5xl">
                <Counter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={'decimals' in s ? (s.decimals as number) : 0}
                  className="text-gradient"
                />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-zinc-500 md:text-sm">
                {s.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
