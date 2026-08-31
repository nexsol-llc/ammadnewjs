'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { faqs as defaultFaqs } from '@/lib/site'

type Props = {
  faqs?: { q: string; a: string }[]
  eyebrow?: string
  title?: React.ReactNode
}

export function FAQSection({
  faqs = defaultFaqs,
  eyebrow = 'FAQ',
  title = (
    <>
      Questions brands ask <span className="text-gradient">before we start</span>
    </>
  ),
}: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative py-16 md:py-20">
      <div className="container-x max-w-3xl">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
        />
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div
                  className={`card overflow-hidden transition-colors duration-300 ${
                    isOpen ? '!border-brand-200' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="heading text-base md:text-lg">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`shrink-0 rounded-full p-1.5 ${
                        isOpen ? 'bg-brand-50 text-brand-600' : 'bg-surface-3 text-ink-400'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-ink-500">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
