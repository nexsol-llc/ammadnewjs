import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Categories } from '@/collections/Categories'
import { CaseStudies } from '@/collections/CaseStudies'
import { Reviews } from '@/collections/Reviews'
import { ContactSubmissions } from '@/collections/ContactSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURI = process.env.DATABASE_URI || ''

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' · Ammad Admin',
    },
  },
  collections: [CaseStudies, Categories, Reviews, Media, ContactSubmissions, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-do-not-use-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // MongoDB Atlas in production (set DATABASE_URI); zero-setup local SQLite file otherwise.
  db: databaseURI.startsWith('mongodb')
    ? mongooseAdapter({
        url: databaseURI,
        connectOptions: { serverSelectionTimeoutMS: 5000 },
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
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
            // Client-side uploads bypass Vercel's 4.5MB serverless request limit
            clientUploads: true,
          }),
        ]
      : []),
  ],
})
