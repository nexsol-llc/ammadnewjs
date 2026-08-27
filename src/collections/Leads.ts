import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    group: 'Inbox',
    defaultColumns: ['name', 'email', 'websiteUrl', 'projectedMonthlyRevenue', 'createdAt'],
    description: 'Captured from the revenue calculator — includes what the visitor entered and what was projected.',
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'websiteUrl', type: 'text', label: 'Website' },
    {
      name: 'inputs',
      type: 'group',
      label: 'What they entered',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'monthlyVisitors', type: 'number', admin: { width: '50%' } },
            { name: 'monthlyOrders', type: 'number', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'averageOrderValue', type: 'number', admin: { width: '33%' } },
            { name: 'commissionRate', type: 'number', admin: { width: '33%', description: '%' } },
            { name: 'currency', type: 'text', admin: { width: '33%' } },
          ],
        },
        { name: 'network', type: 'text' },
      ],
    },
    {
      name: 'projection',
      type: 'group',
      label: 'What the calculator projected',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'projectedMonthlyRevenue', type: 'number', admin: { width: '50%' } },
            { name: 'projectedAnnualRevenue', type: 'number', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'projectedOrders', type: 'number', admin: { width: '33%' } },
            { name: 'commissionCost', type: 'number', admin: { width: '33%' } },
            { name: 'netRevenue', type: 'number', admin: { width: '33%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'roas', type: 'number', admin: { width: '50%' } },
            { name: 'partners', type: 'number', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'revenue-calculator',
      admin: { position: 'sidebar' },
    },
  ],
}
