# ammadd.com — Portfolio & Funnel Site

Personal portfolio and marketing funnel for **M. Ammad** — affiliate & influencer marketing for
e-commerce and SaaS brands.

Built with **Next.js 15** + **Payload CMS 3** (admin panel embedded at `/admin`), Tailwind CSS 4,
and Framer Motion.

## What's inside

| Area | Details |
| --- | --- |
| **Pages** | Home (funnel), Services, Case Studies (+ per-type & per-category pages, individual case study pages), Testimonials, About, Contact |
| **Admin (`/admin`)** | Case Studies (affiliate / influencer, multi-video per project), Categories, Reviews (image / video), Media, Leads, Contact inbox, Users |
| **Hero** | Circular network slider — two counter-rotating rings of affiliate networks & creator platforms, with the active one highlighted in the centre |
| **Revenue calculator** | Free tool on the home page. Visitor enters website, monthly visitors, orders, average order value, commission % and (optionally) their network; a name + email box unlocks the projection. Every submission is saved to **Leads** with both the inputs and the projected numbers |
| **Road map** | Five-phase engagement timeline (first 90 days → month 6) with a scroll-linked progress line |
| **Case studies** | Two types. Influencer case studies support uploading one or more campaign videos, or embedding YouTube / Instagram / TikTok links |
| **Reviews** | Image (screenshot) reviews and video reviews — on the home page and the dedicated Testimonials page |
| **Contact form** | Saves every submission to the Contact Submissions collection (visible in the admin) |

### The revenue calculator model

Projections come from `src/lib/calculator.ts`, using benchmarks from the managed programs in the
case studies: a partner program adds roughly 8–45% incremental sessions (scaled by how attractive
the commission is), and that traffic converts about 1.5x better than site average because it
arrives from editorial and review content. Tune the constants in that one file to change the model.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000  ·  admin at /admin
```

No configuration needed locally — with `DATABASE_URI` empty, content is stored in a local SQLite
file (`payload.db`) and uploads in `./media`. Both are gitignored.

### Seeding content

```bash
npm run seed
```

Idempotent (safe to re-run). Seeds 11 affiliate + 6 influencer case studies, categories, reviews,
and all media. Requires the `seed-assets/` folder (not in git — it holds the campaign videos and
legacy images). If no admin user exists yet, one is created and its credentials are printed.

## Production deployment (Vercel)

1. **Database — MongoDB Atlas** (free M0 cluster):
   create a cluster + database user, allow access from anywhere (0.0.0.0/0), and copy the
   connection string, e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ammad-portfolio`.
   No migrations are ever needed with MongoDB.
2. **Media — Vercel Blob**: Vercel Dashboard → Storage → Create Blob store → copy the
   `BLOB_READ_WRITE_TOKEN`. Large video uploads from the admin go directly to Blob
   (client uploads), bypassing Vercel's 4.5MB request limit.
3. **Import the repo** in Vercel and set the environment variables:

   | Variable | Value |
   | --- | --- |
   | `PAYLOAD_SECRET` | long random string |
   | `DATABASE_URI` | the Atlas connection string |
   | `BLOB_READ_WRITE_TOKEN` | from the Blob store |
   | `NEXT_PUBLIC_SITE_URL` | `https://ammadd.com` |

4. **Seed production** (one-time, from your machine): put the same values in `.env`, then
   `npm run seed`. Media uploads land in Vercel Blob, content in Atlas.
5. **Cloudflare**: point the domain's DNS to Vercel (CNAME → `cname.vercel-dns.com`, proxy ON or
   OFF both work; set SSL mode to **Full (strict)**).

Content edited in `/admin` appears on the site within ~2 minutes (ISR revalidation).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` / `npm start` | production build / serve |
| `npm run seed` | seed content (idempotent) |
| `npm run generate:types` | regenerate `src/payload-types.ts` after changing collections |
| `npm run generate:importmap` | regenerate the admin import map after adding admin components |

## Project layout

```
src/
  payload.config.ts        Payload CMS config (DB + storage adapters, collections)
  collections/             CaseStudies, Categories, Reviews, Media, ContactSubmissions, Users
  app/(frontend)/          public site (pages, layout, globals.css)
  app/(payload)/           admin UI + REST API routes
  components/              sections, cards, motion primitives, forms
  lib/                     site copy & constants (lib/site.ts), CMS data access (lib/cms.ts),
                           revenue projection model (lib/calculator.ts)
  seed/                    content seeder
```

To change site copy (hero hooks, services, FAQs, stats, contact links) edit `src/lib/site.ts`.
