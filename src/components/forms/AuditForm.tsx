'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

const challengeOptions = [
  { label: 'Partners sign up but never sell', value: 'dormant-partners' },
  { label: 'Affiliate revenue has plateaued', value: 'plateaued' },
  { label: 'Coupon / cashback sites taking credit', value: 'coupon-leakage' },
  { label: 'Cannot recruit quality partners', value: 'recruitment' },
  { label: 'Tracking / attribution feels unreliable', value: 'tracking' },
  { label: 'Commission structure is guesswork', value: 'commission' },
  { label: 'No time to manage the program', value: 'bandwidth' },
  { label: 'Not sure it is even profitable', value: 'profitability' },
]

const revenueBands = [
  'Under $10K / month',
  '$10K – $50K / month',
  '$50K – $250K / month',
  '$250K – $1M / month',
  '$1M+ / month',
]

const timelines = ['As soon as possible', 'Within a month', 'This quarter', 'Just exploring']

type Form = {
  name: string
  email: string
  company: string
  website: string
  role: string
  monthlyRevenue: string
  hasProgram: string
  network: string
  monthsRunning: string
  activePartners: string
  monthlyAffiliateRevenue: string
  commissionRate: string
  challenges: string[]
  triedSoFar: string
  goal: string
  timeline: string
  honey: string
}

const empty: Form = {
  name: '',
  email: '',
  company: '',
  website: '',
  role: '',
  monthlyRevenue: '',
  hasProgram: '',
  network: '',
  monthsRunning: '',
  activePartners: '',
  monthlyAffiliateRevenue: '',
  commissionRate: '',
  challenges: [],
  triedSoFar: '',
  goal: '',
  timeline: '',
  honey: '',
}

const stepTitles = ['Your brand', 'Your program', 'What is broken']

