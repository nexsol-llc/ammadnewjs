/**
 * Affiliate revenue projection model.
 *
 * Benchmarks are drawn from the programs in the case studies: a well-run partner
 * program adds roughly 8–45% incremental sessions on top of existing traffic, and
 * partner traffic converts ~1.5x better than site average because it arrives from
 * editorial, review and comparison content with high purchase intent.
 */

export type Currency = 'USD' | 'GBP' | 'EUR'

export type CalcInput = {
  monthlyVisitors: number
  monthlyOrders: number
  averageOrderValue: number
  commissionRate: number
  network?: string
}

export type CalcResult = {
  currentRevenue: number
  currentCvr: number
  affiliateCvr: number
  incrementalTraffic: number
  affiliateOrders: number
  affiliateRevenue: number
  commissionCost: number
  netRevenue: number
  annualRevenue: number
  roas: number
  partners: number
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export const currencySymbol: Record<Currency, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
}

export function calculate(input: CalcInput): CalcResult {
  const visitors = Math.max(0, input.monthlyVisitors || 0)
  const orders = Math.max(0, input.monthlyOrders || 0)
  const aov = Math.max(0, input.averageOrderValue || 0)
  const commission = clamp(input.commissionRate || 0, 1, 50)

  const currentRevenue = orders * aov
  const currentCvr = visitors > 0 ? clamp(orders / visitors, 0.002, 0.15) : 0.02

  // A more attractive commission recruits more (and better) partners.
  const commissionFactor = clamp(commission / 10, 0.55, 1.9)
  // Brands already on a network start from existing infrastructure.
  const networkFactor = input.network && input.network !== 'none' ? 1.08 : 1

  const trafficLift = clamp(0.22 * commissionFactor * networkFactor, 0.08, 0.45)
  const incrementalTraffic = visitors * trafficLift
  const affiliateCvr = clamp(currentCvr * 1.55, 0.004, 0.2)

  const affiliateOrders = incrementalTraffic * affiliateCvr
  const affiliateRevenue = affiliateOrders * aov
  const commissionCost = affiliateRevenue * (commission / 100)
  const netRevenue = affiliateRevenue - commissionCost
  const roas = commissionCost > 0 ? affiliateRevenue / commissionCost : 0
  const partners = Math.round(clamp(12 + (visitors / 5000) * commissionFactor, 12, 180))

  return {
    currentRevenue,
    currentCvr,
    affiliateCvr,
    incrementalTraffic,
    affiliateOrders,
    affiliateRevenue,
    commissionCost,
    netRevenue,
    annualRevenue: affiliateRevenue * 12,
    roas,
    partners,
  }
}

export function formatMoney(value: number, currency: Currency = 'USD'): string {
  const symbol = currencySymbol[currency]
  const rounded = Math.round(value)
  if (rounded >= 1_000_000) return `${symbol}${(rounded / 1_000_000).toFixed(1)}M`
  return `${symbol}${rounded.toLocaleString('en-US')}`
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US')
}
