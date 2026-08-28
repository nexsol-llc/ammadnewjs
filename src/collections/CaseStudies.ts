import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'type', 'client', 'category', 'featured'],
    description:
      'Client success stories. Affiliate case studies show metrics + narrative; influencer case studies also support campaign videos.',
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
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Headline of the case study, e.g. "How X scaled to $60K in 4 months".' },
    },
    slugField('title'),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'affiliate',
      options: [
        { label: 'Affiliate Marketing', value: 'affiliate' },
        { label: 'Influencer Marketing', value: 'influencer' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
      filterOptions: ({ siblingData }) => {
        const type = (siblingData as { type?: string })?.type
        if (type) return { type: { equals: type } }
        return true
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'client', type: 'text', admin: { width: '50%' } },
        { name: 'industry', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'networkLogo',
      type: 'relationship',
      relationTo: 'networks',
      label: 'Network logo (shown on the thumbnail)',
      admin: {
        description:
          'Pick the network whose logo should sit on this case study card. Logos are managed in Content → Networks & Platforms.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'network',
          type: 'text',
          admin: { width: '50%', description: 'e.g. Awin, Impact.com, ADCELL, Daisycon' },
        },
        { name: 'duration', type: 'text', admin: { width: '50%', description: 'e.g. "6 Months (Nov 2025 – Apr 2026)"' } },
      ],
    },
    {
      name: 'influencer',
      type: 'group',
      admin: {
        condition: (data) => data?.type === 'influencer',
        description: 'Influencer campaign details.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'handle', type: 'text', admin: { width: '50%', description: 'e.g. @skincare.ninja' } },
            {
              name: 'platform',
              type: 'select',
              defaultValue: 'instagram',
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'YouTube', value: 'youtube' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'followers', type: 'text', admin: { width: '50%', description: 'e.g. 101K' } },
            { name: 'brandPartner', type: 'text', admin: { width: '50%', description: 'e.g. Abib' } },
          ],
        },
        { name: 'brandUrl', type: 'text', admin: { description: 'Brand website (optional)' } },
      ],
    },
    {
      name: 'metrics',
      type: 'array',
      labels: { singular: 'Metric', plural: 'Key Metrics' },
      admin: { description: 'Headline numbers shown in the results band, e.g. Revenue / $23,966 / +130%.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'value', type: 'text', required: true, admin: { width: '35%' } },
            { name: 'change', type: 'text', admin: { width: '25%', description: 'e.g. +130.45% (optional)' } },
          ],
        },
      ],
    },
    { name: 'overview', type: 'textarea' },
    { name: 'problem', type: 'textarea', label: 'The Problem' },
    { name: 'solution', type: 'textarea', label: 'The Solution' },
    { name: 'outcome', type: 'textarea', label: 'The Outcome' },
    {
      name: 'outcomes',
      type: 'array',
      labels: { singular: 'Outcome bullet', plural: 'Outcome bullets' },
      admin: { description: 'Bullet-point results (used for influencer campaigns).' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '33%', description: 'Card image on listing pages.' },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '33%', description: 'Large image at the top of the case study.' },
        },
        {
          name: 'resultsImage',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '33%', description: 'Screenshot of results/stats shown near the outcome.' },
        },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      labels: { singular: 'Video', plural: 'Campaign Videos' },
      admin: {
        description: 'Upload one or more campaign videos, or embed from YouTube/Instagram/TikTok.',
      },
      fields: [
        {
          name: 'source',
          type: 'radio',
          defaultValue: 'upload',
          options: [
            { label: 'Upload', value: 'upload' },
            { label: 'Embed URL', value: 'embed' },
          ],
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_, siblingData) => siblingData?.source === 'upload' },
        },
        {
          name: 'embedUrl',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.source === 'embed',
            description: 'YouTube / Instagram / TikTok link',
          },
        },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
