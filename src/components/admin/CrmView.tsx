import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { CrmBoard } from './CrmBoard'

/**
 * The /admin/crm page. DefaultTemplate wraps the board in the usual admin
 * chrome, so the nav and header stay where they are on every other screen.
 */
export function CrmView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <CrmBoard />
      </Gutter>
    </DefaultTemplate>
  )
}
