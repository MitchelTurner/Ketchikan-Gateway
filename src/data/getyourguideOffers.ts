/**
 * Curated GetYourGuide offers for the Things to Do in Ketchikan content area.
 * Paths are marketplace deep links; partner_id is appended at render time.
 */
export type GygCategory =
  | 'culture'
  | 'wildlife'
  | 'adventure'
  | 'food'
  | 'flight'
  | 'water'
  | 'show'

export type GygOffer = {
  id: string
  title: string
  blurb: string
  /** Duration hint shown in the card */
  duration: string
  /** Numeric hours for ship-window filtering */
  durationHours: number
  /** From-price label (informational; live price is on GetYourGuide) */
  fromPrice: string
  category: GygCategory
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

/** Quick-browse affiliate chips (destination filters / searches). */
export type GygBrowseLink = {
  id: string
  label: string
  path: string
}

export const GYG_DESTINATION_CTA = {
  title: 'Browse all Ketchikan tours on GetYourGuide',
  blurb:
    '40+ shore excursions, rainforest walks, floatplanes, wildlife, food, and shows — book with free cancellation on most activities.',
  path: '/ketchikan-l1256/',
}

export const GYG_BROWSE_LINKS: GygBrowseLink[] = [
  {
    id: 'all',
    label: 'All Ketchikan tours',
    path: '/ketchikan-l1256/',
  },
  {
    id: 'shore',
    label: 'Shore excursions',
    path: '/s/?q=Ketchikan+shore+excursion',
  },
  {
    id: 'wildlife',
    label: 'Wildlife & bears',
    path: '/s/?q=Ketchikan+wildlife+bear',
  },
  {
    id: 'flightseeing',
    label: 'Floatplanes',
    path: '/s/?q=Ketchikan+floatplane+Misty+Fjords',
  },
  {
    id: 'kayak',
    label: 'Kayak & boats',
    path: '/s/?q=Ketchikan+kayak+boat+tour',
  },
  {
    id: 'food',
    label: 'Food & crab feasts',
    path: '/s/?q=Ketchikan+crab+feast+seafood',
  },
  {
    id: 'hiking',
    label: 'Hiking & rainforest',
    path: '/s/?q=Ketchikan+rainforest+hiking',
  },
  {
    id: 'private',
    label: 'Private tours',
    path: '/s/?q=Ketchikan+private+tour',
  },
]

/** Featured bookable experiences for the affiliate content area. */
export const GYG_OFFERS: GygOffer[] = [
  {
    id: 'native-cultural-shore',
    title: 'Alaska Native Cultural & Scenic Shore Excursion',
    blurb:
      'Native-guided visit to Totem Bight with rainforest and wildlife stops — a strong pick when you want culture without the midday Creek Street crush.',
    duration: 'About 3 hours',
    durationHours: 3,
    fromPrice: 'From $84',
    category: 'culture',
    crowdTip: 'Book an early slot on multi-ship days to beat downtown walk-off peaks.',
    path: '/ketchikan-l1256/alaska-native-cultural-and-scenic-shore-excursion-t643031/',
    imageSrc: '/guides/totem-bight.jpg',
    imageAlt: 'Clan house and forest setting at Totem Bight near Ketchikan',
  },
  {
    id: 'rainforest-experience',
    title: 'Premium Rainforest Experience in Ketchikan',
    blurb:
      'Guided time in the temperate rainforest — ideal when Front Street is packed and you want green quiet within a half-day window.',
    duration: 'About 2.5 hours',
    durationHours: 2.5,
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
    durationHours: 2,
    fromPrice: 'From $85',
    category: 'culture',
    crowdTip: 'Good first-port-call overview before you decide what to DIY.',
    path: '/s/?q=Totem+Pole+Wildlife+City+Trolley+Tour+Ketchikan',
    imageSrc: '/guides/saxman.jpg',
    imageAlt: 'Standing totem poles near Ketchikan, Alaska',
  },
  {
    id: 'saxman-salmon',
    title: 'City Tour, Saxman Village & Salmon Tasting',
    blurb:
      'See downtown highlights, Saxman totem park, and a salmon tasting — culture plus a flavor of Alaska in one outing.',
    duration: 'About 2.5 hours',
    durationHours: 2.5,
    fromPrice: 'From $99',
    category: 'culture',
    crowdTip: 'Afternoons at Saxman are often quieter than the morning bus rush.',
    path: '/s/?q=City+Tour+Saxman+Village+Salmon+Tasting+Ketchikan',
    imageSrc: '/guides/saxman.jpg',
    imageAlt: 'Totem poles at Saxman near Ketchikan',
  },
  {
    id: 'rainforest-sanctuary',
    title: 'Alaska Rainforest Sanctuary & Totem Park Walk',
    blurb:
      'Rainforest paths and totem storytelling away from the densest dockside souvenir stretch.',
    duration: 'About 2.75 hours',
    durationHours: 2.75,
    fromPrice: 'From $110',
    category: 'culture',
    crowdTip: 'A solid midday booking when Creek Street is shoulder-to-shoulder.',
    path: '/s/?q=Alaska+Rainforest+Sanctuary+Totem+Park+Ketchikan',
    imageSrc: '/guides/rainforest.jpg',
    imageAlt: 'Rainforest walk near Ketchikan totem parks',
  },
  {
    id: 'misty-fjords-floatplane',
    title: 'Misty Fjords National Monument Floatplane Tour',
    blurb:
      'Flightseeing over granite walls, waterfalls, and fjords — the signature “wow” excursion when weather and budget allow.',
    duration: 'About 2 hours',
    durationHours: 2,
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
    durationHours: 3.5,
    fromPrice: 'From $150',
    category: 'adventure',
    crowdTip: 'Mid-morning slots often fill with cruise groups; early or late is calmer.',
    path: '/s/?q=Forest+Zipline+Climbing+Tower+Ketchikan',
    imageSrc: '/guides/rainforest.jpg',
    imageAlt: 'Dense rainforest canopy near Ketchikan',
  },
  {
    id: 'adventure-kart',
    title: 'Adventure Kart Expedition',
    blurb:
      'Guided kart run through forest roads — high-energy shore time that keeps you off the crowded boardwalk.',
    duration: 'About 3.5 hours',
    durationHours: 3.5,
    fromPrice: 'From $275',
    category: 'adventure',
    crowdTip: 'Book ahead on extreme ship days; adventure inventory sells out first.',
    path: '/s/?q=Adventure+Kart+Expedition+Ketchikan',
    imageSrc: '/guides/harbor-overview.jpg',
    imageAlt: 'Ketchikan hills and forest above the harbor',
  },
  {
    id: 'ebike-hike',
    title: 'E-Bike and Hike Tour',
    blurb:
      'Pedal and walk into quieter edges of town and forest — more ground covered than a sidewalk stroll alone.',
    duration: 'About 4 hours',
    durationHours: 4,
    fromPrice: 'From $164',
    category: 'adventure',
    crowdTip: 'Leave right after arrival so you’re out before the heaviest pier surge.',
    path: '/s/?q=E-Bike+and+Hike+Tour+Ketchikan',
    imageSrc: '/guides/dock-street.jpg',
    imageAlt: 'Historic streets near downtown Ketchikan',
  },
  {
    id: 'settlers-cove-hike',
    title: 'Settlers Cove Rainforest Eco Hiking Tour',
    blurb:
      'Guided eco-hike in rainforest at Settlers Cove — for travelers who want trails more than souvenir rows.',
    duration: 'About 3 hours',
    durationHours: 3,
    fromPrice: 'From $125',
    category: 'adventure',
    crowdTip: 'Low downtown impact — great on extreme capacity days.',
    path: '/s/?q=Settlers+Cove+Rainforest+Eco+Hiking+Ketchikan',
    imageSrc: '/guides/rainforest.jpg',
    imageAlt: 'Temperate rainforest hiking near Ketchikan',
  },
  {
    id: 'crab-feast',
    title: 'Crab Feast Lunch at World Famous Lodge',
    blurb:
      'Sit-down crab feast away from the docks — a filling break when you want seafood without hunting for a table on Front Street.',
    duration: 'About 2.5 hours',
    durationHours: 2.5,
    fromPrice: 'From $110',
    category: 'food',
    crowdTip: 'Lunch seatings around noon–2 p.m. get busiest on extreme ship days.',
    path: '/s/?q=Crab+Feast+Lunch+Ketchikan',
    imageSrc: '/guides/creek-street.jpg',
    imageAlt: 'Creek Street boardwalk near Ketchikan waterfront dining',
  },
  {
    id: 'lumberjack-crab',
    title: 'Lumberjack Show & Crab Feast',
    blurb:
      'Timber sports show paired with a crab meal — classic cruise-port entertainment with a food stop built in.',
    duration: 'About 2.5 hours',
    durationHours: 2.5,
    fromPrice: 'From $158',
    category: 'show',
    crowdTip: 'Popular on peak ship days — reserve before you sail if your call is short.',
    path: '/s/?q=Lumberjack+Show+Crab+Feast+Ketchikan',
    imageSrc: '/guides/creek-street.jpg',
    imageAlt: 'Downtown Ketchikan boardwalk atmosphere',
  },
  {
    id: 'bering-sea-crab',
    title: "Bering Sea Crab Fishermen's Tour",
    blurb:
      'Hands-on crab fishing experience with working-boat vibes — a memorable “only in Alaska” shore story.',
    duration: 'About 3 hours',
    durationHours: 3,
    fromPrice: 'From $249',
    category: 'food',
    crowdTip: 'Match departure to your ship window; leave a buffer for all-aboard.',
    path: '/s/?q=Bering+Sea+Crab+Fishermen+Tour+Ketchikan',
    imageSrc: '/guides/cruise-ships.jpg',
    imageAlt: 'Ketchikan waterfront working harbor',
  },
  {
    id: 'jet-boat-seafood',
    title: 'Jet Boat Tour with Rainforest Walk & Seafood Boil',
    blurb:
      'Jet boat, forest walk, and a seafood boil — adventure plus a meal without juggling three separate bookings.',
    duration: 'About 3.75 hours',
    durationHours: 3.75,
    fromPrice: 'From $194',
    category: 'food',
    crowdTip: 'Longer outing — best when your ship has a full-day call.',
    path: '/s/?q=Jet+Boat+Rainforest+Seafood+Boil+Ketchikan',
    imageSrc: '/guides/harbor-overview.jpg',
    imageAlt: 'Ketchikan shoreline and forested hills',
  },
  {
    id: 'kayak-eagle',
    title: 'Kayak Eagle Island Adventure in Tongass Forest',
    blurb:
      'Paddle calm forested waterways for eagles and shoreline scenery away from the pier crowds.',
    duration: 'About 3.5 hours',
    durationHours: 3.5,
    fromPrice: 'From $118',
    category: 'water',
    crowdTip: 'Morning departures usually leave before the densest sidewalk traffic.',
    path: '/s/?q=Kayak+Eagle+Island+Tongass+Ketchikan',
    imageSrc: '/guides/cruise-ships.jpg',
    imageAlt: 'Ketchikan waterfront and Tongass Narrows',
  },
  {
    id: 'zodiac',
    title: 'Zodiac Boat Adventure — Drive Your Own RI',
    blurb:
      'Pilot a rigid inflatable through local waters — high-thrill alternative to a sit-and-ride harbor cruise.',
    duration: 'About 3.5 hours',
    durationHours: 3.5,
    fromPrice: 'From $179',
    category: 'water',
    crowdTip: 'Adventure inventory sells out on stacked ship days — book early.',
    path: '/s/?q=Zodiac+Boat+Adventure+Ketchikan',
    imageSrc: '/guides/harbor-overview.jpg',
    imageAlt: 'Open water and coastline near Ketchikan',
  },
  {
    id: 'orca-cove-kayak',
    title: 'Orca Cove Fast Boat & Sea Kayaking Tour',
    blurb:
      'Fast boat out, then paddle quieter coves — a mix of speed and paddle time in one shore window.',
    duration: 'About 3 hours',
    durationHours: 3,
    fromPrice: 'From $206',
    category: 'water',
    crowdTip: 'Confirm return time against your all-aboard on short calls.',
    path: '/s/?q=Orca+Cove+Fast+Boat+Sea+Kayaking+Ketchikan',
    imageSrc: '/guides/cruise-ships.jpg',
    imageAlt: 'Boats along the Ketchikan waterfront',
  },
  {
    id: 'whale-lunch',
    title: "Whales and Lunch — Premier Whale Watching",
    blurb:
      'Whale watching with lunch included — wildlife time on the water when you want a full half-day package.',
    duration: 'About 3 hours',
    durationHours: 3,
    fromPrice: 'From $259',
    category: 'wildlife',
    crowdTip: 'Seas and sightings vary; leave buffer before sail-away.',
    path: '/s/?q=Whales+and+Lunch+Ketchikan+whale+watching',
    imageSrc: '/guides/harbor-overview.jpg',
    imageAlt: 'Coastal waters near Ketchikan for wildlife tours',
  },
  {
    id: 'marine-wildlife',
    title: 'Marine Wildlife & Whale Watching Boat Tour',
    blurb:
      'Boat-based wildlife searching for whales and marine life — classic Alaska water day from Ketchikan.',
    duration: 'About 2.5 hours',
    durationHours: 2.5,
    fromPrice: 'From $199',
    category: 'wildlife',
    crowdTip: 'Shorter than full-day packages — fits tighter ship schedules.',
    path: '/s/?q=Marine+Wildlife+Whale+Watching+Boat+Ketchikan',
    imageSrc: '/guides/cruise-ships.jpg',
    imageAlt: 'Tongass Narrows near cruise docks in Ketchikan',
  },
  {
    id: 'neets-bay-bears',
    title: 'Neets Bay Black Bear Viewing Tour with Cruise',
    blurb:
      'Boat out for seasonal black bear viewing — a bigger wildlife commitment when you have a long port day.',
    duration: 'About 5 hours',
    durationHours: 5,
    fromPrice: 'From $399',
    category: 'wildlife',
    crowdTip: 'Long excursion — only on days with generous arrival/departure windows.',
    path: '/s/?q=Neets+Bay+Black+Bear+Viewing+Ketchikan',
    imageSrc: '/guides/totem-bight.jpg',
    imageAlt: 'Forest setting near Ketchikan wildlife viewing areas',
  },
  {
    id: 'wild-wolf',
    title: 'Wild Wolf Tours',
    blurb:
      'Guided wildlife-focused outing for guests chasing wolves, rainforest, and quieter nature time.',
    duration: 'About 3 hours',
    durationHours: 3,
    fromPrice: 'From $125',
    category: 'wildlife',
    crowdTip: 'Nature tours keep you clear of the densest Creek Street hours.',
    path: '/s/?q=Wild+Wolf+Tours+Ketchikan',
    imageSrc: '/guides/rainforest.jpg',
    imageAlt: 'Forest habitat near Ketchikan',
  },
  {
    id: 'ghost-walk',
    title: 'Ghost Walk Guided Tour',
    blurb:
      'Downtown storytelling walk — budget-friendly, close to the ships, and easy to slot before or after a bigger tour.',
    duration: 'About 2 hours',
    durationHours: 2,
    fromPrice: 'From $30',
    category: 'show',
    crowdTip: 'Walkable from berths 1–4; evenings feel less crowded than midday.',
    path: '/s/?q=Ghost+Walk+Guided+Tour+Ketchikan',
    imageSrc: '/guides/dock-street.jpg',
    imageAlt: 'Historic downtown streets in Ketchikan',
  },
  {
    id: 'private-tour',
    title: 'Customizable Private Tour with Guide',
    blurb:
      'Private van and guide for your group — build a totem, rainforest, or photo itinerary around your ship’s clock.',
    duration: 'About 3 hours',
    durationHours: 3,
    fromPrice: 'From $575 / group',
    category: 'culture',
    crowdTip: 'Best when you want to dodge fixed tour-bus waves entirely.',
    path: '/s/?q=Customizable+Private+Tour+Ketchikan',
    imageSrc: '/guides/totem-bight.jpg',
    imageAlt: 'Totem Bight area suitable for private touring',
  },
  {
    id: 'distillery',
    title: 'Distillery Tour with Infusion Class',
    blurb:
      'Indoor tasting and infusion class — smart rain-day plan when outdoor flights cancel.',
    duration: 'About 2 hours',
    durationHours: 2,
    fromPrice: 'From $161',
    category: 'food',
    crowdTip: 'Great weather backup; check the day page forecast the night before.',
    path: '/s/?q=Distillery+Tour+Infusion+Class+Ketchikan',
    imageSrc: '/guides/creek-street.jpg',
    imageAlt: 'Downtown Ketchikan near indoor food experiences',
  },
]
