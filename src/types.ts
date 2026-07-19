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

export type ShipLineProfile = 'shopping' | 'excursion' | 'expedition' | 'mixed'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type GoAdvice = 'go-now' | 'wait' | 'good-anytime'

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
  cancelled?: boolean
  lineProfile?: ShipLineProfile
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
  confidence: ConfidenceLevel
  confidenceLabel: string
  confidenceDetail: string
  cancelledCount: number
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
  /** How cruise-sensitive this spot is downtown (high = avoid peak) */
  cruiseSensitivity: 'high' | 'medium' | 'low'
  quietHours: string
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
  morningDigest: boolean
  lastNotifiedDate: string | null
  lastDigestDate: string | null
}

export interface TideEvent {
  time: string
  heightFt: number
  type: 'H' | 'L'
}

export interface MarineDay {
  date: string
  windMph: number
  windGustMph: number
  waveFt: number | null
  tides: TideEvent[]
  floatplaneNote: string
  fishingNote: string
}
