export type CrowdLevel = 'low' | 'moderate' | 'busy' | 'extreme'

export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'light-rain'
  | 'rain'
  | 'heavy-rain'
  | 'storm'

export type DowntownVerdict = 'quiet' | 'okay' | 'avoid'

export interface ShipVisit {
  id: string
  date: string
  ship: string
  arrival: string
  departure: string
  berth: string
  direction: string
  estimated_passengers: number
  actual_passengers: number
  notes: string
  popularity_notes: string
}

export interface HourlyCrowdPoint {
  hour: number
  label: string
  passengers: number
  shipsInPort: number
  precipMm: number
  condition: WeatherCondition
}

export interface DayWeather {
  date: string
  condition: WeatherCondition
  tempHighF: number
  tempLowF: number
  precipitationMm: number
  precipProbability: number
  windMph: number
  /** Fraction of scheduled passengers expected ashore (0–1) */
  ashoreFactor: number
  hourly?: HourlyWeatherPoint[]
}

export interface HourlyWeatherPoint {
  time: string
  hour: number
  condition: WeatherCondition
  tempF: number
  precipMm: number
  precipProbability: number
  windMph: number
  ashoreFactor: number
}

export interface DayForecast {
  date: string
  ships: ShipVisit[]
  /** Raw sum of estimated/actual capacity */
  scheduledPassengers: number
  /** Capacity after ship-size + berth weights */
  weightedScheduled: number
  predictedDowntown: number
  crowdLevel: CrowdLevel
  weatherAdjustedCrowd: CrowdLevel
  weather?: DayWeather
  hourlyCrowd: HourlyCrowdPoint[]
  peakHour: number | null
  peakPassengers: number
  rainRelief: number
  dropsCrowdBand: boolean
  verdict: DowntownVerdict
  verdictLabel: string
  verdictDetail: string
  why: string
  hasActuals: boolean
  actualTotal: number
}

export interface Activity {
  id: string
  name: string
  description: string
  category: 'culture' | 'nature' | 'adventure' | 'food'
  bestTime: string
  crowdTip: string
  location: string
  duration: string
}

export interface PredictionLogEntry {
  date: string
  predicted: number
  scheduled: number
  actual: number | null
  condition: WeatherCondition
  ashoreFactor: number
  loggedAt: string
}

export interface NotifyPrefs {
  enabled: boolean
  extremeDays: boolean
  rainRelief: boolean
  lastNotifiedDate: string | null
}
