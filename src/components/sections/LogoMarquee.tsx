import { Marquee } from '@/components/ui/Marquee'
import { brands } from '@/lib/site'

export function LogoMarquee() {
  return (
    <section className="relative border-y border-white/6 bg-ink-900/30 py-10">
      <p className="mb-7 text-center text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
        Programs built & scaled for
      </p>
      <Marquee>
        {brands.map((b) => (
          <span
            key={b}
            className="font-display whitespace-nowrap text-xl font-semibold text-zinc-600 transition-colors duration-300 hover:text-zinc-300 sm:text-2xl"
          >
            {b}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
