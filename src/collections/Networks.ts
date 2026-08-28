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
      'Affiliate networks & creator platforms shown in the hero circle. The logo appears on its own in the middle of the circle. Recommended size: SVG, or a transparent PNG at 600 × 200 px. Until a logo is uploaded, the network name is shown as a wordmark instead.',
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
          'Recommended size — SVG (any size, scales perfectly), or a transparent PNG at 600 × 200 px (minimum 400 × 150 px). Use the horizontal logo trimmed of surrounding whitespace. It renders up to 176 × 67 px in the circle, so the extra pixels keep it sharp on retina screens. Keep files under ~150 KB.',
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
