'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Loader2,
  Lock,
  TrendingUp,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { calculate, formatMoney, formatNumber, type CalcResult, type Currency } from '@/lib/calculator'
import { networks as staticNetworks, site } from '@/lib/site'
import type { NetworkInfo } from '@/lib/cms'

type Form = {
  websiteUrl: string
  monthlyVisitors: string
  monthlyOrders: string
  averageOrderValue: string
  commissionRate: number
  currency: Currency
  network: string
}

const initialForm: Form = {
  websiteUrl: '',
  monthlyVisitors: '',
  monthlyOrders: '',
  averageOrderValue: '',
  commissionRate: 10,
  currency: 'USD',
  network: '',
}

export function RevenueCalculator({ networks = [] }: { networks?: NetworkInfo[] }) {
  const reduce = useReducedMotion()
  const networkOptions = networks.length ? networks : staticNetworks
  const [form, setForm] = useState<Form>(initialForm)
  const [modalOpen, setModalOpen] = useState(false)
  const [lead, setLead] = useState({ name: '', email: '' })
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [result, setResult] = useState<CalcResult | null>(null)

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const visitors = Number(form.monthlyVisitors) || 0
  const orders = Number(form.monthlyOrders) || 0
  const aov = Number(form.averageOrderValue) || 0
  const ready = visitors > 0 && orders > 0 && aov > 0

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setModalOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen])

  function onCalculate(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) return
    setModalOpen(true)
  }

  async function onUnlock(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')

    const computed = calculate({
      monthlyVisitors: visitors,
      monthlyOrders: orders,
      averageOrderValue: aov,
      commissionRate: form.commissionRate,
      network: form.network || 'none',
    })

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          websiteUrl: form.websiteUrl || undefined,
          source: 'revenue-calculator',
          inputs: {
            monthlyVisitors: visitors,
            monthlyOrders: orders,
            averageOrderValue: aov,
            commissionRate: form.commissionRate,
            currency: form.currency,
            network: form.network || 'Not on a network yet',
          },
          projection: {
            projectedMonthlyRevenue: Math.round(computed.affiliateRevenue),
            projectedAnnualRevenue: Math.round(computed.annualRevenue),
            projectedOrders: Math.round(computed.affiliateOrders),
            commissionCost: Math.round(computed.commissionCost),
            netRevenue: Math.round(computed.netRevenue),
            roas: Number(computed.roas.toFixed(2)),
            partners: computed.partners,
          },
        }),
      })
    } catch (err) {
      // The projection is still shown even if the save fails — never block the visitor.
      console.error('Lead save failed:', err)
      setStatus('error')
    }

    setResult(computed)
    setStatus('idle')
    setModalOpen(false)
  }

  const cur = form.currency

  return (
    <section id="revenue-calculator" className="relative scroll-mt-24 overflow-hidden bg-ink-950 py-20 md:py-28">
      <div className="mesh-dark absolute inset-0" />
      <div className="container-x relative">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="pill-dark">
            <Calculator className="h-3.5 w-3.5" /> Free tool
          </span>
          <h2 className="heading text-3xl text-white sm:text-4xl md:text-[2.9rem]">
            What could partners add to{' '}
            <span className="bg-gradient-to-r from-brand-300 to-fuchsia-400 bg-clip-text text-transparent">
              your revenue?
            </span>
          </h2>
          <p className="max-w-2xl text-base text-white/60 sm:text-lg">
            Enter your numbers and see a projection built from the real benchmarks behind the case
            studies on this site.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* ── Inputs ─────────────────────────────────── */}
          <form
            onSubmit={onCalculate}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="rc-url" className="label-xs !text-white/45">
                  Your website
                </label>
                <input
                  id="rc-url"
                  className="field-dark"
                  placeholder="yourbrand.com"
                  value={form.websiteUrl}
                  onChange={(e) => set('websiteUrl', e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rc-visitors" className="label-xs !text-white/45">
                    Monthly visitors *
                  </label>
                  <input
                    id="rc-visitors"
                    type="number"
                    min="0"
                    required
                    className="field-dark"
                    placeholder="50,000"
                    value={form.monthlyVisitors}
                    onChange={(e) => set('monthlyVisitors', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="rc-orders" className="label-xs !text-white/45">
                    Monthly orders *
                  </label>
                  <input
                    id="rc-orders"
                    type="number"
                    min="0"
                    required
                    className="field-dark"
                    placeholder="900"
                    value={form.monthlyOrders}
                    onChange={(e) => set('monthlyOrders', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
                <div>
                  <label htmlFor="rc-aov" className="label-xs !text-white/45">
                    Average order value *
                  </label>
                  <input
                    id="rc-aov"
                    type="number"
                    min="0"
                    required
                    className="field-dark"
                    placeholder="120"
                    value={form.averageOrderValue}
                    onChange={(e) => set('averageOrderValue', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="rc-currency" className="label-xs !text-white/45">
                    Currency
                  </label>
                  <select
                    id="rc-currency"
                    className="field-dark"
                    value={form.currency}
                    onChange={(e) => set('currency', e.target.value as Currency)}
                  >
                    <option value="USD" className="bg-ink-900">USD $</option>
                    <option value="GBP" className="bg-ink-900">GBP £</option>
                    <option value="EUR" className="bg-ink-900">EUR €</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="rc-commission" className="label-xs !mb-0 !text-white/45">
                    Commission you&apos;d pay partners
                  </label>
                  <span className="heading text-lg text-white">{form.commissionRate}%</span>
                </div>
                <input
                  id="rc-commission"
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={form.commissionRate}
                  onChange={(e) => set('commissionRate', Number(e.target.value))}
                />
                <div className="mt-1.5 flex justify-between text-[0.68rem] text-white/35">
                  <span>1%</span>
                  <span>Typical: 8–15%</span>
                  <span>30%</span>
                </div>
              </div>

              <div>
                <label htmlFor="rc-network" className="label-xs !text-white/45">
                  Affiliate network (if you have one)
                </label>
                <select
                  id="rc-network"
                  className="field-dark"
                  value={form.network}
                  onChange={(e) => set('network', e.target.value)}
                >
                  <option value="" className="bg-ink-900">
                    Not on a network yet
                  </option>
                  {networkOptions.map((n) => (
                    <option key={n.name} value={n.name} className="bg-ink-900">
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={!ready} className="btn btn-primary w-full disabled:opacity-40">
                See my revenue projection
                <ArrowRight className="h-4 w-4" />
              </button>
              {!ready && (
                <p className="text-center text-xs text-white/35">
                  Fill in visitors, orders and average order value to continue.
                </p>
              )}
            </div>
          </form>

          {/* ── Results ────────────────────────────────── */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
            {result ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="pill-dark">
                  <TrendingUp className="h-3.5 w-3.5" /> Your projection
                </span>
                <p className="mt-6 text-sm text-white/50">Extra revenue from partners</p>
                <p className="heading mt-1 text-5xl text-white sm:text-6xl">
                  <span className="bg-gradient-to-r from-brand-300 to-fuchsia-400 bg-clip-text text-transparent">
                    +{formatMoney(result.affiliateRevenue, cur)}
                  </span>
                  <span className="ml-2 text-xl font-medium text-white/40">/mo</span>
                </p>
                <p className="mt-1.5 text-sm text-white/50">
                  {formatMoney(result.annualRevenue, cur)} over 12 months
                </p>

                <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-white/10 pt-7">
                  <Stat label="Extra orders / month" value={formatNumber(result.affiliateOrders)} />
                  <Stat label="Partners to recruit" value={formatNumber(result.partners)} />
                  <Stat label="Commission you pay" value={formatMoney(result.commissionCost, cur)} />
                  <Stat
                    label="Net new revenue"
                    value={formatMoney(result.netRevenue, cur)}
                    accent
                  />
                  <Stat label="Return on commission" value={`${result.roas.toFixed(1)}x`} accent />
                  <Stat
                    label="Partner conversion rate"
                    value={`${(result.affiliateCvr * 100).toFixed(2)}%`}
                  />
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm text-white/70">
                    Want the version built on your real analytics instead of benchmarks?
                  </p>
                  <a
                    href={site.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-4 w-full"
                  >
                    Book a free growth call
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <button
                  onClick={() => {
                    setResult(null)
                    setForm(initialForm)
                  }}
                  className="mt-4 w-full text-xs text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
                >
                  Start over with different numbers
                </button>
              </motion.div>
            ) : (
              <div className="flex h-full min-h-[26rem] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Lock className="h-6 w-6 text-white/40" />
                </span>
                <p className="heading mt-5 text-xl text-white">Your projection is ready</p>
                <p className="mt-2 max-w-xs text-sm text-white/45">
                  Fill in your numbers on the left, then unlock a full month-by-month revenue
                  breakdown.
                </p>
                <div
                  aria-hidden
                  className="pointer-events-none mt-8 w-full space-y-3 opacity-40 blur-[6px] select-none"
                >
                  <div className="mx-auto h-10 w-2/3 rounded-lg bg-white/20" />
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 rounded-lg bg-white/12" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          Directional estimate based on benchmarks from managed programs — partner traffic typically
          adds 8–45% incremental sessions and converts ~1.5x better than site average.
        </p>
      </div>

      {/* ── Lead capture modal ───────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rc-modal-title"
          >
            <motion.form
              onSubmit={onUnlock}
              onClick={(e) => e.stopPropagation()}
              initial={reduce ? false : { opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.28, ease: [0.21, 0.6, 0.35, 1] }}
              className="card relative w-full max-w-md p-7 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-1.5 text-ink-400 transition-colors hover:bg-surface-2 hover:text-ink-950"
              >
                <X className="h-4 w-4" />
              </button>

              <span className="pill">Almost there</span>
              <h3 id="rc-modal-title" className="heading mt-4 text-2xl">
                Where should I send your projection?
              </h3>
              <p className="mt-2 text-sm text-ink-500">
                Your numbers are calculated. Add your name and email to unlock the full breakdown.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="rc-name" className="label-xs">
                    Your name *
                  </label>
                  <input
                    id="rc-name"
                    required
                    className="field"
                    placeholder="Jane Smith"
                    value={lead.name}
                    onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="rc-email" className="label-xs">
                    Work email *
                  </label>
                  <input
                    id="rc-email"
                    type="email"
                    required
                    className="field"
                    placeholder="jane@yourbrand.com"
                    value={lead.email}
                    onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                  />
                </div>
              </div>

              <button type="submit" disabled={status === 'saving'} className="btn btn-primary mt-6 w-full">
                {status === 'saving' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Calculating…
                  </>
                ) : (
                  <>
                    Show my revenue projection
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-400">
                <BadgeCheck className="h-3.5 w-3.5 text-mint-500" />
                No spam. No newsletter. Just your numbers.
              </p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className={`heading text-2xl ${accent ? 'text-mint-500' : 'text-white'}`}>{value}</p>
      <p className="mt-0.5 text-xs text-white/45">{label}</p>
    </div>
  )
}
