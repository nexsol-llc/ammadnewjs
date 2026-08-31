import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { crmFields } from '@/fields/crm'
import { notifyOnCreate } from '@/lib/notify'

export const AuditRequests: CollectionConfig = {
  slug: 'audit-requests',
  labels: { singular: 'Audit Request', plural: 'Free Audit Requests' },
  admin: {
    useAsTitle: 'name',
    group: 'Inbox',
    defaultColumns: ['name', 'email', 'company', 'summary', 'status', 'createdAt'],
    description:
      'Requests from the Free Affiliate Program Audit page — brand details, their current program, and the bottlenecks they reported.',
  },
  defaultSort: '-createdAt',
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [
      notifyOnCreate('Free audit request', (d) => [
        ['Name', d.name],
        ['Email', d.email],
        ['Company', d.company],
        ['Role', d.role],
        ['Summary', d.summary],
      ]),
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const doc = { ...(originalDoc || {}), ...(data || {}) } as Record<string, any>
        const p = { ...(originalDoc?.program || {}), ...(data?.program || {}) } as Record<string, any>

        const state =
          p.hasProgram === 'yes'
            ? 'Running'
            : p.hasProgram === 'paused'
              ? 'Paused'
              : p.hasProgram === 'no'
                ? 'No program yet'
                : '—'

        const challenges = Array.isArray(doc.challenges) ? doc.challenges : []

        data.summary = [
          state,
          p.network ? `on ${p.network}` : null,
          p.activePartners ? `${p.activePartners} partners` : null,
          p.monthlyAffiliateRevenue ? `${p.monthlyAffiliateRevenue}/mo affiliate` : null,
          doc.monthlyRevenue ? `${doc.monthlyRevenue} store rev` : null,
          challenges.length ? `${challenges.length} pain point${challenges.length > 1 ? 's' : ''}` : null,
        ]
          .filter(Boolean)
          .join('  ·  ')

        if (!doc.status) data.status = 'new'
        return data
      },
    ],
  },
  fields: [
    // ── Who ──────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%', readOnly: true } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%', readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'company',
          type: 'text',
          label: 'Brand / company',
          admin: { width: '50%', readOnly: true },
        },
        { name: 'website', type: 'text', admin: { width: '50%', readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', label: 'Their role', admin: { width: '50%', readOnly: true } },
        {
          name: 'monthlyRevenue',
          type: 'text',
          label: 'Store revenue / month',
          admin: { width: '50%', readOnly: true },
        },
      ],
    },
    {
      name: 'summary',
      type: 'text',
      label: 'Submission summary',
      admin: {
        readOnly: true,
        description: 'Auto-generated — this is the column shown in the list.',
      },
    },

    // ── Their existing program ───────────────────────────────
    {
      name: 'program',
      type: 'group',
      label: 'Their affiliate program',
      admin: { readOnly: true },
      fields: [
        {
          name: 'hasProgram',
          type: 'select',
          label: 'Program status',
          options: [
            { label: 'Running', value: 'yes' },
            { label: 'Paused / dormant', value: 'paused' },
            { label: 'No program yet', value: 'no' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'network', type: 'text', label: 'Network / platform', admin: { width: '50%' } },
            {
              name: 'monthsRunning',
              type: 'text',
              label: 'How long running',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'activePartners', type: 'text', label: 'Active partners', admin: { width: '33%' } },
            {
              name: 'monthlyAffiliateRevenue',
              type: 'text',
              label: 'Affiliate revenue / month',
              admin: { width: '33%' },
            },
            { name: 'commissionRate', type: 'text', label: 'Commission %', admin: { width: '33%' } },
          ],
        },
      ],
    },

    // ── What is going wrong ──────────────────────────────────
    {
      name: 'challenges',
      type: 'select',
      hasMany: true,
      label: 'Bottlenecks they reported',
      admin: { readOnly: true },
      options: [
        { label: 'Partners sign up but never sell', value: 'dormant-partners' },
        { label: 'Affiliate revenue has plateaued', value: 'plateaued' },
        { label: 'Coupon / cashback sites taking credit', value: 'coupon-leakage' },
        { label: 'Cannot recruit quality partners', value: 'recruitment' },
        { label: 'Tracking / attribution feels unreliable', value: 'tracking' },
        { label: 'Commission structure is guesswork', value: 'commission' },
        { label: 'No time to manage the program', value: 'bandwidth' },
        { label: 'Not sure it is even profitable', value: 'profitability' },
      ],
    },
    {
      name: 'triedSoFar',
      type: 'textarea',
      label: 'What they have tried',
      admin: { readOnly: true },
    },
    { name: 'goal', type: 'textarea', label: 'What success looks like', admin: { readOnly: true } },
    { name: 'timeline', type: 'text', label: 'Timeline to start', admin: { readOnly: true } },

    // ── Your evaluation ──────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Audit in progress', value: 'in-progress' },
        { label: 'Audit delivered', value: 'delivered' },
        { label: 'Call booked', value: 'call-booked' },
        { label: 'Won', value: 'won' },
        { label: 'Not a fit', value: 'not-a-fit' },
      ],
      admin: { position: 'sidebar', description: 'Where this audit stands.' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Your notes',
      admin: { description: 'Private — never shown on the site.' },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'free-audit',
      admin: { position: 'sidebar', readOnly: true },
    },

    ...crmFields,
  ],
}
