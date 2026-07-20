import type { DayForecast } from '../../types'
import { formatLongDate } from '../utils'

/**
 * Varied 100–200 word prose for day pages. Branches on data conditions
 * so pages do not share identical boilerplate.
 */
export function dayContextualProse(
  day: DayForecast,
  seasonAvgPassengers: number,
): string {
  const active = day.ships.filter((s) => !s.cancelled)
  const n = active.length
  const p = day.scheduledPassengers
  const pred = day.predictedDowntown
  const when = formatLongDate(day.date)
  const vs =
    seasonAvgPassengers > 0
      ? p / seasonAvgPassengers
      : 1

  if (n === 0) {
    return [
      `No cruise ships are scheduled in Ketchikan on ${when}.`,
      `For locals, that usually means a calmer Front Street and easier parking near the docks.`,
      `Visitors still in town get a quieter look at Creek Street and the boardwalk without the mid-morning surge.`,
      `Schedules do change — check back if a late addition appears on the Port calendar.`,
      `Quiet calendar days are useful benchmarks when you compare against peak multi-ship overlaps later in the season.`,
    ].join(' ')
  }

  if (n === 1) {
    const ship = active[0]
    return [
      `${when} is a single-ship day: ${ship.ship} is due ${ship.arrival || 'in the morning'}–${ship.departure || 'afternoon'} at berth ${ship.berth || 'TBD'}.`,
      `Scheduled capacity is about ${p.toLocaleString()} passengers (estimated), with roughly ${pred.toLocaleString()} predicted ashore after weather.`,
      vs > 1.15
        ? `That is still above a typical season day for Ketchikan, so downtown will notice the call even without a second ship.`
        : vs < 0.7
          ? `Compared with the season average, this is a lighter day — a good window for errands or a leisurely shore walk.`
          : `Foot traffic should feel manageable for a port town day, especially outside the 10 a.m.–2 p.m. core.`,
      `Arrival and departure times are Alaska time; always confirm against the latest Port of Ketchikan PDF.`,
    ].join(' ')
  }

  const arrivals = active.map((s) => s.arrival).filter(Boolean).sort()
  const deps = active.map((s) => s.departure).filter(Boolean).sort()
  const window =
    arrivals[0] && deps[deps.length - 1]
      ? `from ${arrivals[0]} to ${deps[deps.length - 1]} Alaska time`
      : 'through the middle of the day'

  if (day.crowdLevel === 'extreme' || p >= 10000) {
    return [
      `${when} stacks ${n} ships with up to ${p.toLocaleString()} passengers on the schedule — one of the heavier footprints of the season.`,
      `Expect dense downtown traffic ${window}, especially if several vessels overlap at berths 1–4.`,
      `KTN Port’s weather-adjusted forecast puts about ${pred.toLocaleString()} ashore (${day.verdictLabel}).`,
      vs > 1.4
        ? `That sits well above the season average, so locals often shift errands earlier or later, and visitors should book tours with buffer time.`
        : `Even relative to other busy days, plan around the midday peak rather than fighting it.`,
      `Passenger figures are capacity estimates unless marked actual; ships cancel or swap on short notice.`,
    ].join(' ')
  }

  if (day.rainRelief >= 1500 || day.dropsCrowdBand) {
    return [
      `${n} ships are on the board for ${when} (${p.toLocaleString()} scheduled capacity), but wet weather is expected to keep a meaningful share of guests aboard.`,
      `The clear-day crowd band would read ${day.crowdLevel}; after rain relief the prediction is closer to ${pred.toLocaleString()} ashore (${day.verdictLabel}).`,
      `Downtown can still feel lively ${window}, yet outdoor excursion cancellations often thin the sidewalks compared with a sunny multi-ship day.`,
      `Use the hourly curve below to pick a lighter pocket — early morning and late afternoon are usually the softest.`,
    ].join(' ')
  }

  if (n >= 3 && day.crowdLevel === 'busy') {
    return [
      `A ${n}-ship day on ${when} points to busy downtown conditions without necessarily hitting extreme territory.`,
      `Up to ${p.toLocaleString()} passengers are scheduled; about ${pred.toLocaleString()} are predicted ashore after weather and berth weights.`,
      `Overlapping calls ${window} are what fill Front Street — stagger your plans around that window if you can.`,
      vs > 1.1
        ? `Passenger load runs a bit above the season average, so popular stops will queue.`
        : `Load is near a typical busy season day for Ketchikan.`,
      `Cross-check berths if you care about walk-off density: downtown 1–4 hit harder than Ward Cove or anchorage tenders.`,
    ].join(' ')
  }

  return [
    `Ketchikan’s cruise schedule for ${when} lists ${n} ships and about ${p.toLocaleString()} passengers of capacity.`,
    `After weather adjustment, KTN Port predicts roughly ${pred.toLocaleString()} ashore — ${day.verdictLabel.toLowerCase()}.`,
    `The main shore window runs ${window}.`,
    vs > 1.25
      ? `That is busier than the season average, so build in extra time downtown.`
      : vs < 0.75
        ? `That is quieter than many season days — a comfortable window for both shore time and local errands.`
        : `It sits near a typical in-season day for the port.`,
    `Times are America/Anchorage. Capacity numbers are estimates unless an actual count has been logged.`,
  ].join(' ')
}

export function dayOneLiner(day: DayForecast): {
  lead: string
  rest: string
} {
  const active = day.ships.filter((s) => !s.cancelled)
  if (active.length === 0) {
    return {
      lead: 'No cruise ships are scheduled',
      rest: ' — expect a quiet downtown.',
    }
  }
  const arrivals = active.map((s) => s.arrival).filter(Boolean).sort()
  const deps = active.map((s) => s.departure).filter(Boolean).sort()
  const from = arrivals[0] ?? 'morning'
  const to = deps[deps.length - 1] ?? 'afternoon'
  const band =
    day.weatherAdjustedCrowd === 'extreme'
      ? 'extreme'
      : day.weatherAdjustedCrowd === 'busy'
        ? 'heavy'
        : day.weatherAdjustedCrowd === 'moderate'
          ? 'moderate'
          : 'light'
  return {
    lead: `${active.length} ship${active.length === 1 ? '' : 's'}, up to ${day.scheduledPassengers.toLocaleString()} passengers`,
    rest: ` — expect ${band} foot traffic downtown from ${from} to ${to} Alaska time.`,
  }
}
