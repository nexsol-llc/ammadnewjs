/**
 * The site's canonical address, used for sitemaps, social previews and the
 * links inside lead emails.
 *
 * The environment variable wins, but it is normalised first: an http:// value
 * would publish insecure URLs to search engines, and a trailing slash would
 * produce doubled slashes in every generated link. Both are easy to get wrong
 * in a hosting dashboard and neither should be able to reach production.
 */
export const canonicalUrl = (() => {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '')
  if (!configured) return 'https://www.ammadd.com'
  // Local development is served over plain http, so leave it alone.
  if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(configured)) return configured
  return configured.replace(/^http:\/\//i, 'https://')
})()

export const site = {
  name: 'M. Ammad',
  shortName: 'AMMAD',
  domain: 'https://www.ammadd.com',
  title: 'M. Ammad — Affiliate & Influencer Marketing for E-commerce & SaaS Brands',
  description:
    'I build and scale affiliate & influencer programs that turn brand partnerships into a predictable revenue engine — $350K+ tracked partner revenue, up to 30.7x ROAS.',
  email: 'partner@ammadd.com',
  whatsapp: 'https://wa.me/923099996576',
  whatsappDisplay: '+92 309 9996576',
  linkedin: 'https://www.linkedin.com/in/affiliate-manager-ammad/',
  calendly:
    'https://calendly.com/partner-ammadd/30min?background_color=ffffff&text_color=0a0a14&primary_color=6d4aff',
}

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

/** Industry categories that type out one by one in the hero headline. Edit freely. */
export const heroCategories = [
  'e-commerce',
  'SaaS',
  'skincare',
  'health & fitness',
  'fashion',
  'beauty',
  'food & beverage',
  'home & furniture',
  'smart home',
  'baby care',
  'B2B & industrial',
  'luxury',
]

/** Networks & platforms shown in the hero orbit and the calculator select. */
export const networks = [
  { name: 'Awin', color: '#ff6b00' },
  { name: 'Impact.com', color: '#0b6bf2' },
  { name: 'ShareASale', color: '#1ba0e1' },
  { name: 'CJ Affiliate', color: '#00a0df' },
  { name: 'Rakuten', color: '#bf0000' },
  { name: 'ADCELL', color: '#e30613' },
  { name: 'Daisycon', color: '#f39200' },
  { name: 'Everflow', color: '#4f46e5' },
  { name: 'PartnerStack', color: '#0f172a' },
  { name: 'Refersion', color: '#ff5a5f' },
  { name: 'Instagram', color: '#e1306c' },
  { name: 'TikTok', color: '#fe2c55' },
  { name: 'YouTube', color: '#ff0000' },
]

export const brands = [
  'Leica Camera',
  'Coway',
  'Old Navy',
  'Yumi Kim',
  'Andy Anand',
  'Gotham Cigars',
  'LightPath LED',
  'Gains Nutrition',
  'Even Skyn',
  '48grams',
  'Tube Fitting',
  'Tuinmeubelwereld',
  'Abib',
  'Doll 10 Beauty',
  'Radiant XO',
  'Furtuna Skin',
]

export const headlineStats = [
  { value: 350, prefix: '$', suffix: 'K+', label: 'Tracked partner revenue' },
  { value: 30.7, prefix: '', suffix: 'x', label: 'Best campaign ROAS', decimals: 1 },
  { value: 700, prefix: '', suffix: '+', label: 'Partners recruited' },
  { value: 1000, prefix: '', suffix: '+', label: 'Brands scaled worldwide' },
]

/** The engagement road map — what happens, and when. */
export const roadmap = [
  {
    phase: 'Phase 01',
    window: 'Days 1 – 14',
    title: 'Audit & Blueprint',
    description:
      'I pull apart your margins, AOV, and competitor programs, then design a partner program built around your actual unit economics.',
    deliverables: ['Margin & AOV analysis', 'Network selection', 'Commission tier design', 'Recruitment target map'],
  },
  {
    phase: 'Phase 02',
    window: 'Days 15 – 30',
    title: 'Build & Launch',
    description:
      'Full technical setup on the right network, with attribution tracking that survives audits and creative assets partners actually want to use.',
    deliverables: ['Network setup / migration', 'Attribution & tracking', 'Creative asset pack', 'Partner landing pages'],
  },
  {
    phase: 'Phase 03',
    window: 'Days 31 – 60',
    title: 'Recruit & Activate',
    description:
      'Targeted Apollo and LinkedIn outreach brings in vetted niche creators and publishers — not coupon scrapers — and gets them selling fast.',
    deliverables: ['Outreach sequences', 'Partner vetting & onboarding', 'Promo codes & seeding', 'First-sale activation'],
  },
  {
    phase: 'Phase 04',
    window: 'Days 61 – 90',
    title: 'Optimise & Scale',
    description:
      'Segment partners by performance, reward the top tier, cut the dead weight, and layer seasonal campaigns onto a program that now has momentum.',
    deliverables: ['Performance tiering', 'Bonus structures', 'Seasonal campaigns', 'Weekly reporting cadence'],
  },
  {
    phase: 'Phase 05',
    window: 'Month 4 – 6+',
    title: 'Compound',
    description:
      'The channel becomes an asset you own: partners keep publishing, ranking and selling while your CPA falls and revenue compounds month over month.',
    deliverables: ['Partner retention', 'Content co-creation', 'New market expansion', 'Fraud & compliance guardrails'],
  },
]

