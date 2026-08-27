import type { Field } from 'payload'

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const slugField = (source = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL identifier — leave blank to auto-generate from the title.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const raw = (value as string) || (data?.[source] as string) || ''
        return slugify(raw)
      },
    ],
  },
})
