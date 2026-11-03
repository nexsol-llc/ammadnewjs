'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A paragraph cut to three lines on phones, with a toggle to open it out.
 *
 * The clamp and the toggle are both phone-only: above 48rem `line-clamp-none`
 * puts the paragraph back to plain block text, and with nothing clipped there
 * is nothing for the button to reveal, so it never renders.
 */
export function ClampText({
  text,
  className,
  pClassName,
}: {
  text: string
  className?: string
  /** Classes for the paragraph itself, so callers keep their own type styles. */
  pClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [clipped, setClipped] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  /* Measured only while collapsed — once open the two heights match, and
     re-measuring then would take the "Read less" button away. */
  useEffect(() => {
    if (open) return
    const el = ref.current
    if (!el) return
    const measure = () => setClipped(el.scrollHeight - el.clientHeight > 2)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [text, open])

  return (
    <div className={className}>
      <p ref={ref} className={`${open ? '' : 'line-clamp-3'} md:line-clamp-none ${pClassName || ''}`}>
        {text}
      </p>
      {clipped && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-1.5 text-sm font-semibold text-brand-300 transition-colors hover:text-white md:hidden"
        >
          {open ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
