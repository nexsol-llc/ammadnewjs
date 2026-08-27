import { Marquee } from '@/components/ui/Marquee'
import { brands } from '@/lib/site'

export function LogoMarquee() {
  return (
    <section className="border-y border-line bg-white py-9">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
        Programs built & scaled for
      </p>
      <Marquee>
        {brands.map((b) => (
          <span
            key={b}
            className="heading whitespace-nowrap text-lg text-ink-300 transition-colors duration-300 hover:text-ink-700 sm:text-xl"
          >
            {b}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