export function AuditForm({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Form>(empty)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [touched, setTouched] = useState(false)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  const toggleChallenge = (value: string) =>
    setForm((f) => ({
      ...f,
      challenges: f.challenges.includes(value)
        ? f.challenges.filter((c) => c !== value)
        : [...f.challenges, value],
    }))

  const stepValid = (i: number) => {
    if (i === 0) return form.name.trim() !== '' && /\S+@\S+\.\S+/.test(form.email)
    if (i === 1) return form.hasProgram !== ''
    return true
  }

  const next = () => {
    setTouched(true)
    if (!stepValid(step)) return
    setTouched(false)
    setStep((s) => Math.min(s + 1, 2))
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    // React reuses the footer button's DOM node between steps, so a click that
    // advances to the last step can trigger a native submit on the same tick.
    // Only the final step is allowed to send; anything earlier just advances.
    if (step < 2) {
      next()
      return
    }
    if (form.honey) return setStatus('sent') // bot
    if (!stepValid(0)) return setStep(0)

    setStatus('sending')
    try {
      const res = await fetch('/api/audit-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          website: form.website || undefined,
          role: form.role || undefined,
          monthlyRevenue: form.monthlyRevenue || undefined,
          source: 'free-audit',
          program: {
            hasProgram: form.hasProgram || undefined,
            network: form.network || undefined,
            monthsRunning: form.monthsRunning || undefined,
            activePartners: form.activePartners || undefined,
            monthlyAffiliateRevenue: form.monthlyAffiliateRevenue || undefined,
            commissionRate: form.commissionRate || undefined,
          },
          challenges: form.challenges,
          triedSoFar: form.triedSoFar || undefined,
          goal: form.goal || undefined,
          timeline: form.timeline || undefined,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('sent')
    } catch (err) {
      console.error('Audit request failed:', err)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="card p-8 text-center sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-50">
          <CheckCircle2 className="h-8 w-8 text-mint-500" />
        </span>
        <h3 className="heading mt-5 text-2xl">Your audit is booked</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
          I will email you within one working day to request read-only access or screenshots, then
          deliver the full audit within five working days.
        </p>
        <p className="mt-5 text-xs text-ink-400">
          Nothing in your inbox? Check spam for mail from partner@ammadd.com
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className={`card ${compact ? 'p-6 sm:p-7' : 'p-6 sm:p-8'}`}>
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Step {step + 1} of 3 · {stepTitles[step]}
          </p>
          <span className="text-xs text-ink-400">{Math.round(((step + 1) / 3) * 100)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500"
            initial={false}
            animate={{ width: `${((step + 1) / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -18 }}
          transition={{ duration: 0.28, ease: [0.21, 0.6, 0.35, 1] }}
          className="space-y-4"
        >
          {step === 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="af-name" className="label-xs">
                    Your name *
                  </label>
                  <input
                    id="af-name"
                    className="field"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="af-email" className="label-xs">
                    Work email *
                  </label>
                  <input
                    id="af-email"
                    type="email"
                    className="field"
                    placeholder="jane@yourbrand.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="af-company" className="label-xs">
                    Brand name
                  </label>
                  <input
                    id="af-company"
                    className="field"
                    placeholder="Acme Inc."
                    value={form.company}
                    onChange={(e) => set('company', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="af-website" className="label-xs">
                    Website
                  </label>
                  <input
                    id="af-website"
                    className="field"
                    placeholder="yourbrand.com"
                    value={form.website}
                    onChange={(e) => set('website', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="af-role" className="label-xs">
                    Your role
                  </label>
                  <input
                    id="af-role"
                    className="field"
                    placeholder="Founder / Head of Growth"
                    value={form.role}
                    onChange={(e) => set('role', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="af-rev" className="label-xs">
                    Store revenue / month
                  </label>
                  <select
                    id="af-rev"
                    className="field"
                    value={form.monthlyRevenue}
                    onChange={(e) => set('monthlyRevenue', e.target.value)}
                  >
                    <option value="">Select a range…</option>
                    {revenueBands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {touched && !stepValid(0) && (
                <p className="text-sm text-red-500">Please add your name and a valid email.</p>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <span className="label-xs">Do you have an affiliate program? *</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { v: 'yes', l: 'Yes, running' },
                    { v: 'paused', l: 'Paused / dormant' },
                    { v: 'no', l: 'Not yet' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => set('hasProgram', o.v)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        form.hasProgram === o.v
                          ? 'border-brand-400 bg-brand-50 text-brand-700'
                          : 'border-line-strong bg-white text-ink-500 hover:border-brand-300'
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              {form.hasProgram !== 'no' && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="af-network" className="label-xs">
                        Network / platform
                      </label>
                      <input
                        id="af-network"
                        className="field"
                        placeholder="Awin, impact.com, Shopify app…"
                        value={form.network}
                        onChange={(e) => set('network', e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="af-months" className="label-xs">
                        How long has it run?
                      </label>
                      <input
                        id="af-months"
                        className="field"
                        placeholder="e.g. 18 months"
                        value={form.monthsRunning}
                        onChange={(e) => set('monthsRunning', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="af-partners" className="label-xs">
                        Active partners
                      </label>
                      <input
                        id="af-partners"
                        className="field"
                        placeholder="40"
                        value={form.activePartners}
                        onChange={(e) => set('activePartners', e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="af-affrev" className="label-xs">
                        Affiliate rev / month
                      </label>
                      <input
                        id="af-affrev"
                        className="field"
                        placeholder="$8,000"
                        value={form.monthlyAffiliateRevenue}
                        onChange={(e) => set('monthlyAffiliateRevenue', e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="af-comm" className="label-xs">
                        Commission
                      </label>
                      <input
                        id="af-comm"
                        className="field"
                        placeholder="10%"
                        value={form.commissionRate}
                        onChange={(e) => set('commissionRate', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {form.hasProgram === 'no' && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  An audit diagnoses an existing program, so there may be little to review yet — but
                  carry on and I will send a launch roadmap instead of an audit.
                </p>
              )}

              {touched && !stepValid(1) && (
                <p className="text-sm text-red-500">Please pick one option above.</p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <span className="label-xs">What feels broken? Pick any that apply</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {challengeOptions.map((c) => {
                    const on = form.challenges.includes(c.value)
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => toggleChallenge(c.value)}
                        className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm transition-all ${
                          on
                            ? 'border-brand-400 bg-brand-50 text-brand-700'
                            : 'border-line-strong bg-white text-ink-500 hover:border-brand-300'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            on ? 'border-brand-500 bg-brand-500' : 'border-ink-300'
                          }`}
                        >
                          {on && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </span>
                        {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="af-tried" className="label-xs">
                  What have you already tried?
                </label>
                <textarea
                  id="af-tried"
                  rows={3}
                  className="field resize-none"
                  placeholder="Agency, in-house hire, a recruitment tool…"
                  value={form.triedSoFar}
                  onChange={(e) => set('triedSoFar', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="af-goal" className="label-xs">
                  What would a great outcome look like?
                </label>
                <textarea
                  id="af-goal"
                  rows={3}
                  className="field resize-none"
                  placeholder="e.g. affiliate to 15% of revenue within 6 months"
                  value={form.goal}
                  onChange={(e) => set('goal', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="af-timeline" className="label-xs">
                  When would you want to act on it?
                </label>
                <select
                  id="af-timeline"
                  className="field"
                  value={form.timeline}
                  onChange={(e) => set('timeline', e.target.value)}
                >
                  <option value="">Select…</option>
                  {timelines.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Honeypot */}
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={form.honey}
        onChange={(e) => set('honey', e.target.value)}
      />

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-500">
          Something went wrong sending that. Please email partner@ammadd.com instead.
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={back} className="btn btn-ghost !px-5">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
        {step < 2 ? (
          <button key="continue" type="button" onClick={next} className="btn btn-primary flex-1">
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={status === 'sending'}
            className="btn btn-primary flex-1"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                Claim my free audit
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-400">
        <ShieldCheck className="h-3.5 w-3.5 text-mint-500" />
        Your numbers stay private. No spam, no newsletter.
      </p>
    </form>
  )
}
