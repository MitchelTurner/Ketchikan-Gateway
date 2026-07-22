/**
 * Post-build SEO assets: sitemap index + child sitemaps, title collision check,
 * and prerendered HTML shells with correct canonical/meta/JSON-LD for crawlers.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const SITE = 'https://ktnport.com'

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

function shipSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function displayShipName(name) {
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w) =>
      ['ncl', 'ng', 'ss'].includes(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(' ')
}

function formatLongDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function ensureDir(p) {
  mkdirSync(p, { recursive: true })
}

function writeSitemap(name, urls) {
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
  writeFileSync(join(dist, name), xml)
}

function injectShell(indexHtml, { title, description, canonical, robots, jsonLd, h1, noscript }) {
  let html = indexHtml
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${esc(description)}" />`,
  )
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${esc(canonical)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${esc(title)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${esc(description)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${esc(canonical)}" />`,
  )
  const robotsTag = `<meta name="robots" content="${esc(robots)}" />`
  const ld = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
  const ns = `<noscript><main><h1>${esc(h1)}</h1>${noscript}</main></noscript>`
  html = html.replace(
    '</head>',
    `${robotsTag}\n    ${ld}\n  </head>`,
  )
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${ns}`)
  return html
}

function writePage(pathSeg, html) {
  const dir = pathSeg === '/' ? dist : join(dist, pathSeg.replace(/^\//, ''))
  ensureDir(dir)
  writeFileSync(join(dir, 'index.html'), html)
}

const visits = JSON.parse(readFileSync(join(root, 'public/ship_visits.json'), 'utf8'))
const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8')
const today = new Date().toISOString().slice(0, 10)
const lastmod = today

const dates = [...new Set(visits.map((v) => v.date))].sort()
const ships = [...new Set(visits.map((v) => v.ship))].sort()
const years = [...new Set(dates.map((d) => d.slice(0, 4)))].sort()
const yearMonths = [
  ...new Set(dates.map((d) => `${d.slice(0, 4)}-${d.slice(5, 7)}`)),
].sort()

const titles = new Map()
function trackTitle(title, path) {
  if (titles.has(title)) {
    console.error(`Duplicate title:\n  ${title}\n  ${titles.get(title)}\n  ${path}`)
    process.exitCode = 1
  }
  titles.set(title, path)
}

// --- core pages ---
const coreUrls = [
  { path: '/', title: 'Cruise Ships in Ketchikan Today — Live Port Schedule | KTN Port', desc: 'See how many cruise ships are in Ketchikan today, estimated passengers ashore, arrival times, and whether downtown will be quiet or packed.', priority: '1.0', changefreq: 'hourly' },
  { path: '/schedule', title: 'Ketchikan Cruise Ship Schedule & Calendar | KTN Port', desc: 'Browse the Ketchikan cruise ship schedule by year, month, or day.', priority: '0.9', changefreq: 'daily' },
  { path: '/ships', title: 'Cruise Ships Calling at Ketchikan | KTN Port', desc: 'Index of cruise ships that call at Ketchikan.', priority: '0.8', changefreq: 'weekly' },
  { path: '/stats', title: 'Ketchikan Cruise Passenger Statistics | KTN Port', desc: 'Season totals, busiest cruise days, and passenger trends.', priority: '0.8', changefreq: 'weekly' },
  { path: '/berths', title: 'Ketchikan Cruise Ship Berths — Which Ships Dock Where', desc: 'Downtown berths 1–4, Ward Cove, and anchorage explained.', priority: '0.7', changefreq: 'monthly' },
  { path: '/guides', title: 'Guides to Planning Around Ketchikan Cruise Crowds | KTN Port', desc: 'Things to do, attractions, and practical guides for planning around Ketchikan cruise crowds.', priority: '0.7', changefreq: 'monthly' },
  { path: '/about', title: 'About KTN Port | KTN Port', desc: 'Unofficial public tool reporting Ketchikan cruise passenger traffic.', priority: '0.5', changefreq: 'yearly' },
  { path: '/data-sources', title: 'Data Sources & Methodology | KTN Port', desc: 'Where schedule and capacity data come from.', priority: '0.5', changefreq: 'yearly' },
  { path: '/api', title: 'KTN Port Data Access | KTN Port', desc: 'How to access Ketchikan cruise schedule data.', priority: '0.3', changefreq: 'yearly' },
  { path: '/guides/things-to-do-in-ketchikan', title: 'Things to Do in Ketchikan Alaska | KTN Port', desc: 'Ketchikan attractions and things to see — Creek Street, rainforest walks, hiking trails, totem parks, and timing tips around cruise crowds.', priority: '0.8', changefreq: 'monthly' },
  { path: '/guides/best-time-to-visit-ketchikan', title: 'Best Time to Visit Ketchikan Without Crowds | KTN Port', desc: 'How to time a Ketchikan visit around the cruise calendar.', priority: '0.7', changefreq: 'monthly' },
  { path: '/guides/ketchikan-berth-locations-explained', title: 'Ketchikan Berth Locations Explained | KTN Port', desc: 'Downtown berths vs Ward Cove vs anchorage.', priority: '0.7', changefreq: 'monthly' },
  { path: '/guides/ketchikan-shore-excursions-timing', title: 'Ketchikan Shore Excursions Timing | KTN Port', desc: 'When to book tours around ship windows and rain.', priority: '0.7', changefreq: 'monthly' },
]

const scheduleUrls = []
for (const y of years) {
  const path = `/schedule/${y}`
  const title = `Ketchikan Cruise Ship Calendar ${y} | KTN Port`
  trackTitle(title, path)
  scheduleUrls.push({
    loc: `${SITE}${path}`,
    lastmod,
    changefreq: 'weekly',
    priority: '0.8',
  })
  writePage(
    path,
    injectShell(indexHtml, {
      title,
      description: `${y} cruise season calendar for Ketchikan.`,
      canonical: `${SITE}${path}`,
      robots: 'index, follow',
      h1: `Ketchikan Cruise Ship Calendar ${y}`,
      noscript: `<p>Browse months in the ${y} Ketchikan cruise season.</p><p><a href="/schedule">Full schedule</a></p>`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Schedule', item: `${SITE}/schedule` },
          { '@type': 'ListItem', position: 3, name: String(y), item: `${SITE}${path}` },
        ],
      },
    }),
  )
}

for (const ym of yearMonths) {
  const y = ym.slice(0, 4)
  const mi = Number(ym.slice(5, 7)) - 1
  const mslug = MONTHS[mi]
  const path = `/schedule/${y}/${mslug}`
  const label = mslug.charAt(0).toUpperCase() + mslug.slice(1)
  const title = `Ketchikan Cruise Ship Schedule — ${label} ${y}`
  trackTitle(title, path)
  scheduleUrls.push({
    loc: `${SITE}${path}`,
    lastmod,
    changefreq: 'weekly',
    priority: '0.8',
  })
  writePage(
    path,
    injectShell(indexHtml, {
      title,
      description: `Full ${label} ${y} cruise ship calendar for Ketchikan.`,
      canonical: `${SITE}${path}`,
      robots: 'index, follow',
      h1: title,
      noscript: `<p>${label} ${y} Ketchikan cruise calendar.</p>`,
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: title, url: `${SITE}${path}` },
    }),
  )
}

for (const date of dates) {
  const dayVisits = visits.filter((v) => v.date === date)
  const n = dayVisits.length
  const p = dayVisits.reduce((s, v) => s + (v.estimated_passengers || 0), 0)
  const when = formatLongDate(date)
  const path = `/schedule/${date}`
  const title = `Ketchikan Cruise Ships ${when.replace(/,\s*\d{4}$/, '')} — ${n} Ships, ${p.toLocaleString()} Passengers`
  trackTitle(title, path)
  scheduleUrls.push({
    loc: `${SITE}${path}`,
    lastmod,
    changefreq: 'weekly',
    priority: date >= today ? '0.9' : '0.6',
  })
  const events = dayVisits.map((v) => ({
    '@type': 'Event',
    name: `${displayShipName(v.ship)} arrival`,
    startDate: `${v.date}T${(v.arrival || '07:00')}:00-08:00`,
    endDate: `${v.date}T${(v.departure || '17:00')}:00-08:00`,
    location: {
      '@type': 'Place',
      name: `Berth ${v.berth || 'TBD'}, Ketchikan`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ketchikan',
        addressRegion: 'AK',
        addressCountry: 'US',
      },
    },
  }))
  const rows = dayVisits
    .map(
      (v) =>
        `<tr><td>${esc(displayShipName(v.ship))}</td><td>${esc(v.berth)}</td><td>${esc(v.arrival)}</td><td>${esc(v.departure)}</td><td>${(v.estimated_passengers || 0).toLocaleString()}</td></tr>`,
    )
    .join('')
  writePage(
    path,
    injectShell(indexHtml, {
      title,
      description: `${n} cruise ships are scheduled in Ketchikan on ${when.replace(/^\w+,\s*/, '')} carrying up to ${p.toLocaleString()} passengers. See arrival times, berths, and how busy downtown will be.`,
      canonical: `${SITE}${path}`,
      robots: 'index, follow',
      h1: `Cruise Ships in Ketchikan — ${when}`,
      noscript: `<p>${n} ships, up to ${p.toLocaleString()} passengers (estimated).</p><table><caption>Schedule ${esc(date)} (Alaska time)</caption><thead><tr><th>Ship</th><th>Berth</th><th>Arrival</th><th>Departure</th><th>Passengers</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No ships scheduled</td></tr>'}</tbody></table>`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Schedule', item: `${SITE}/schedule` },
            { '@type': 'ListItem', position: 3, name: when, item: `${SITE}${path}` },
          ],
        },
        ...events,
      ],
    }),
  )
}

