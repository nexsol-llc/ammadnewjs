'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type Props = {
  words: string[]
  className?: string
  /** ms per character while typing */
  typeSpeed?: number
  /** ms per character while deleting */
  deleteSpeed?: number
  /** ms to hold a completed word before deleting it */
  holdDelay?: number
}

/**
 * Types each word out character by character, holds, deletes, then moves on.
 *
 * Renders the first word complete on the server so the headline is never blank
 * for crawlers or during the first paint.
 */
export function Typewriter({
  words,
  className,
  typeSpeed = 85,
  deleteSpeed = 40,
  holdDelay = 1800,
}: Props) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [sub, setSub] = useState(words[0]?.length ?? 0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce) return
    const word = words[index % words.length]

    if (!deleting && sub === word.length) {
      const t = setTimeout(() => setDeleting(true), holdDelay)
      return () => clearTimeout(t)
    }
    if (deleting && sub === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }
    const t = setTimeout(
      () => setSub((s) => s + (deleting ? -1 : 1)),
      deleting ? deleteSpeed : typeSpeed,
    )
    return () => clearTimeout(t)
  }, [sub, deleting, index, words, reduce, typeSpeed, deleteSpeed, holdDelay])

  const word = words[index % words.length]
  const shown = reduce ? word : word.slice(0, sub)

  return (
    <span className={className}>
      {shown}
      <span aria-hidden className="animate-caret ml-0.5 font-light text-brand-400">
        |
      </span>
    </span>
  )
}
