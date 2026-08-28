import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

const symbols: Record<string, string> = { USD: '$', GBP: '£', EUR: '€' }

const money = (n: unknown, currency = 'USD') => {
  const v = Number(n)
  if (!Number.isFinite(v)) return '—'
  return `${symbols[currency] || '$'}${Math.round(v).toLocaleString('en-US')}`
}

const num = (n: unknown) => {
  const v = Number(n)
  return Number.isFinite(v) ? Math.round(v).toLocaleString('en-US') : '—'
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Calculator Lead', plural: 'Calculator Leads' },
  admin: {
    useAsTitle: 'name',
    group: 'Inbox',
    // Only top-level fields render as list columns, so `summary` carries the detail.
    defaultColumns: ['name', 'email', 'summary', 'status', 'createdAt'],
    description:
      'Every revenue-calculator submission: who they are, exactly what they entered, and the projection they were shown.',
  },
  defaultSort: '-createdAt',
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // Partial updates (e.g. changing status) only send changed keys — merge first.
        const doc = { ...(originalDoc || {}), ...(data || {}) } as Record<string, any>
        const i = { ...(originalDoc?.inputs || {}), ...(data?.inputs || {}) } as Record<string, any>
        const p = { ...(originalDoc?.projection || {}), ...(data?.projection || {}) } as Record<string, any>
        const cur = i.currency || 'USD'

        data.summary = [
          `${num(i.monthlyVisitors)} visitors`,
          `${num(i.monthlyOrders)} orders`,
          `${money(i.averageOrderValue, cur)} AOV`,
          `${i.commissionRate ?? '—'}% commission`,
          i.network || 'No network',
          `→ projected +${money(p.projectedMonthlyRevenue, cur)}/mo`,
        ].join('  ·  ')

        if (!doc.status) data.status = 'new'
        return data
      },
    ],
  },
  fields: [
    // ── Who ────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%', readOnly: true } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%', readOnly: true } },
      ],
    },
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Website',
      admin: { readOnly: true },
    },
    {
      name: 'summary',
      type: 'text',
      label: 'Submission summary',
      admin: {
        readOnly: true,
        description: 'Auto-generated from the entries below — this is the column shown in the list.',
      },
    },

    // ── Exactly what they typed into the calculator ────────────
    {
      name: 'inputs',
      type: 'group',
      label: 'What they entered',
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'monthlyVisitors', type: 'number', label: 'Monthly visitors', admin: { width: '50%' } },
            { name: 'monthlyOrders', type: 'number', label: 'Monthly orders', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'averageOrderValue', type: 'number', label: 'Average order value', admin: { width: '33%' } },
            { name: 'commissionRate', type: 'number', label: 'Commission %', admin: { width: '33%' } },
            { name: 'currency', type: 'text', label: 'Currency', admin: { width: '33%' } },
          ],
        },
        { name: 'network', type: 'text', label: 'Affiliate network' },
      ],
    },

    // ── What the calculator showed them ────────────────────────
    {
      name: 'projection',
      type: 'group',
      label: 'Projection they were shown',
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'projectedMonthlyRevenue',
              type: 'number',
              label: 'Extra revenue / month',
              admin: { width: '50%' },
            },
            {
              name: 'projectedAnnualRevenue',
              type: 'number',
              label: 'Extra revenue / year',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'projectedOrders', type: 'number', label: 'Extra orders / month', admin: { width: '33%' } },
            { name: 'commissionCost', type: 'number', label: 'Commission cost', admin: { width: '33%' } },
            { name: 'netRevenue', type: 'number', label: 'Net new revenue', admin: { width: '33%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'roas', type: 'number', label: 'Return on commission', admin: { width: '50%' } },
            { name: 'partners', type: 'number', label: 'Partners to recruit', admin: { width: '50%' } },
          ],
        },
      ],
    },

    // ── Your evaluation ────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Call booked', value: 'call-booked' },
        { label: 'Not a fit', value: 'not-a-fit' },
      ],
      admin: { position: 'sidebar', description: 'Your own pipeline status.' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Your notes',
      admin: { description: 'Private notes — never shown on the site.' },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'revenue-calculator',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
