import type { MarineDay, TideEvent } from '../types'
import { kmhToMph } from './utils'

/** NOAA CO-OPS station — Ketchikan, AK */
const TIDE_STATION = '9450460'
const LAT = 55.3422
const LON = -131.6461

interface NoaaTidePrediction {
  t: string
  v: string
  type: string
}

export async function fetchTides(date: string): Promise<TideEvent[]> {
  const url = new URL('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter')
  url.searchParams.set('product', 'predictions')
  url.searchParams.set('application', 'ktn-port')
  url.searchParams.set('begin_date', date.replace(/-/g, ''))
  url.searchParams.set('end_date', date.replace(/-/g, ''))
  url.searchParams.set('station', TIDE_STATION)
  url.searchParams.set('time_zone', 'lst_ldt')
  url.searchParams.set('units', 'english')
  url.searchParams.set('interval', 'hilo')
  url.searchParams.set('format', 'json')
  url.searchParams.set('datum', 'MLLW')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Tide API ${res.status}`)
  const json = (await res.json()) as { predictions?: NoaaTidePrediction[] }
  return (json.predictions ?? []).map((p) => ({
    time: p.t,
    heightFt: Number(p.v),
    type: p.type?.startsWith('H') ? 'H' : 'L',
  }))
}

export async function fetchMarineDay(date: string): Promise<MarineDay> {
  let tides: TideEvent[] = []
  let windMph = 8
  let windGustMph = 12
  let waveFt: number | null = null

  try {
    tides = await fetchTides(date)
  } catch {
    tides = []
  }

  try {
    const windRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=windspeed_10m_max,windgusts_10m_max&timezone=America%2FAnchorage&forecast_days=3`,
    )
    if (windRes.ok) {
      const w = (await windRes.json()) as {
        daily: {
          time: string[]
          windspeed_10m_max: number[]
          windgusts_10m_max: number[]
        }
      }
      const idx = w.daily.time.indexOf(date)
      const i = idx >= 0 ? idx : 0
      windMph = kmhToMph(w.daily.windspeed_10m_max[i] ?? 12)
      windGustMph = kmhToMph(w.daily.windgusts_10m_max[i] ?? 18)
    }
  } catch {
    /* defaults */
  }

  try {
    const mRes = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&daily=wave_height_max&timezone=America%2FAnchorage&forecast_days=3`,
    )
    if (mRes.ok) {
      const m = (await mRes.json()) as {
        daily?: { time: string[]; wave_height_max: number[] }
      }
      if (m.daily) {
        const idx = m.daily.time.indexOf(date)
        const i = idx >= 0 ? idx : 0
        const meters = m.daily.wave_height_max[i]
        if (meters != null) waveFt = Math.round(meters * 3.28084 * 10) / 10
      }
    }
  } catch {
    /* optional in Tongass Narrows */
  }

  const floatplaneNote =
    windGustMph >= 30 || (waveFt != null && waveFt >= 4)
      ? 'Marginal for floatplanes — expect delays or cancellations.'
      : windGustMph >= 20
        ? 'Breezy — check with operators before flightseeing.'
        : 'Generally workable wind for flightseeing.'

  const nextHigh = tides.find((t) => t.type === 'H')
  const fishingNote = nextHigh
    ? `High tide ${nextHigh.time.slice(-5)} (${nextHigh.heightFt.toFixed(1)} ft) — often better water for salmon movement.`
    : 'Tide chart unavailable — check NOAA for fishing windows.'

  return {
    date,
    windMph,
    windGustMph,
    waveFt,
    tides,
    floatplaneNote,
    fishingNote,
  }
}
