import { Reveal } from '@/components/ui/Reveal'

type Props = {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  align?: 'left' | 'center'
  dark?: boolean
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark }: Props) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div className={`mb-12 flex flex-col gap-4 md:mb-16 ${alignCls}`}>
      {eyebrow && (
        <Reveal>
          <span className={dark ? 'pill-dark' : 'pill'}>{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={`heading text-3xl leading-[1.12] text-balance sm:text-4xl md:text-[2.9rem] ${
            dark ? 'text-white' : ''
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
              dark ? 'text-white/60' : 'text-ink-500'
            } ${align === 'center' ? 'mx-auto' : ''}`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  )
}
