import { formatLongDate } from '../utils'
import { SITE_NAME } from './site'
import { displayShipName, monthLabel } from './slugs'

export type PageMeta = {
  title: string
  description: string
  canonicalPath: string
  h1: string
  robots?: string
  ogType?: string
  dateModified?: string
  /** Absolute or site-relative path for Open Graph / Twitter image */
  image?: string
}

export type MetaInput =
  | { type: 'home' }
  | {
      type: 'day'
      date: string
      shipCount: number
      passengers: number
      noindex?: boolean
    }
  | { type: 'month'; year: number; monthSlug: string }
  | { type: 'year'; year: number }
  | { type: 'scheduleHub' }
  | {
      type: 'ship'
      shipName: string
      capacity: number
      callCount: number
      year: number
    }
  | { type: 'ships' }
  | { type: 'stats'; year?: number }
  | { type: 'berths' }
  | {
      type: 'guide'
      title: string
      description: string
      slug: string
      image?: string
      dateModified?: string
    }
  | { type: 'guides' }
  | { type: 'about' }
  | { type: 'dataSources' }
  | { type: 'api' }
  | { type: 'notFound' }
  | { type: 'manage' }

function trunc(s: string, n: number): string {
  if (s.length <= n) return s
  return `${s.slice(0, n - 1).trimEnd()}…`
}

