'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { useState } from 'react'

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-accent-500/60 focus:bg-white/[0.06]'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    // Honeypot — bots fill every field
    if (fd.get('phone')) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          company: fd.get('company') || undefined,
          website: fd.get('website') || undefined,
          service: fd.get('service') || undefined,
          budget: fd.get('budget') || undefined,
          message: fd.get('message'),
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-surface flex flex-col items-center gap-4 p-12 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </span>
        <h3 className="font-display text-2xl font-semibold text-white">Message received</h3>
        <p className="max-w-sm text-sm text-zinc-400">
          Thanks for reaching out — I personally read every message and usually reply within 24
          hours. Want to skip the wait? Book a call directly from the contact options.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card-surface space-y-5 p-7 md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Name *
          </label>
          <input id="cf-name" name="name" required placeholder="Jane Smith" className={inputCls} />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Email *
          </label>
          <input id="cf-email" name="email" type="email" required placeholder="jane@brand.com" className={inputCls} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-company" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Brand / Company
          </label>
          <input id="cf-company" name="company" placeholder="Acme Inc." className={inputCls} />
        </div>
        <div>
          <label htmlFor="cf-website" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Website
          </label>
          <input id="cf-website" name="website" placeholder="https://…" className={inputCls} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-service" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            I&apos;m interested in
          </label>
          <select id="cf-service" name="service" defaultValue="" className={`${inputCls} appearance-none`}>
            <option value="" disabled className="bg-ink-900">
              Select a service…
            </option>
            <option value="affiliate" className="bg-ink-900">Affiliate Marketing</option>
            <option value="influencer" className="bg-ink-900">Influencer Marketing</option>
            <option value="both" className="bg-ink-900">Both</option>
            <option value="other" className="bg-ink-900">Something else</option>
          </select>
        </div>
        <div>
          <label htmlFor="cf-budget" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Monthly budget
          </label>
          <select id="cf-budget" name="budget" defaultValue="" className={`${inputCls} appearance-none`}>
            <option value="" disabled className="bg-ink-900">
              Select a range…
            </option>
            <option value="under-1k" className="bg-ink-900">Under $1,000</option>
            <option value="1k-3k" className="bg-ink-900">$1,000 – $3,000</option>
            <option value="3k-10k" className="bg-ink-900">$3,000 – $10,000</option>
            <option value="10k-plus" className="bg-ink-900">$10,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Tell me about your brand *
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="What do you sell, roughly what's your monthly revenue, and what are you hoping partnerships can do for you?"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Honeypot */}
      <input name="phone" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status === 'error' && (
        <p className="text-sm text-red-400">
          Something went wrong sending your message — please email me directly instead.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-500 to-violet-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_0_28px_rgba(34,211,238,0.25)] transition-all hover:shadow-[0_0_44px_rgba(139,92,246,0.4)] disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  )
}
