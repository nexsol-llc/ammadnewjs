import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Categories } from '@/collections/Categories'
import { CaseStudies } from '@/collections/CaseStudies'
import { Reviews } from '@/collections/Reviews'
import { ContactSubmissions } from '@/collections/ContactSubmissions'
import { Leads } from '@/collections/Leads'
import { Networks } from '@/collections/Networks'
import { AuditRequests } from '@/collections/AuditRequests'
import { AnalyticsSessions } from '@/collections/AnalyticsSessions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURI = process.env.DATABASE_URI || ''

/* Cloudflare R2 speaks the S3 protocol, so the S3 adapter drives it. Uploads
   stay on disk until all four values are present, which keeps local development
   working with no cloud account at all. */
const r2 = {
  bucket: process.env.R2_BUCKET || '',
  endpoint: process.env.R2_ENDPOINT || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  publicUrl: (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, ''),
}
const useR2 = Boolean(r2.bucket && r2.endpoint && r2.accessKeyId && r2.secretAccessKey)

/* Hostinger, or any other SMTP host. Without it Payload writes mail to the
   console instead, which is fine locally and useless in production. */
const smtpHost = process.env.SMTP_HOST || ''
const smtpUser = process.env.SMTP_USER || ''

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' · Ammad Admin',
    },
    components: {
      views: {
        crm: {
          Component: '@/components/admin/CrmView#CrmView',
          path: '/crm',
        },
      },
      afterNavLinks: ['@/components/admin/CrmNavLink#CrmNavLink'],
    },
  },
  collections: [
    CaseStudies,
    Categories,
    Reviews,
    Networks,
    Media,
    AuditRequests,
    Leads,
    ContactSubmissions,
    AnalyticsSessions,
    Users,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-do-not-use-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // MongoDB Atlas in production (set DATABASE_URI); zero-setup local SQLite file otherwise.
  db: databaseURI.startsWith('mongodb')
    ? mongooseAdapter({
        url: databaseURI,
        // 5s was too tight: a cold connection has to resolve SRV records,
        // negotiate TLS and discover the replica set before this expires, which
        // intermittently failed from a standing start.
        connectOptions: { serverSelectionTimeoutMS: 20000 },
        // Mongo aborts any transaction older than 60s, and a large video upload
        // to R2 takes longer than that — which killed the 55-75MB files mid-
        // transfer. Nothing here needs multi-document atomicity.
        transactionOptions: false,
      })
    : sqliteAdapter({
        client: { url: databaseURI || `file:${path.resolve(dirname, '../payload.db')}` },
      }),
  sharp,
  upload: {
    limits: {
      fileSize: 300_000_000, // 300MB — large campaign videos
    },
  },
  ...(smtpHost && smtpUser
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM || smtpUser,
          defaultFromName: process.env.SMTP_FROM_NAME || 'M. Ammad',
          transportOptions: {
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 465,
            // Port 465 is implicit TLS; 587 upgrades with STARTTLS.
            secure: (Number(process.env.SMTP_PORT) || 465) === 465,
            auth: { user: smtpUser, pass: process.env.SMTP_PASS || '' },
          },
        }),
      }
    : {}),
  plugins: [
    ...(useR2
      ? [
          s3Storage({
            collections: {
              media: {
                // R2 serves the files from its own public domain, not from Next.
                disableLocalStorage: true,
                ...(r2.publicUrl
                  ? { generateFileURL: ({ filename }: { filename: string }) =>
                      `${r2.publicUrl}/${filename}` }
                  : {}),
              },
            },
            bucket: r2.bucket,
            config: {
              endpoint: r2.endpoint,
              // R2 has no regions, but the S3 client insists on a value.
              region: 'auto',
              credentials: {
                accessKeyId: r2.accessKeyId,
                secretAccessKey: r2.secretAccessKey,
              },
            },
          }),
        ]
      : []),
  ],
})
