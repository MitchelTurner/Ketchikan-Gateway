/**
 * Curated GetYourGuide offers for the Things to Do in Ketchikan content area.
 * Paths are marketplace deep links; partner_id is appended at render time.
 */
export type GygOffer = {
  id: string
  title: string
  blurb: string
  /** Duration hint shown in the card */
  duration: string
  /** From-price label (informational; live price is on GetYourGuide) */
  fromPrice: string
  category: 'culture' | 'wildlife' | 'adventure' | 'food' | 'flight' | 'water'
  /** Crowd tip tied to KTN Port scheduling advice */
  crowdTip: string
  /**
   * GetYourGuide path (preferred) or absolute URL.
   * City hub + product deep links preferred over generic search.
   */
  path: string
  imageSrc: string
  imageAlt: string
}

export const GYG_DESTINATION_CTA = {
  title: 'Browse all Ketchikan tours on GetYourGuide',
  blurb:
    'Shore excursions, rainforest walks, floatplanes, wildlife, and food experiences — book with free cancellation on most activities.',
  path: '/ketchikan-l1256/',
}

/** Featured bookable experiences for the affiliate content area. */
export const GYG_OFFERS: GygOffer[] = [
  {
    id: 'native-cultural-shore',
    title: 'Alaska Native Cultural & Scenic Shore Excursion',
    blurb:
      'Native-guided visit to Totem Bight with rainforest and wildlife stops — a strong pick when you want culture without the midday Creek Street crush.',
    duration: 'About 3 hours',
    fromPrice: 'From $84',
    category: 'culture',
    crowdTip: 'Book an early slot on multi-ship days to beat downtown walk-off peaks.',
    path: '/ketchikan-l1256/alaska-native-cultural-and-scenic-shore-excursion-t643031/',
    imageSrc: '/guides/totem-bight.jpg',
    imageAlt: 'Clan house and forest setting at Totem Bight near Ketchikan',
  },
  {
    id: 'rainforest-experience',
    title: 'Premium Rainforest Experience',
    blurb:
      'Guided time in the temperate rainforest — ideal when Front Street is packed and you want green quiet within a half-day window.',
    duration: 'About 2.5 hours',
    fromPrice: 'From $129',
    category: 'adventure',
    crowdTip: 'Pairs well with a late Creek Street walk after ships thin out.',
    path: '/s/?q=Premium+Rainforest+Experience+Ketchikan',
    imageSrc: '/guides/rainforest.jpg',
    imageAlt: 'Tongass temperate rainforest near Ketchikan, Alaska',
  },
  {
    id: 'trolley-totems',
    title: 'Totem Pole, Wildlife & City Trolley Tour',
    blurb:
      'Classic overview of Ketchikan attractions — totems, city highlights, and wildlife lookouts in one cruise-friendly loop.',
    duration: 'About 2 hours',
    fromPrice: 'From $85',
    category: 'culture',
    crowdTip: 'Good first-port-call overview before you decide what to DIY.',
    path: '/s/?q=Totem+Pole+Wildlife+City+Trolley+Tour+Ketchikan',
    imageSrc: '/guides/saxman.jpg',
    imageAlt: 'Standing totem poles near Ketchikan, Alaska',
  },
  {
    id: 'misty-fjords-floatplane',
    title: 'Misty Fjords National Monument Floatplane Tour',
    blurb:
      'Flightseeing over granite walls, waterfalls, and fjords — the signature “wow” excursion when weather and budget allow.',
    duration: 'About 2 hours',
    fromPrice: 'From $389',
    category: 'flight',
    crowdTip: 'Weather-sensitive: check the day page rain outlook before you commit.',
    path: '/s/?q=Misty+Fjords+Floatplane+Ketchikan',
    imageSrc: '/guides/harbor-overview.jpg',
    imageAlt: 'Ketchikan harbor and hillside from the waterfront',
  },
  {
    id: 'zipline',
    title: 'Forest Zipline & Climbing Tower',
    blurb:
      'Canopy adventure through old growth — a solid midday alternative when downtown tourist attractions are at peak density.',
    duration: 'About 3.5 hours',
    fromPrice: 'From $150',
    category: 'adventure',
    crowdTip: 'Mid-morning slots often fill with cruise groups; early or late is calmer.',
    path: '/s/?q=Forest+Zipline+Ketchikan',
    imageSrc: '/guides/rainforest.jpg',
    imageAlt: 'Dense rainforest canopy near Ketchikan',
  },
  {
    id: 'crab-feast',
    title: 'Crab Feast & Local Food Experiences',
    blurb:
      'Seafood-focused shore experiences (crab feasts, tasting stops) when you want a sit-down break from the boardwalk.',
    duration: 'About 1–2.5 hours',
    fromPrice: 'From $110',
    category: 'food',
    crowdTip: 'Lunch seatings around noon–2 p.m. get busiest on extreme ship days.',
    path: '/s/?q=Crab+Feast+Ketchikan',
    imageSrc: '/guides/creek-street.jpg',
    imageAlt: 'Creek Street boardwalk near Ketchikan waterfront dining',
  },
  {
    id: 'kayak-water',
    title: 'Kayak & Zodiac Adventures',
    blurb:
      'Paddle or ride the Tongass Narrows for wildlife and shoreline views away from the pier crowds.',
    duration: 'About 3–3.5 hours',
    fromPrice: 'From $118',
    category: 'water',
    crowdTip: 'Morning departures usually leave before the densest sidewalk traffic.',
    path: '/s/?q=Kayak+Ketchikan+Alaska',
    imageSrc: '/guides/cruise-ships.jpg',
    imageAlt: 'Ketchikan waterfront and Tongass Narrows',
  },
  {
    id: 'bear-viewing',
    title: 'Black Bear Viewing Tours',
    blurb:
      'Seasonal bear-viewing excursions (often July–September) for travelers who want wildlife beyond the docks.',
    duration: 'About 3–5 hours',
    fromPrice: 'From $125',
    category: 'wildlife',
    crowdTip: 'Independent early/evening visits feel calmer than midday tour platforms.',
    path: '/s/?q=Bear+Viewing+Ketchikan',
    imageSrc: '/guides/totem-bight.jpg',
    imageAlt: 'Forest setting near Ketchikan wildlife viewing areas',
  },
]