const shipUrls = []
for (const ship of ships) {
  const slug = shipSlug(ship)
  const path = `/ships/${slug}`
  const calls = visits.filter((v) => v.ship === ship)
  const cap = Math.max(...calls.map((v) => v.estimated_passengers || 0))
  const title = `${displayShipName(ship)} in Ketchikan — Schedule, Berth & Passenger Capacity`
  trackTitle(title, path)
  shipUrls.push({
    loc: `${SITE}${path}`,
    lastmod,
    changefreq: 'weekly',
    priority: '0.7',
  })
  const list = calls
    .map(
      (v) =>
        `<li><a href="/schedule/${v.date}">${esc(formatLongDate(v.date))}</a> — ${esc(v.arrival)}–${esc(v.departure)}, berth ${esc(v.berth)}</li>`,
    )
    .join('')
  writePage(
    path,
    injectShell(indexHtml, {
      title,
      description: `${displayShipName(ship)} carries up to ${cap.toLocaleString()} passengers and calls at Ketchikan ${calls.length} times in the loaded schedule.`,
      canonical: `${SITE}${path}`,
      robots: 'index, follow',
      h1: `${displayShipName(ship)} in Ketchikan`,
      noscript: `<p>Up to ${cap.toLocaleString()} passengers. ${calls.length} calls.</p><ul>${list}</ul>`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Ships', item: `${SITE}/ships` },
          { '@type': 'ListItem', position: 3, name: displayShipName(ship), item: `${SITE}${path}` },
        ],
      },
    }),
  )
}

