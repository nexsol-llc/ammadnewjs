import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access'

const never = () => false

const duration = (seconds: unknown) => {
  const s = Math.max(0, Math.round(Number(seconds) || 0))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return s % 60 ? `${m}m ${s % 60}s` : `${m}m`
}

/**
 * One visit, with every touchpoint along the way.
 *
 * Written only by the local API from /api/track — the visitor's browser never
 * talks to this collection directly, so nobody can forge or edit a journey.
 * Touchpoints live on the session rather than in their own collection so the
 * whole journey reads as one document in the admin.
 */
export const AnalyticsSessions: CollectionConfig = {
  slug: 'analytics-sessions',
  labels: { singular: 'Visitor Session', plural: 'Visitor Sessions' },
  admin: {
    useAsTitle: 'summary',
    group: 'Analytics',
    defaultColumns: ['summary', 'location', 'landingPath', 'touchpointCount', 'lastSeenAt'],
    components: {
      beforeListTable: ['@/components/admin/AnalyticsDashboard#AnalyticsDashboard'],
    },
    description:
      'Every visit to the site: where the visitor came from, each page and click in order, and how long they stayed.',
  },
  defaultSort: '-lastSeenAt',
  access: {
    create: never,
    update: never,
    delete: authenticated,
    read: authenticated,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const doc = { ...(originalDoc || {}), ...(data || {}) } as Record<string, unknown>
        const points = (doc.touchpoints as unknown[]) || []
        const location = [doc.city, doc.region, doc.country].filter(Boolean).join(', ')

        data.touchpointCount = points.length
        data.location = location || 'Unknown'
        data.summary = [
          `${points.length} touchpoint${points.length === 1 ? '' : 's'}`,
          duration(doc.durationSeconds),
          location || 'Unknown location',
          doc.converted ? '· converted' : '',
        ]
          .filter(Boolean)
          .join(' · ')
        return data
      },
    ],
  },
  fields: [
    { name: 'summary', type: 'text', admin: { readOnly: true } },

    {
      type: 'row',
      fields: [
        {
          name: 'sessionId',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'One browsing session. Resets after 30 minutes idle.' },
        },
        {
          name: 'visitorId',
          type: 'text',
          index: true,
          admin: { description: 'Same person across sessions — filter by this to see return visits.' },
        },
      ],
    },

    // ── Where and when ─────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'startedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'lastSeenAt', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'durationSeconds', type: 'number', label: 'Time on site (seconds)' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', admin: { readOnly: true } },
        { name: 'country', type: 'text', index: true },
        { name: 'region', type: 'text' },
        { name: 'city', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ip',
          type: 'text',
          label: 'IP address',
          admin: { description: 'Masked — the final octet is dropped, so it identifies a network, not a household.' },
        },
        { name: 'device', type: 'select', options: ['desktop', 'mobile', 'tablet', 'unknown'] },
        { name: 'browser', type: 'text' },
        { name: 'os', type: 'text' },
      ],
    },

    // ── The journey ────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'landingPath', type: 'text', label: 'Landed on' },
        { name: 'exitPath', type: 'text', label: 'Left from' },
        { name: 'referrer', type: 'text', admin: { description: 'Empty means direct or a private referrer.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'touchpointCount', type: 'number', label: 'Touchpoints', admin: { readOnly: true } },
        { name: 'pageviews', type: 'number' },
        { name: 'clicks', type: 'number' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'converted', type: 'checkbox', label: 'Converted' },
        { name: 'conversionLabel', type: 'text', admin: { condition: (d) => Boolean(d?.converted) } },
      ],
    },

    {
      name: 'touchpoints',
      type: 'array',
      labels: { singular: 'Touchpoint', plural: 'Journey' },
      admin: {
        description: 'Every step in order — first touch at the top, most recent at the bottom.',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Page view', value: 'pageview' },
                { label: 'Click', value: 'click' },
                { label: 'Outbound click', value: 'outbound' },
                { label: 'Form submitted', value: 'form' },
                { label: 'Video played', value: 'video' },
                { label: 'Conversion', value: 'conversion' },
              ],
            },
            { name: 'at', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
            { name: 'seconds', type: 'number', label: 'Seconds here' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'path', type: 'text' },
          ],
        },
      ],
    },

    { name: 'userAgent', type: 'textarea', admin: { position: 'sidebar' } },
    {
      name: 'journey',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '@/components/admin/JourneyTimeline#JourneyTimeline' },
      },
    },
  ],
}
