export type CrowdLevel = 'low' | 'moderate' | 'busy' | 'extreme'

export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'light-rain'
  | 'rain'
  | 'heavy-rain'
  | 'storm'

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

export interface DayForecast {
  date: string
  ships: ShipVisit[]
  scheduledPassengers: number
  predictedDowntown: number
  crowdLevel: CrowdLevel
  weatherAdjustedCrowd: CrowdLevel
  weather?: DayWeather
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