const coreSitemap = []
for (const p of coreUrls) {
  trackTitle(p.title, p.path)
  coreSitemap.push({
    loc: `${SITE}${p.path === '/' ? '/' : p.path}`,
    lastmod,
    changefreq: p.changefreq,
    priority: p.priority,
  })
  if (p.path === '/') {
    // overwrite root index with SEO home meta (keep SPA entry)
    writeFileSync(
      join(dist, 'index.html'),
      injectShell(indexHtml, {
        title: p.title,
        description: p.desc,
        canonical: `${SITE}/`,
        robots: 'index, follow',
        h1: 'Cruise Ships in Ketchikan Today',
        noscript:
          '<p>Live Ketchikan cruise ship schedule and downtown crowd forecast.</p><p><a href="/schedule">Browse the schedule</a></p>',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'KTN Port',
          url: SITE,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE}/schedule/{search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      }),
    )
  } else {
    writePage(
      p.path,
      injectShell(indexHtml, {
        title: p.title,
        description: p.desc,
        canonical: `${SITE}${p.path}`,
        robots: 'index, follow',
        h1: p.title.split(' | ')[0],
        noscript: `<p>${esc(p.desc)}</p>`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: p.title,
          url: `${SITE}${p.path}`,
        },
      }),
    )
  }
}

for (const y of years) {
  const path = `/stats/${y}`
  const title = `Ketchikan Cruise Passenger Statistics — ${y} Season`
  trackTitle(title, path)
  coreSitemap.push({
    loc: `${SITE}${path}`,
    lastmod,
    changefreq: 'weekly',
    priority: '0.7',
  })
  writePage(
    path,
    injectShell(indexHtml, {
      title,
      description: `Season totals and busiest days for Ketchikan cruise traffic in ${y}.`,
      canonical: `${SITE}${path}`,
      robots: 'index, follow',
      h1: title,
      noscript: `<p>${y} passenger statistics. <a href="/stats">All stats</a></p>`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: `Ketchikan cruise passenger traffic ${y}`,
        url: `${SITE}${path}`,
      },
    }),
  )
}

writeSitemap('sitemap-core.xml', coreSitemap)
writeSitemap('sitemap-schedule.xml', scheduleUrls)
writeSitemap('sitemap-ships.xml', shipUrls)
writeSitemap('sitemap-guides.xml', [
  ...coreUrls
    .filter((p) => p.path.startsWith('/guides'))
    .map((p) => ({
      loc: `${SITE}${p.path}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7',
    })),
])

writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap-core.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
  <sitemap><loc>${SITE}/sitemap-schedule.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
  <sitemap><loc>${SITE}/sitemap-ships.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
  <sitemap><loc>${SITE}/sitemap-guides.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
</sitemapindex>
`,
)

// SPA host fallbacks
writeFileSync(
  join(dist, '_redirects'),
  `# Netlify-style
/day/*  /schedule/:splat  301
/calendar  /schedule  301
/today  /  301
`,
)

writeFileSync(
  join(dist, 'static.json'),
  JSON.stringify(
    {
      root: 'dist',
      clean_urls: true,
      routes: {
        '/**': 'index.html',
      },
    },
    null,
    2,
  ),
)

if (existsSync(join(root, 'public/robots.txt'))) {
  cpSync(join(root, 'public/robots.txt'), join(dist, 'robots.txt'))
}

console.log(
  `SEO generate: ${scheduleUrls.length} schedule URLs, ${shipUrls.length} ships, ${titles.size} titles tracked`,
)
if (process.exitCode) {
  console.error('Title collision check failed.')
  process.exit(1)
}
