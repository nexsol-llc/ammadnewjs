import type { Field } from 'payload'

/**
 * The CRM pipeline, shared by every collection that produces a lead.
 *
 * Kept separate from each collection's own `status` field: that one is your
 * triage note on a single submission, this one is where the deal sits on the
 * board. The board reads and writes only these fields, so a lead from the
 * calculator, the contact form and the audit form all move the same way.
 */

export const CRM_STAGES = ['new', 'connected', 'won', 'lost'] as const
export type CrmStage = (typeof CRM_STAGES)[number]

const onlyWhen =
  (...stages: CrmStage[]) =>
  (data: Record<string, unknown>) =>
    stages.includes(data?.stage as CrmStage)

export const crmFields: Field[] = [
  {
    name: 'stage',
    type: 'select',
    defaultValue: 'new',
    index: true,
    options: [
      { label: 'New', value: 'new' },
      { label: 'Connected', value: 'connected' },
      { label: 'Won', value: 'won' },
      { label: 'Lost', value: 'lost' },
    ],
    admin: {
      position: 'sidebar',
      description: 'Where this sits on the CRM board.',
    },
  },
  {
    name: 'connectedAt',
    type: 'date',
    label: 'Connected on',
    admin: {
      position: 'sidebar',
      condition: onlyWhen('connected', 'won'),
      date: { pickerAppearance: 'dayOnly' },
    },
  },
  {
    name: 'wonAt',
    type: 'date',
    label: 'Won on',
    admin: {
      position: 'sidebar',
      condition: onlyWhen('won'),
      date: { pickerAppearance: 'dayOnly' },
    },
  },
  {
    name: 'dealValue',
    type: 'number',
    label: 'Revenue',
    admin: {
      position: 'sidebar',
      condition: onlyWhen('won'),
      description: 'What the deal is worth.',
    },
  },
  {
    name: 'dealTerms',
    type: 'textarea',
    label: 'Terms',
    admin: { position: 'sidebar', condition: onlyWhen('won') },
  },
  {
    name: 'lostReason',
    type: 'textarea',
    label: 'Reason lost',
    admin: { position: 'sidebar', condition: onlyWhen('lost') },
  },
]
