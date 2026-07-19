import type { Activity, CrowdLevel } from '../types'

export const ACTIVITIES: Activity[] = [
  {
    id: '1',
    name: 'Totem Bight State Historical Park',
    description:
      'Fifteen restored totem poles and a replica clan house in a serene forest setting north of downtown.',
    category: 'culture',
    bestTime: 'Early morning or after 3 PM',
    crowdTip: 'Most tour buses arrive 10 AM–2 PM. Go before 9 AM or after ships leave.',
    location: '10 miles north of downtown',
    duration: '1–2 hours',
    cruiseSensitivity: 'high',
    quietHours: 'Before 9 AM or after 3 PM',
  },
  {
    id: '2',
    name: 'Rainbird Trail',
    description:
      'A peaceful 1.3-mile boardwalk through temperate rainforest with views of Tongass Narrows.',
    category: 'nature',
    bestTime: 'Any time — rarely busy',
    crowdTip: 'Off the typical cruise excursion route. Ideal on heavy ship days.',
    location: 'Near downtown, off Park Avenue',
    duration: '1–1.5 hours',
    cruiseSensitivity: 'low',
    quietHours: 'Any time',
  },
  {
    id: '3',
    name: 'Deer Mountain Trail',
    description:
      'Challenging hike to alpine views above the cruise port. Crowds thin after the first mile.',
    category: 'adventure',
    bestTime: 'Start early (6–7 AM)',
    crowdTip: 'Most cruise passengers stick to easy walks. Climb higher for solitude.',
    location: 'Trailhead near downtown',
    duration: '3–5 hours',
    cruiseSensitivity: 'low',
    quietHours: 'Any time after the first mile',
  },
  {
    id: '4',
    name: 'Creek Street & Married Man’s Trail',
    description:
      'Historic boardwalk over Ketchikan Creek — shops, galleries, and salmon viewing.',
    category: 'culture',
    bestTime: 'Before 8 AM or after 4 PM',
    crowdTip: 'The #1 cruise attraction. On busy days, visit at dawn or after departure.',
    location: 'Downtown waterfront',
    duration: '1–2 hours',
    cruiseSensitivity: 'high',
    quietHours: 'Before 8 AM or after 4 PM',
  },
  {
    id: '5',
    name: 'Kayak Tongass Narrows',
    description:
      'Paddle calm waters with chances to spot seals, eagles, and whales away from the docks.',
    category: 'adventure',
    bestTime: 'Morning departures (7–8 AM)',
    crowdTip: 'Book early slots. Most cruise kayak excursions go out 9–11 AM.',
    location: 'Various launch points',
    duration: '2–4 hours',
    cruiseSensitivity: 'medium',
    quietHours: 'Before 9 AM',
  },
  {
    id: '6',
    name: 'Alaska Fish House',
    description: 'Fresh fish and chips, chowder, and Alaskan craft beer on the waterfront.',
    category: 'food',
    bestTime: 'Early lunch (11 AM) or late lunch (2:30 PM)',
    crowdTip: 'Peak rush noon–2 PM on ship days. Beat it early or late.',
    location: 'Near cruise ship dock',
    duration: '45 min–1 hour',
    cruiseSensitivity: 'high',
    quietHours: 'Before 11:30 AM or after 2:30 PM',
  },
  {
    id: '7',
    name: 'Saxman Native Village',
    description:
      'One of the world’s largest collections of standing totem poles with cultural demonstrations.',
    category: 'culture',
    bestTime: 'After 2 PM when morning tour groups leave',
    crowdTip: 'Afternoons are quieter and more intimate than morning bus waves.',
    location: '2.5 miles south of downtown',
    duration: '1.5–2 hours',
    cruiseSensitivity: 'medium',
    quietHours: 'After 2 PM',
  },
  {
    id: '8',
    name: 'Herring Cove Bear Viewing',
    description:
      'Watch black bears fish for salmon. Peak activity July through September.',
    category: 'nature',
    bestTime: 'Early morning or evening',
    crowdTip: 'Tours pack platforms midday. Go independently early or late.',
    location: '8 miles south of downtown',
    duration: '1–3 hours',
    cruiseSensitivity: 'medium',
    quietHours: 'Early morning or evening',
  },
  {
    id: '9',
    name: 'Bar Harbor Ale House',
    description: 'Local pub with craft beers and comfort food — a locals’ hangout.',
    category: 'food',
    bestTime: 'Afternoons and evenings',
    crowdTip: 'Cruise passengers rarely venture here. Peaceful even on peak days.',
    location: 'Off Mission Street',
    duration: '1–2 hours',
    cruiseSensitivity: 'low',
    quietHours: 'Any time',
  },
  {
    id: '10',
    name: 'Ward Lake Recreation Area',
    description: 'Scenic lake with easy trails, picnic spots, and fishing — a local gem.',
    category: 'nature',
    bestTime: 'Any time',
    crowdTip: 'Not on cruise excursion routes. Always quiet on extreme crowd days.',
    location: '7 miles north of town',
    duration: '1–3 hours',
    cruiseSensitivity: 'low',
    quietHours: 'Any time',
  },
  {
    id: '11',
    name: 'Southeast Alaska Discovery Center',
    description:
      'Exhibits on rainforest ecology, Native culture, and regional natural history.',
    category: 'culture',
    bestTime: 'Midday (when crowds are at Creek Street)',
    crowdTip: 'Quieter at midday while tourists flock outdoors first.',
    location: 'Downtown, 50 Main Street',
    duration: '1–2 hours',
    cruiseSensitivity: 'medium',
    quietHours: 'Midday counter-programming',
  },
  {
    id: '12',
    name: 'Rainforest Canopy Zip-lining',
    description:
      'Soar through old-growth forest on zip lines and suspension bridges.',
    category: 'adventure',
    bestTime: 'First or last slot of the day',
    crowdTip: 'Mid-morning fills with cruise groups. Early and late runs feel smaller.',
    location: 'Herring Cove area',
    duration: '2–3 hours',
    cruiseSensitivity: 'medium',
    quietHours: 'First or last slot',
  },
]

export function activitiesForCrowd(level: CrowdLevel): Activity[] {
  if (level === 'low') return ACTIVITIES
  if (level === 'moderate') {
    return ACTIVITIES.filter((a) =>
      ['nature', 'adventure', 'food'].includes(a.category),
    )
  }
  return ACTIVITIES.filter(
    (a) =>
      a.category === 'nature' ||
      a.category === 'adventure' ||
      a.id === '9' ||
      a.id === '10' ||
      a.id === '7',
  )
}
