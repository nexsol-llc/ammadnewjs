import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const Networks: CollectionConfig = {
  slug: 'networks',
  labels: { singular: 'Network', plural: 'Networks & Platforms' },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'logo', 'color', 'order'],
    description:
      'Affiliate networks & creator platforms shown in the hero circle. Upload each official logo — it appears in the middle of the circle. Without a logo, a coloured monogram is shown instead.',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Official logo. SVG or transparent PNG works best — wide/horizontal lockups look right in the circle.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'color',
          type: 'text',
          defaultValue: '#6d4aff',
          admin: { width: '50%', description: 'Brand hex colour, e.g. #ff6b00' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: { width: '50%', description: 'Lower numbers appear first.' },
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show in the hero circle.' },
    },
  ],
}