export const faqs = [
  {
    q: 'How is this different from hiring an agency?',
    a: 'You get an operator, not an account manager. I personally run recruitment, activation, and reporting for your program — the same playbook that took brands like Leica Camera and Coway from dormant channels to five-figure monthly partner revenue. No junior staff, no 12-month lock-ins.',
  },
  {
    q: 'How fast will I see results?',
    a: 'Most programs have their first vetted partners live within 30 days and meaningful revenue within 60–90 days. LightPath LED generated $19K in under 30 days of tracked activity; Even Skyn hit $15K in its first 90 days at a 30.7x ROAS.',
  },
  {
    q: 'Do I need an existing affiliate program?',
    a: 'Either way works. Starting from zero, I build the whole thing — network selection, commission structure, tracking, creatives, and recruitment. If you already have a program, I audit before changing anything: where your current network fits your niche and target regions, I keep it and optimise what is already there. Where it does not, I will show you why and recommend a better-fitting network, then handle the migration so your existing partners come across with you.',
  },
  {
    q: 'How accurate is the revenue calculator?',
    a: 'It projects from real benchmarks across the programs in my case studies: partner traffic typically adds 8–45% incremental sessions and converts around 1.5x better than site average. It is a directional estimate, not a guarantee — on a call I will give you a far tighter number using your actual analytics.',
  },
  {
    q: 'Which networks and tools do you work with?',
    a: 'Awin, Impact.com, ShareASale, CJ, Rakuten, ADCELL, and Daisycon for affiliate infrastructure, with Apollo and LinkedIn powering partner recruitment. For influencer campaigns I manage sourcing, negotiation, contracts, and content across Instagram, TikTok, and YouTube.',
  },
  {
    q: 'What does it cost?',
    a: 'Every engagement is scoped to your brand — program size, network fees, and goals all matter. Book a free growth call and you will get a clear, fixed proposal with projected ROAS before you commit to anything.',
  },
]

export const services = {
  affiliate: {
    title: 'Affiliate Program Management',
    tagline: 'A performance channel you only pay when it sells.',
    description:
      'End-to-end affiliate program design, launch, and scaling — from commission architecture to partner recruitment and monthly optimisation.',
    features: [
      'Program setup & network migration',
      'Tiered commission architecture',
      'Partner recruitment & onboarding',
      'Fraud detection & compliance',
      'Seasonal campaign planning',
      'Weekly performance reporting',
    ],
  },
  influencer: {
    title: 'Influencer Marketing',
    tagline: 'Creators your customers already trust, selling for you.',
    description:
      'Full-cycle influencer campaigns across Instagram, TikTok, and YouTube — sourcing creators from micro to macro, negotiating rates, managing contracts, and tracking real outcomes.',
    features: [
      'Influencer identification & vetting',
      'Outreach, negotiation & contracts',
      'Campaign setup & content management',
      'UGC & whitelisting rights',
      'KPI & performance tracking',
      'Relationship nurturing & re-activation',
    ],
  },
  extras: [
    {
      title: 'Partnership Management',
      tagline: 'Your partners actively managed, not left to run themselves.',
      description:
        'The day-to-day work that keeps a program compounding after launch — partner communication, commission management, retention, and monthly performance optimisation.',
      features: [
        'Monthly partner check-ins',
        'Commission & tier adjustments',
        'Top-partner retention plans',
        'Dormant partner re-activation',
        'Placement & newsletter negotiation',
        'Payout and invoice oversight',
      ],
    },
    {
      title: 'Influencer Outreach',
      tagline: 'A creator pipeline that keeps filling itself.',
      description:
        'Done-for-you creator sourcing and outreach — research, first contact, negotiation, and onboarding, run as a repeatable pipeline instead of one-off DMs.',
      features: [
        'Niche & audience research',
        'Personalised first contact',
        'Rate negotiation & contracts',
        'Structured follow-up sequences',
        'Onboarding & brief handover',
        'Weekly pipeline reporting',
      ],
    },
  ],
}

export const aboutPoints = [
  'Operator, not an agency — I run your program personally',
  '10+ years across affiliate networks & creator partnerships',
  'Programs live on Awin, Impact.com, ADCELL & Daisycon',
  'Brands scaled across the US, UK, DACH and Benelux markets',
]
