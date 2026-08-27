import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'reviewerName',
    group: 'Content',
    defaultColumns: ['reviewerName', 'type', 'rating', 'featured'],
    description: 'Client reviews — either an image (screenshot) or a video testimonial.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'reviewerName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      admin: { description: 'e.g. "Founder, Even Skyn" (optional)' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image review', value: 'image' },
        { label: 'Video review', value: 'video' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      name: 'quote',
      type: 'textarea',
      admin: { description: 'Short quote shown with the review (optional).' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.type === 'image',
        description: 'Screenshot of the review (WhatsApp, LinkedIn, email…).',
      },
    },
    {
      name: 'videoSource',
      type: 'radio',
      defaultValue: 'upload',
      options: [
        { label: 'Upload', value: 'upload' },
        { label: 'Embed URL', value: 'embed' },
      ],
      admin: { condition: (data) => data?.type === 'video' },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.type === 'video' && data?.videoSource === 'upload',
      },
    },
    {
      name: 'embedUrl',
      type: 'text',
      admin: {
        condition: (data) => data?.type === 'video' && data?.videoSource === 'embed',
        description: 'YouTube / Instagram / TikTok link',
      },
    },
  ],
}
