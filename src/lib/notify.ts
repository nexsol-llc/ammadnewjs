import type { CollectionAfterChangeHook } from 'payload'
import { canonicalUrl } from '@/lib/site'

/**
 * Emails you when a new lead comes in.
 *
 * Sending is best-effort on purpose: if the mail server is down or the SMTP
 * details are wrong, the visitor's submission must still be saved. A failure
 * here is logged and swallowed, never thrown back at the form.
 */

type Line = [label: string, value: unknown]

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const rows = (lines: Line[]) =>
  lines
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 14px 6px 0;color:#6b6c82;font-size:13px;vertical-align:top;white-space:nowrap">${esc(label)}</td>
          <td style="padding:6px 0;color:#14142b;font-size:14px">${esc(value)}</td>
        </tr>`,
    )
    .join('')

const template = (heading: string, lines: Line[], adminPath: string, siteUrl: string) => `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6d4aff">New lead</p>
    <h1 style="margin:0 0 18px;font-size:20px;color:#0a0a14">${esc(heading)}</h1>
    <table style="border-collapse:collapse;width:100%">${rows(lines)}</table>
    <p style="margin:22px 0 0">
      <a href="${esc(siteUrl)}${esc(adminPath)}"
         style="display:inline-block;background:#6d4aff;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600">
        Open in the admin
      </a>
    </p>
  </div>
`

/**
 * Builds an afterChange hook that emails a summary the first time a document is
 * created. `lines` decides what the email actually says for that collection.
 */
export const notifyOnCreate =
  (heading: string, lines: (doc: Record<string, unknown>) => Line[]): CollectionAfterChangeHook =>
  async ({ doc, operation, req, collection }) => {
    if (operation !== 'create') return doc

    const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER
    if (!to) return doc

    const siteUrl = canonicalUrl
    const record = doc as Record<string, unknown>

    try {
      await req.payload.sendEmail({
        to,
        subject: `${heading} — ${record.name || record.email || 'new submission'}`,
        html: template(
          heading,
          lines(record),
          `/admin/collections/${collection.slug}/${record.id}`,
          siteUrl,
        ),
      })
    } catch (error) {
      // Never let a mail problem cost you the lead itself.
      req.payload.logger.error({ err: error }, 'Lead notification email failed')
    }

    return doc
  }
