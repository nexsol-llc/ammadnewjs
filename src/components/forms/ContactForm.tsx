'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { useState } from 'react'

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
        className="card flex flex-col items-center gap-4 p-12 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-50">
          <CheckCircle2 className="h-8 w-8 text-mint-500" />
        </span>
        <h3 className="heading text-2xl">Message received</h3>
        <p className="max-w-sm text-sm text-ink-500">
          Thanks for reaching out — I personally read every message and usually reply within 24
          hours. Want to skip the wait? Book a call directly from the contact options.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-7 md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="label-xs">
            Name *
          </label>
          <input id="cf-name" name="name" required placeholder="Jane Smith" className="field" />
        </div>
        <div>
          <label htmlFor="cf-email" className="label-xs">
            Email *
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            placeholder="jane@brand.com"
            className="field"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-company" className="label-xs">
            Brand / Company
          </label>
          <input id="cf-company" name="company" placeholder="Acme Inc." className="field" />
        </div>
        <div>
          <label htmlFor="cf-website" className="label-xs">
            Website
          </label>
          <input id="cf-website" name="website" placeholder="https://…" className="field" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-service" className="label-xs">
            I&apos;m interested in
          </label>
          <select id="cf-service" name="service" defaultValue="" className="field">
            <option value="" disabled>
              Select a service…
            </option>
            <option value="affiliate">Affiliate Marketing</option>
            <option value="influencer">Influencer Marketing</option>
            <option value="both">Both</option>
            <option value="other">Something else</option>
          </select>
        </div>
        <div>
          <label htmlFor="cf-budget" className="label-xs">
            Monthly budget
          </label>
          <select id="cf-budget" name="budget" defaultValue="" className="field">
            <option value="" disabled>
              Select a range…
            </option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-3k">$1,000 – $3,000</option>
            <option value="3k-10k">$3,000 – $10,000</option>
            <option value="10k-plus">$10,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="label-xs">
          Tell me about your brand *
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="What do you sell, roughly what's your monthly revenue, and what are you hoping partnerships can do for you?"
          className="field resize-none"
        />
      </div>

      {/* Honeypot */}
      <input name="phone" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status === 'error' && (
        <p className="text-sm text-red-500">
          Something went wrong sending your message — please email me directly instead.
        </p>
      )}

      <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full sm:w-auto">
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}
