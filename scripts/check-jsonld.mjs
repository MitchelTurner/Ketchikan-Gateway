/** Minimal JSON-LD shape checks for day Event + BreadcrumbList templates. */
import assert from 'node:assert/strict'

function alaskaEvent(ship) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${ship.ship} arrival`,
    startDate: `${ship.date}T${ship.arrival}:00-08:00`,
    endDate: `${ship.date}T${ship.departure}:00-08:00`,
    location: {
      '@type': 'Place',
      name: `Berth ${ship.berth}`,
      geo: { '@type': 'GeoCoordinates', latitude: 55.34, longitude: -131.65 },
    },
  }
}

function breadcrumbs(date) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ktnport.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Schedule',
        item: 'https://ktnport.com/schedule',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: date,
        item: `https://ktnport.com/schedule/${date}`,
      },
    ],
  }
}

const event = alaskaEvent({
  ship: 'NOORDAM',
  date: '2026-05-01',
  arrival: '07:00',
  departure: '13:00',
  berth: '2',
})
assert.equal(event['@type'], 'Event')
assert.match(event.startDate, /T07:00:00-0[89]:00$/)
assert.equal(event.location['@type'], 'Place')
assert.ok(event.location.geo.latitude)

const bc = breadcrumbs('2026-05-01')
assert.equal(bc['@type'], 'BreadcrumbList')
assert.equal(bc.itemListElement.length, 3)
assert.equal(bc.itemListElement[2].item, 'https://ktnport.com/schedule/2026-05-01')

console.log('JSON-LD shape checks passed')
