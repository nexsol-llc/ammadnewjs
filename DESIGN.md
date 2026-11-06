# M. Ammad — Brand & Social Content Design Guide

Last reviewed: 6 November 2026  
Repository: nexsol-llc/ammadnewjs  
Portfolio: https://www.ammadd.com

## Purpose and source of truth

Read this file before creating social media copy, carousels, graphics, or service promotions for M. Ammad. Use it to keep future content consistent with the portfolio.

Existing brand facts come from the live portfolio and these repository files:
- `src/lib/site.ts`: positioning, services, contact links, networks, process, and headline claims.
- `src/app/(frontend)/globals.css`: colors, gradients, typography, cards, and visual effects.
- `src/app/(frontend)/layout.tsx`: font configuration.
- `src/components/sections/ServicesSection.tsx`: service presentation and diagrams.

The social layouts, publishing mix, and example copy below are proposed working guidelines, not an existing published brand manual. Recheck live information before each campaign. CMS content can differ from repository defaults.

## Brand identity

- Public name: **M. Ammad**. Use M.AMMAD as a compact text signature consistent with the website; do not invent a new logo.
- Role: independent affiliate and influencer marketing partner.
- Audience: e-commerce founders, SaaS founders, marketing leaders, and partnership managers.
- Main promise: build and manage a partner channel with clear commercial measurement.
- Differentiator: direct involvement by the person clients hire.
- Primary language: English. Use British spelling consistently, such as personalised and optimisation.
- Perspective: first person singular, “I”, for personal expertise and services.
- Markets mentioned in the repository: US, UK, DACH, and Benelux. Adapt examples to the prospect's market.
- Relevant sectors include skincare, beauty, fashion, home, food, fitness, luxury, and SaaS. Do not imply identical experience or results across every sector.

## Service messaging

| Service | What to communicate | Useful content topics |
| --- | --- | --- |
| Affiliate Program Management | Program setup, network fit, commission design, recruitment, onboarding, tracking, reporting, and optimisation | Launch checklist; commission economics; inactive affiliates; seasonal planning; migration decisions |
| Influencer Marketing | Creator selection, campaign planning, negotiation, contracts, content coordination, rights, and outcome measurement | Audience fit; creator briefs; usage rights; campaign KPIs; repeat partnerships |
| Partnership Management | Ongoing communication, partner retention, tier adjustments, reactivation, placements, and payout oversight | Monthly review routine; retention; dormant partner diagnosis; partner segmentation |
| Influencer Outreach | A repeatable process from niche research through personalised contact, follow-up, negotiation, and onboarding | Outreach mistakes; creator qualification; follow-up structure; pipeline reporting |

Distinguish full campaign management from outreach-only support. Do not advertise web development, SEO, general paid advertising, graphic design, or other services unless Ammad adds them to the offer.

Mention relevant networks when useful: Awin, Impact.com, CJ Affiliate, Rakuten, ADCELL, Daisycon, Everflow, PartnerStack, and Refersion. The repository also lists ShareASale; verify its current availability and relationship to Awin before recommending it as a standalone option. Influencer platforms include Instagram, TikTok, and YouTube. Platform familiarity does not imply official certification or endorsement.

## Voice and writing

Sound like an experienced operator explaining a practical decision: clear, specific, calm, and commercially aware.

- Start with one recognisable business problem.
- Explain the action and why it matters.
- Prefer concrete terms: commission, qualified partner, activation, margin, attribution, retention.
- Explain specialist terms when speaking to founders unfamiliar with affiliate programs.
- Keep graphic headlines short: usually 5–10 words.
- Give each post one main idea and one call to action.
- Avoid hype, fabricated urgency, guaranteed revenue, and unsupported comparisons.
- Avoid stock phrases such as “skyrocket your growth”, “game-changing”, and “unlock limitless potential”.
- Do not frame every post as a sales pitch. Teach a useful process before offering help.

Example:
“Your affiliate program has sign-ups. How many partners are actually active? Review onboarding, first-sale support, and partner fit before increasing commissions.”

## Visual system: extracted website tokens

