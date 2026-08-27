import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    group: 'Inbox',
    defaultColumns: ['name', 'email', 'service', 'createdAt'],
    description: 'Messages sent through the contact form.',
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    { name: 'website', type: 'text' },
    {
      name: 'service',
      type: 'select',
      options: [
        { label: 'Affiliate Marketing', value: 'affiliate' },
        { label: 'Influencer Marketing', value: 'influencer' },
        { label: 'Both', value: 'both' },
        { label: 'Something else', value: 'other' },
      ],
    },
    {
      name: 'budget',
      type: 'select',
      options: [
        { label: 'Under $1,000 / month', value: 'under-1k' },
        { label: '$1,000 – $3,000 / month', value: '1k-3k' },
        { label: '$3,000 – $10,000 / month', value: '3k-10k' },
        { label: '$10,000+ / month', value: '10k-plus' },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
  ],
}
