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
      name: 'hero',
      type: 'group',
      label: 'Hero section',
      admin: {
        condition: (data) => data?.type === 'influencer',
        description:
          'The dark hero at the very top of the case study: headline, intro, two buttons and the fanned stack of campaign videos on the right. Every field is optional — anything left blank falls back to the case study title, overview and the site defaults. Keep to the character counts so nothing wraps awkwardly on a laptop.',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description:
              'Small pill above the headline, e.g. "Brand Ambassador Program". 2–4 words, 18–34 characters.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'headlineStart',
              type: 'text',
              label: 'Headline — before the highlight',
              admin: { width: '33%', description: 'e.g. "Your". 4–30 characters.' },
            },
            {
              name: 'headlineAccent',
              type: 'text',
              label: 'Headline — highlighted words',
              admin: {
                width: '33%',
                description:
                  'Shown in italic gradient, e.g. "creator-led". 1–3 words, 8–22 characters.',
              },
            },
            {
              name: 'headlineEnd',
              type: 'text',
              label: 'Headline — after the highlight',
              admin: {
                width: '33%',
                description:
                  'e.g. "content engine, built to drive sales." 15–50 characters. The whole headline reads best at 45–70 characters.',
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description:
              'Two or three lines under the headline. 130–210 characters — longer than that pushes the buttons below the fold on a laptop.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'primaryCtaLabel',
              type: 'text',
              label: 'CTA 1 — label',
              defaultValue: 'Book a Call',
              admin: { width: '25%', description: '10–22 characters.' },
            },
            {
              name: 'primaryCtaUrl',
              type: 'text',
              label: 'CTA 1 — link',
              admin: {
                width: '25%',
                description: 'Leave blank to use the Calendly booking link.',
              },
            },
            {
              name: 'secondaryCtaLabel',
              type: 'text',
              label: 'CTA 2 — label',
              defaultValue: 'See All Case Studies',
              admin: { width: '25%', description: '10–24 characters.' },
            },
            {
              name: 'secondaryCtaUrl',
              type: 'text',
              label: 'CTA 2 — link',
              admin: { width: '25%', description: 'Leave blank to use /case-studies.' },
            },
          ],
        },
        {
          name: 'trustNote',
          type: 'text',
          defaultValue: 'Trusted by 1,000+ brands worldwide',
          admin: {
            description:
              'Sits beside the client faces and the five stars. 30–55 characters. Clear it to hide that row.',
          },
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Proof numbers',
          maxRows: 3,
          admin: {
            description:
              'Up to 3 numbers under the buttons. Leave empty to show the campaign facts (creator, platform, followers, brand) instead.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  admin: { width: '40%', description: 'e.g. "30.7x". 2–8 characters.' },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { width: '60%', description: 'e.g. "Campaign ROAS". 10–26 characters.' },
                },
              ],
            },
          ],
        },
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
        description:
          'Upload one or more campaign videos, or embed from YouTube/Instagram/TikTok. The first three fan out in the hero and the rest rotate in behind them; all of them appear in the carousel further down the page.',
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
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          label: 'Poster image',
          admin: {
            description:
              'Still shown before the video plays. Portrait 9:16 (1080 × 1920) looks best. Uploads fall back to their own first frame; embeds show a dark tile without one, so a poster matters most there.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'handle',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Creator handle, e.g. @lighttherapyathome. Up to 24 characters.',
              },
            },
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'YouTube', value: 'youtube' },
              ],
              admin: { width: '50%', description: 'Puts the platform logo in the card corner.' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'niche',
              type: 'text',
              admin: {
                width: '50%',
                description: 'e.g. "Health & Wellness". Up to 26 characters.',
              },
            },
            {
              name: 'views',
              type: 'text',
              admin: { width: '50%', description: 'e.g. "658K views". Up to 14 characters.' },
            },
          ],
        },
        {
          name: 'caption',
          type: 'text',
          admin: { description: 'Optional one-liner. Up to 70 characters.' },
        },
      ],
    },
  ],
}