| Role | Value | Social use |
| --- | --- | --- |
| Primary ink | #0A0A14 | Headlines; occasional dark background |
| Secondary ink | #14142B | Dark cards and supporting surfaces |
| Body text | #3A3B4F | Main text on light backgrounds |
| Muted text | #6B6C82 | Secondary labels; check contrast at final size |
| White | #FFFFFF | Default canvas and cards |
| Alternate surface | #F7F7FC | Quiet background |
| Soft surface | #F0F0FA | Panels |
| Border | #E9E9F2 | Subtle card outlines |
| Strong border | #DCDCEA | Dividers |
| Primary violet | #6D4AFF | Emphasis and brand accents |
| Deep violet | #5B33F5 | CTA areas |
| Dark violet | #4A25D9 | Small accent text on pale backgrounds |
| Pale violet | #F2EEFF | Category chips and soft highlights |
| Lavender | #AB93FF | Accent on dark backgrounds |
| Mint | #10B981 | Positive indicators, sparingly |
| Deep mint | #047857 | Positive labels on light backgrounds |

Website headline gradient: 96deg, #6D4AFF → #8B5CF6 → #D946EF.  
Dark-background gradient: 96deg, #AB93FF → #C4B5FD → #F5A9F0.

Use white or pale backgrounds as the default, dark ink for readable text, and violet for hierarchy. Use gradients on a few large words or restrained background glows. Keep paragraphs on solid surfaces. Mint indicates a meaningful positive state; it is not a second primary brand color.

### Typography

- Headlines: **Plus Jakarta Sans**, weight 700; slightly tight tracking (website: -0.028em).
- Body: **Inter**, regular or medium.
- Labels: Inter semibold; uppercase only for short category labels.
- Numbers: large, clearly labelled, with currency and timeframe when applicable.
- Do not use more than these two font families.

### Shapes and imagery

Carry over the website's rounded cards, pill labels, fine borders, soft violet glows, and simple flow diagrams. Website card radius is 1.25rem; scale the visual proportion for social canvases.

Use diagrams showing relationships such as brand → partner → customer, or research → outreach → onboarding → activation. Avoid decorative charts that imply measured results.

Existing portrait assets: `public/profile.webp`, `public/avatar.webp`, and `public/ammad-wide.webp`. Inspect the chosen file before use and preserve the person's appearance. Use actual approved client assets for case studies. Do not invent testimonials, client screenshots, or network dashboards.

## Proposed social layout specifications

These are production defaults, not claims about platform requirements. Confirm the destination's current upload rules before export.

| Format | Working canvas | Layout |
| --- | --- | --- |
| Feed graphic or carousel | 1080 × 1350 px | Small category label; strong headline; one diagram or takeaway; footer |
| Square variant | 1080 × 1080 px | Shorter headline and fewer supporting lines |
| Story or vertical cover | 1080 × 1920 px | Central message; generous clearance for interface overlays |
| Landscape preview | 1200 × 630 px | Short headline; portrait or single visual; brand signature |

For a 1080px-wide feed graphic, start with 72px outer margins, 72–96px headlines, 32–40px supporting copy, and 24–28px footer text. Shorten copy before shrinking it. Preview at approximately 360px wide to confirm mobile readability.

Use a consistent footer: M. Ammad · ammadd.com. On carousels, include page numbers. Keep all slides the same canvas size.

### Reusable layouts

1. **Educational card:** category label → problem headline → three practical checks → small CTA.
2. **Service spotlight:** service name → client problem → three deliverables → next step.
3. **Process carousel:** cover → diagnosis → action steps → measurement → CTA. Usually 5–7 slides, one idea per slide.
4. **Case study:** client and context → challenge → work performed → documented result and period → source → CTA.
5. **Personal insight:** approved portrait → operator observation → practical lesson → discussion question.

## Content pillars and suggested mix

Across ten posts, begin with four educational posts, two process posts, two service posts, one verified case study, and one personal insight. This is a starting mix; adjust based on qualified enquiries and audience response.

Suggested topics:
- What to check before launching an affiliate program.
- Why recruitment and activation need separate plans.
- How to choose commissions around contribution margin.
- What belongs in a creator campaign brief.
- How to prioritise dormant partners for reactivation.
- Why audience fit matters more than follower count.
- What a useful weekly partner report should answer.
- How network choice depends on geography and partner type.
- What happens during the first 90 days of an engagement.
- When ongoing partnership management becomes the bottleneck.

