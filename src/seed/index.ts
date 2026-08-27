/**
 * Content seeder — run with `npm run seed`.
 *
 * Idempotent: existing docs (matched by slug / name) are skipped, so it is safe
 * to re-run. Point DATABASE_URI (+ BLOB_READ_WRITE_TOKEN) at production and
 * re-run to seed the live site.
 *
 * Sources:
 *  - seed-assets/projects.json  → 11 affiliate case studies (images on Cloudinary)
 *  - src/seed/data.ts           → outcomes/networks + 6 influencer campaigns
 *  - seed-assets/videos, images → campaign videos & review media
 */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { slugify } from '../fields/slug'
import { affiliateExtras, influencerSeeds, reviewSeeds } from './data'

const ROOT = process.cwd()
const ASSETS = path.join(ROOT, 'seed-assets')

const mimeByExt: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
}

async function findMediaByAlt(payload: Payload, alt: string) {
  const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  return existing.docs[0] || null
}

async function uploadBuffer(payload: Payload, buf: Buffer, name: string, alt: string) {
  const existing = await findMediaByAlt(payload, alt)
  if (existing) return existing
  const ext = path.extname(name).toLowerCase()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buf,
      name,
      mimetype: mimeByExt[ext] || 'application/octet-stream',
      size: buf.length,
    },
  })
  console.log(`  ↳ media: ${name} (${(buf.length / 1024).toFixed(0)} KB)`)
  return doc
}

async function uploadFromUrl(payload: Payload, url: string, alt: string) {
  try {
    const existing = await findMediaByAlt(payload, alt)
    if (existing) return existing
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const base = path.basename(new URL(url).pathname) || `${crypto.randomBytes(6).toString('hex')}.png`
    const name = `${slugify(alt).slice(0, 60)}${path.extname(base) || '.png'}`
    return await uploadBuffer(payload, buf, name, alt)
  } catch (err) {
    console.warn(`  ⚠ could not fetch ${url}: ${err}`)
    return null
  }
}

