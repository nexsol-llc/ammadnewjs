import Image from 'next/image'
import { Marquee } from '@/components/ui/Marquee'
import type { NetworkInfo } from '@/lib/cms'

/** Horizontal logo slider, sized to match the hero panel above it. */
export function NetworkStrip({ networks }: { networks: NetworkInfo[] }) {
  if (!networks.length) return null

  return (
    <section className="relative pb-8 md:pb-10">
      <div className="container-x">
        <div className="rounded-2xl border border-line bg-white px-3 py-5 shadow-[0_12px_34px_-22px_rgba(16,16,40,0.28)]">
          <p className="mb-4 text-center text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-400">
            Networks & platforms I run programs on
          </p>
          <Marquee gapClass="gap-12">
            {networks.map((n) => (
              <span key={n.id} className="flex shrink-0 items-center gap-2.5">
                {n.logo?.url ? (
                  <Image
                    src={n.logo.url}
                    alt={n.name}
                    width={180}
                    height={70}
                    className="h-7 w-auto max-w-[7rem] object-contain"
                    unoptimized={n.logo.mimeType === 'image/svg+xml'}
                  />
                ) : (
                  <>
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: n.color }}
                    />
                    <span className="heading whitespace-nowrap text-base text-ink-500">
                      {n.name}
                    </span>
                  </>
                )}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