export function buildMeta(input: MetaInput): PageMeta {
  switch (input.type) {
    case 'home':
      return {
        title: trunc(
          `Cruise Ships in Ketchikan Today — Live Port Schedule | ${SITE_NAME}`,
          65,
        ),
        description:
          'See how many cruise ships are in Ketchikan today, estimated passengers ashore, arrival times, and whether downtown will be quiet or packed — updated with Alaska weather.',
        canonicalPath: '/',
        h1: 'Cruise Ships in Ketchikan Today',
      }
    case 'day': {
      const when = formatLongDate(input.date)
      const n = input.shipCount
      const p = input.passengers
      return {
        title: trunc(
          `Ketchikan Cruise Ships ${when.replace(/,\s*\d{4}$/, '')} — ${n} Ships, ${p.toLocaleString()} Passengers`,
          65,
        ),
        description: `${n} cruise ship${n === 1 ? '' : 's'} ${n === 0 ? 'are' : 'are'} scheduled in Ketchikan on ${when.replace(/^\w+,\s*/, '')} carrying up to ${p.toLocaleString()} passengers. See arrival times, berths, and how busy downtown will be.`,
        canonicalPath: `/schedule/${input.date}`,
        h1: `Cruise Ships in Ketchikan — ${when}`,
        robots: input.noindex ? 'noindex, follow' : 'index, follow',
      }
    }
    case 'month':
      return {
        title: trunc(
          `Ketchikan Cruise Ship Schedule — ${monthLabel(input.monthSlug)} ${input.year}`,
          65,
        ),
        description: `Full ${monthLabel(input.monthSlug)} ${input.year} cruise ship calendar for Ketchikan: daily ship counts, passenger capacity, and downtown crowd outlook.`,
        canonicalPath: `/schedule/${input.year}/${input.monthSlug}`,
        h1: `Ketchikan Cruise Ship Schedule — ${monthLabel(input.monthSlug)} ${input.year}`,
      }
    case 'year':
      return {
        title: trunc(
          `Ketchikan Cruise Ship Calendar ${input.year} | ${SITE_NAME}`,
          65,
        ),
        description: `${input.year} cruise season calendar for Ketchikan — month-by-month ship calls, passenger totals, and busiest days downtown.`,
        canonicalPath: `/schedule/${input.year}`,
        h1: `Ketchikan Cruise Ship Calendar ${input.year}`,
      }
    case 'scheduleHub':
      return {
        title: trunc(`Ketchikan Cruise Ship Schedule & Calendar | ${SITE_NAME}`, 65),
        description:
          'Browse the Ketchikan cruise ship schedule by year, month, or day. Passenger numbers, berths, and downtown crowd forecasts for Alaska’s port.',
        canonicalPath: '/schedule',
        h1: 'Ketchikan Cruise Ship Schedule',
      }
    case 'ship': {
      const name = displayShipName(input.shipName)
      return {
        title: trunc(
          `${name} in Ketchikan — Schedule, Berth & Passenger Capacity`,
          65,
        ),
        description: `${name} carries up to ${input.capacity.toLocaleString()} passengers and calls at Ketchikan ${input.callCount} time${input.callCount === 1 ? '' : 's'} in ${input.year}. See arrival and departure times by date.`,
        canonicalPath: `/ships/${shipSlugSafe(input.shipName)}`,
        h1: `${name} in Ketchikan`,
      }
    }
    case 'ships':
      return {
        title: trunc(`Cruise Ships Calling at Ketchikan | ${SITE_NAME}`, 65),
        description:
          'Index of cruise ships that call at Ketchikan — capacity, call counts, and links to every scheduled arrival this season.',
        canonicalPath: '/ships',
        h1: 'Cruise Ships in Ketchikan',
      }
    case 'stats':
      return {
        title: trunc(
          input.year
            ? `Ketchikan Cruise Passenger Statistics — ${input.year} Season`
            : `Ketchikan Cruise Passenger Statistics | ${SITE_NAME}`,
          65,
        ),
        description: input.year
          ? `Season totals, busiest days, and month-by-month passenger counts for Ketchikan cruise traffic in ${input.year}. Downloadable CSV.`
          : 'Season totals, busiest cruise days, and passenger trends for downtown Ketchikan. Downloadable CSV for researchers and journalists.',
        canonicalPath: input.year ? `/stats/${input.year}` : '/stats',
        h1: input.year
          ? `Ketchikan Cruise Passenger Statistics — ${input.year}`
          : 'Ketchikan Cruise Passenger Statistics',
      }
    case 'berths':
      return {
        title: trunc(
          'Ketchikan Cruise Ship Berths — Which Ships Dock Where',
          65,
        ),
        description:
          'Explainers for Ketchikan’s downtown berths 1–4, Ward Cove, and anchorage calls — and how berth choice changes downtown crowds.',
        canonicalPath: '/berths',
        h1: 'Ketchikan Cruise Ship Berths',
      }
    case 'guide':
      return {
        title: trunc(`${input.title} | ${SITE_NAME}`, 65),
        description: input.description,
        canonicalPath: `/guides/${input.slug}`,
        h1: input.title,
        ogType: 'article',
        image: input.image,
        dateModified: input.dateModified,
      }
    case 'guides':
      return {
        title: trunc(`Ketchikan Guides: Things to Do & Cruise Crowds | ${SITE_NAME}`, 65),
        description:
          'Ketchikan guides for visitors and locals: things to do and attractions, best time to visit, berth basics, and shore-excursion timing — tied to the live cruise schedule.',
        canonicalPath: '/guides',
        h1: 'Ketchikan Guides — Things to Do & Crowd Planning',
      }
    case 'about':
      return {
        title: trunc(`About KTN Port | ${SITE_NAME}`, 65),
        description:
          'KTN Port is an unofficial public tool from Mitchel Turner Dev, LLC that reports Ketchikan cruise passenger traffic and downtown crowd forecasts.',
        canonicalPath: '/about',
        h1: 'About KTN Port',
      }
    case 'dataSources':
      return {
        title: trunc(`Data Sources & Methodology | ${SITE_NAME}`, 65),
        description:
          'Where KTN Port gets cruise schedules and capacity figures, how passenger estimates work, and how often the data updates.',
        canonicalPath: '/data-sources',
        h1: 'Data Sources & Methodology',
      }
    case 'api':
      return {
        title: trunc(`KTN Port Data Access | ${SITE_NAME}`, 65),
        description:
          'How to access Ketchikan cruise schedule and passenger statistics from KTN Port for research and local planning.',
        canonicalPath: '/api',
        h1: 'Data Access',
      }
    case 'notFound':
      return {
        title: `Page Not Found | ${SITE_NAME}`,
        description: 'That page is not on KTN Port.',
        canonicalPath: '/404',
        h1: 'Page not found',
        robots: 'noindex, follow',
      }
    case 'manage':
      return {
        title: `Manage | ${SITE_NAME}`,
        description: 'Operator tools for KTN Port.',
        canonicalPath: '/manage',
        h1: 'Manage',
        robots: 'noindex, nofollow',
      }
    default:
      return {
        title: SITE_NAME,
        description: 'Ketchikan cruise passenger forecasts.',
        canonicalPath: '/',
        h1: SITE_NAME,
      }
  }
}

function shipSlugSafe(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Used by build-time title collision checks. */
export function collectStaticMetaTitles(): string[] {
  return [
    buildMeta({ type: 'home' }).title,
    buildMeta({ type: 'scheduleHub' }).title,
    buildMeta({ type: 'ships' }).title,
    buildMeta({ type: 'stats' }).title,
    buildMeta({ type: 'berths' }).title,
    buildMeta({ type: 'guides' }).title,
    buildMeta({ type: 'about' }).title,
    buildMeta({ type: 'dataSources' }).title,
    buildMeta({ type: 'api' }).title,
  ]
}