async function uploadFromFile(payload: Payload, filePath: string, alt: string) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ missing file: ${filePath}`)
      return null
    }
    const existing = await findMediaByAlt(payload, alt)
    if (existing) return existing
    const buf = fs.readFileSync(filePath)
    return await uploadBuffer(payload, buf, path.basename(filePath), alt)
  } catch (err) {
    console.warn(`  ⚠ could not upload ${filePath}: ${err}`)
    return null
  }
}

async function ensureCategory(
  payload: Payload,
  name: string,
  type: 'affiliate' | 'influencer',
): Promise<string | number> {
  const slug = slugify(name)
  const existing = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs[0]) return existing.docs[0].id
  const doc = await payload.create({ collection: 'categories', data: { name, slug, type } })
  console.log(`  ↳ category: ${name} (${type})`)
  return doc.id
}

type Metric = { label: string; value: string; change?: string }

/** "Revenue: $23,966 (+130.45%) · Clicks: 4,358" → [{label, value, change}] */
function parseMetrics(raw: string): Metric[] {
  return raw
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part): Metric | null => {
      const idx = part.indexOf(':')
      if (idx === -1) return null
      const label = part.slice(0, idx).trim()
      let value = part.slice(idx + 1).trim()
      let change: string | undefined
      const m = value.match(/\(([+−-][\d.,]+%[^)]*)\)/)
      if (m) {
        change = m[1]
        value = value.replace(m[0], '').trim()
      }
      return change ? { label, value, change } : { label, value }
    })
    .filter((x): x is Metric => Boolean(x))
    .slice(0, 8)
}

async function main() {
  const payload = await getPayload({ config })
  console.log('Seeding content…\n')

  // ── Admin user ────────────────────────────────────────────────
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (!users.docs.length) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@ammadd.com'
    const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
    await payload.create({ collection: 'users', data: { email, password, name: 'M. Ammad' } })
    console.log('━'.repeat(56))
    console.log('  Admin user created — CHANGE THE PASSWORD after login')
    console.log(`  email:    ${email}`)
    console.log(`  password: ${password}`)
    console.log('━'.repeat(56) + '\n')
  }

  // ── Affiliate case studies (from legacy projects.json) ────────
  const projectsPath = path.join(ASSETS, 'projects.json')
  if (fs.existsSync(projectsPath)) {
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8')) as Array<Record<string, string>>
    let order = 0
    for (const p of projects) {
      const extra = affiliateExtras[p.clientName]
      if (!extra) continue // skip records not in the curated list
      const slug = slugify(p.title)
      const exists = await payload.find({
        collection: 'case-studies',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (exists.docs.length) {
        console.log(`✓ exists: ${p.clientName}`)
        order++
        continue
      }
      console.log(`＋ affiliate: ${p.clientName}`)
      const categoryId = await ensureCategory(payload, extra.category, 'affiliate')
      const [thumb, hero, results] = await Promise.all([
        uploadFromUrl(payload, p.image, `${p.clientName} — thumbnail`),
        uploadFromUrl(payload, p.heroImage, `${p.clientName} — website`),
        uploadFromUrl(payload, p.lastImage, `${p.clientName} — results dashboard`),
      ])
      await payload.create({
        collection: 'case-studies',
        data: {
          title: p.title,
          slug,
          type: 'affiliate',
          featured: Boolean(extra.featured),
          order: order++,
          // id type differs between the SQLite (number) and MongoDB (string) adapters
          category: categoryId as never,
          client: p.clientName,
          industry: p.industry,
          network: extra.network,
          duration: p.duration,
          metrics: parseMetrics(p.keyMetrics || ''),
          overview: p.overview,
          problem: p.problem,
          solution: p.solution,
          outcome: extra.outcome,
          thumbnail: thumb?.id,
          heroImage: hero?.id,
          resultsImage: results?.id,
        },
      })
    }
  } else {
    console.warn('⚠ seed-assets/projects.json not found — skipping affiliate case studies')
  }

  // ── Influencer case studies ───────────────────────────────────
  let infOrder = 100
  for (const s of influencerSeeds) {
    const slug = slugify(s.title)
    const exists = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (exists.docs.length) {
      console.log(`✓ exists: ${s.handle}`)
      infOrder++
      continue
    }
    console.log(`＋ influencer: ${s.handle}`)
    const categoryId = await ensureCategory(payload, s.category, 'influencer')
    const videoDoc = s.videoFile
      ? await uploadFromFile(
          payload,
          path.join(ASSETS, 'videos', s.videoFile),
          `${s.handle} × ${s.brandPartner} — campaign video`,
        )
      : null
    await payload.create({
      collection: 'case-studies',
      data: {
        title: s.title,
        slug,
        type: 'influencer',
        featured: Boolean(s.featured),
        order: infOrder++,
        category: categoryId as never,
        client: s.brandPartner,
        industry: s.category,
        duration: 'Single campaign',
        influencer: {
          handle: s.handle,
          platform: s.platform,
          followers: s.followers,
          brandPartner: s.brandPartner,
          brandUrl: s.brandUrl,
        },
        metrics: [
          { label: 'Followers', value: s.followers },
          { label: 'Platform', value: 'Instagram' },
          { label: 'Niche', value: s.category },
          { label: 'Brand', value: s.brandPartner },
        ],
        overview: s.overview,
        outcomes: s.outcomes.map((text) => ({ text })),
        videos: videoDoc
          ? [{ source: 'upload' as const, video: videoDoc.id, caption: `${s.handle} for ${s.brandPartner}` }]
          : [],
      },
    })
  }

  // ── Reviews ───────────────────────────────────────────────────
  let revOrder = 0
  for (const r of reviewSeeds.videos) {
    const exists = await payload.find({
      collection: 'reviews',
      where: { and: [{ reviewerName: { equals: r.reviewerName } }, { type: { equals: 'video' } }] },
      limit: 5,
    })
    if (exists.docs.some((d) => (d as { role?: string }).role === r.role)) {
      console.log(`✓ exists: video review — ${r.reviewerName} (${r.role})`)
      revOrder++
      continue
    }
    console.log(`＋ video review: ${r.reviewerName} (${r.role})`)
    const media = await uploadFromFile(
      payload,
      path.join(ASSETS, 'videos', r.file),
      `Video review — ${r.reviewerName} (${r.role})`,
    )
    if (!media) continue
    await payload.create({
      collection: 'reviews',
      data: {
        reviewerName: r.reviewerName,
        role: r.role,
        type: 'video',
        videoSource: 'upload',
        video: media.id,
        rating: 5,
        featured: true,
        order: revOrder++,
      },
    })
  }
  for (const r of reviewSeeds.images) {
    const exists = await payload.find({
      collection: 'reviews',
      where: { and: [{ reviewerName: { equals: r.reviewerName } }, { type: { equals: 'image' } }] },
      limit: 1,
    })
    if (exists.docs.length) {
      console.log(`✓ exists: image review — ${r.reviewerName}`)
      revOrder++
      continue
    }
    console.log(`＋ image review: ${r.reviewerName}`)
    const media = await uploadFromFile(
      payload,
      path.join(ASSETS, 'images', r.file),
      `Review screenshot — ${r.reviewerName}`,
    )
    if (!media) continue
    await payload.create({
      collection: 'reviews',
      data: {
        reviewerName: r.reviewerName,
        role: r.role,
        type: 'image',
        image: media.id,
        rating: 5,
        featured: true,
        order: revOrder++,
      },
    })
  }

  const counts = await Promise.all([
    payload.count({ collection: 'case-studies' }),
    payload.count({ collection: 'categories' }),
    payload.count({ collection: 'reviews' }),
    payload.count({ collection: 'media' }),
  ])
  console.log(
    `\nDone — ${counts[0].totalDocs} case studies · ${counts[1].totalDocs} categories · ${counts[2].totalDocs} reviews · ${counts[3].totalDocs} media files`,
  )
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
