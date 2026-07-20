import type { DayForecast, ShipVisit } from '../../types'
import { shipCapacity } from '../prediction'
import { BERTH_PLACES, resolveBerthPlace } from '../berths'
import { absoluteUrl, ORG_NAME, PLACE, SITE_NAME, SITE_URL } from './site'
import { displayShipName } from './slugs'

/** Alaska offset for summer cruise season (AKDT). Winter calls use AKST. */
export function alaskaOffsetForDate(isoDate: string): '-08:00' | '-09:00' {
  // DST in America/Anchorage: second Sunday March → first Sunday November
  const [y, m, d] = isoDate.split('-').map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d, 12))
  // Rough local DST check via formatter
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Anchorage',
    timeZoneName: 'shortOffset',
  }).formatToParts(utc)
  const tz = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-8'
  return tz.includes('-9') ? '-09:00' : '-08:00'
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: ORG_NAME,
    url: SITE_URL,
    description:
      'Public-facing reports of cruise ship passenger traffic in downtown Ketchikan, Alaska.',
    areaServed: {
      '@type': 'City',
      name: 'Ketchikan',
      containedInPlace: { '@type': 'State', name: 'Alaska' },
    },
  }
}

export function websiteJsonLd(withSearch = false) {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@type': 'Organization', name: ORG_NAME, url: SITE_URL },
  }
  if (withSearch) {
    base.potentialAction = {
      '@type': 'SearchAction',
      target: `${SITE_URL}/schedule/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    }
  }
  return base
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function datasetJsonLd(opts: {
  name: string
  description: string
  path: string
  temporalCoverage: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    creator: { '@type': 'Organization', name: ORG_NAME },
    temporalCoverage: opts.temporalCoverage,
    spatialCoverage: {
      '@type': 'Place',
      name: PLACE.name,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: PLACE.latitude,
        longitude: PLACE.longitude,
      },
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    dateModified: opts.dateModified,
  }
}

export function shipCallEventJsonLd(ship: ShipVisit) {
  const place = resolveBerthPlace(ship.berth)
  const offset = alaskaOffsetForDate(ship.date)
  const arrival = ship.arrival || '07:00'
  const departure = ship.departure || '17:00'
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${displayShipName(ship.ship)} arrival`,
    startDate: `${ship.date}T${arrival.length === 5 ? arrival : '07:00'}:00${offset}`,
    endDate: `${ship.date}T${departure.length === 5 ? departure : '17:00'}:00${offset}`,
    eventStatus: ship.cancelled
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: place.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ketchikan',
        addressRegion: 'AK',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: place.latitude,
        longitude: place.longitude,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: displayShipName(ship.ship),
    },
    description: `${displayShipName(ship.ship)} scheduled at ${place.name} with estimated capacity ${shipCapacity(ship).toLocaleString()} passengers.`,
  }
}

export function dayEventsJsonLd(day: DayForecast) {
  return day.ships.filter((s) => !s.cancelled).map(shipCallEventJsonLd)
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export { BERTH_PLACES }
