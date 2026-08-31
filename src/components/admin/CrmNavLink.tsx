'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Puts CRM in the sidebar alongside the Inbox collections it draws from —
 * a custom view has no collection, so it needs its own nav entry.
 */
export function CrmNavLink() {
  const pathname = usePathname()
  const active = pathname?.endsWith('/crm')

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <h4
        style={{
          margin: '0 0 0.4rem',
          fontSize: '0.68rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--theme-elevation-450)',
        }}
      >
        Pipeline
      </h4>
      <Link
        href="/admin/crm"
        style={{
          display: 'block',
          padding: '0.35rem 0',
          fontSize: '0.9rem',
          textDecoration: 'none',
          color: active ? 'var(--theme-elevation-1000)' : 'var(--theme-elevation-700)',
          fontWeight: active ? 600 : 400,
        }}
      >
        CRM
      </Link>
    </div>
  )
}