## Proof and claims

The repository currently presents $350K+ tracked partner revenue, 30.7x best campaign ROAS, 700+ partners recruited, 1,000+ brands scaled, and 10+ years of experience. These are portfolio claims, not independently audited facts.

Before using any numerical claim:
- Confirm its current accuracy and underlying evidence.
- Preserve whether it is cumulative, campaign-specific, historical, or a best result.
- Include relevant client, currency, period, and measurement basis.
- Never present best campaign ROAS as an expected result for every client.
- Do not equate revenue, profit, ROAS, ROI, and incremental revenue.
- Do not invent missing periods, spend totals, baselines, or attribution methods.
- Do not turn calculator projections into realised client outcomes.
- If evidence is unavailable, write a useful process post without a numerical claim.

The portfolio's Yumi Kim listing contains a £ headline and a $ metric; resolve the currency against the original evidence before reusing that result. Avoid copying animated zero counters or illustrative service-diagram numbers as proof.

Performance-based affiliate commissions do not mean every program cost is payable only on a sale. Clarify management fees, network fees, creator fees, and other costs when discussing pricing.

## Calls to action and destinations

Choose one CTA appropriate to the post:
- Education: ask a specific question or invite the reader to save the checklist.
- Consideration: invite the reader to explore relevant case studies.
- Service enquiry: invite a free growth call or audit.

Verified repository destinations:
- Portfolio: https://www.ammadd.com
- Services: https://www.ammadd.com/services
- Case studies: https://www.ammadd.com/case-studies
- Free audit: https://www.ammadd.com/free-audit
- Contact: https://www.ammadd.com/contact
- Booking: https://calendly.com/partner-ammadd/30min
- Email: partner@ammadd.com
- LinkedIn: https://www.linkedin.com/in/affiliate-manager-ammad/

Confirm links before publishing. Use “link in bio” only when that destination is actually configured. Do not promise downloadable resources, automated DM replies, free deliverables, or response times that have not been arranged.

## Starter copy: original examples

### Affiliate program management

**Graphic:** Build the program before recruiting partners.

**Caption:** A partner list needs a structure behind it. Before recruitment, I focus on network fit, commission economics, tracking, and onboarding. That gives partners a clearer route from joining to making their first sale. Planning a launch? Explore my affiliate program management services at ammadd.com/services.

### Influencer marketing

**Graphic:** Start with audience fit.

**Caption:** A creator can have a strong following and still be a poor match for your brand. I review the audience, content style, campaign objective, and measurement plan before outreach. Which part of creator selection is hardest for your team?

### Partnership management

**Graphic:** Your existing partners need a plan.

**Caption:** When partner activity slows, I look at communication, promotional opportunities, onboarding gaps, and incentives. A structured review helps identify who needs support and which relationships deserve more attention. Explore how I manage partner programs at ammadd.com/services.

### Influencer outreach

**Graphic:** Give creators a reason to reply.

**Caption:** Personalised outreach starts with research. Explain why the creator fits, what the collaboration involves, and the next step. Then follow up with context. I help brands manage that process from sourcing through onboarding. Book a free growth call through ammadd.com.

## Reusable brief for future work

“Read DESIGN.md in nexsol-llc/ammadnewjs. Create [number] [platform] posts promoting [service] to [audience]. The goal is [education/enquiries/bookings]. Use [topic], [format], and [verified evidence or none]. Deliver headline, on-image copy, caption, CTA, alt text, and a visual layout brief for each post. Match the documented colors and fonts. Flag unverified claims and missing assets. Do not publish.”

If the brief omits a platform, default to a LinkedIn caption and a 1080 × 1350 graphic concept. Treat this as a working assumption and state it. Create content drafts only unless publishing is explicitly requested.

## Review checklist

- Does the post promote a documented service to a clear audience?
- Does it sound like M. Ammad speaking personally?
- Does it explain one useful idea with one appropriate CTA?
- Are colors, fonts, layout, and signature consistent?
- Is all text legible at mobile preview size?
- Are results accurately labelled and traceable?
- Are client assets and quotations authentic and approved for reuse?
- Are links current and alt text included?
- Have all placeholders been removed?

Update this document when services, positioning, visual tokens, contact details, or verified proof change.
