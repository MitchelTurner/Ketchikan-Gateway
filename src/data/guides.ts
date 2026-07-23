export type GuideFaq = { question: string; answer: string }

export type GuideImage = {
  src: string
  alt: string
  credit: string
  creditUrl?: string
}

export type GuideTag = 'port-day' | 'planning' | 'berths' | 'tours' | 'crowds'

export type GuideAudience = 'cruise' | 'local' | 'planner'

export type GuideListItem = {
  name: string
  detail: string
  /** GetYourGuide search query for “Book related tours” */
  bookQuery?: string
}

export type GuideSection = {
  /** Optional stable id for TOC anchors (auto-slugged from heading if omitted) */
  id?: string
  heading: string
  body: string[]
  image?: GuideImage
  /** Optional consumer-facing list (attractions, trails, etc.) */
  items?: GuideListItem[]
  /** Related guide to surface after this section */
  relatedSlug?: string
}

export type Guide = {
  slug: string
  title: string
  description: string
  updated: string
  readMinutes: number
  /** Primary keyword phrase for SEO context */
  focusKeyword: string
  tags: GuideTag[]
  audiences: GuideAudience[]
  /** Promote on guides index */
  featured?: boolean
  relatedSlugs: string[]
  hero: GuideImage
  faqs: GuideFaq[]
  sections: GuideSection[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'things-to-do-in-ketchikan',
    title: 'Things to Do in Ketchikan Alaska',
    description:
      'Ketchikan attractions and things to see — Creek Street, rainforest walks, hiking trails, totem parks, and how to time tourist spots around cruise crowds.',
    updated: '2026-07-22',
    readMinutes: 10,
    focusKeyword: 'things to do in Ketchikan Alaska',
    tags: ['port-day', 'tours', 'crowds'],
    audiences: ['cruise', 'planner'],
    featured: true,
    relatedSlugs: [
      'ketchikan-shore-excursions-timing',
      'best-time-to-visit-ketchikan',
      'ketchikan-berth-locations-explained',
    ],
    hero: {
      src: '/guides/creek-street.jpg',
      alt: 'Historic Creek Street boardwalk over Ketchikan Creek in Ketchikan, Alaska',
      credit: 'Photo: Diego Delso / Wikimedia Commons (CC BY-SA 4.0)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Calle_hist%C3%B3rica_Creek,_Ketchikan,_Alaska,_Estados_Unidos,_2017-08-16,_DD_52.jpg',
    },
    faqs: [
      {
        question: 'What are the best things to do in Ketchikan Alaska?',
        answer:
          'Top picks for most visitors: Creek Street and Married Man’s Trail downtown, Totem Bight or Saxman for standing totem poles, a temperate rainforest walk (Rainbird Trail or Ward Lake), and — if time allows — Deer Mountain, kayaking on Tongass Narrows, or seasonal bear viewing at Herring Cove. Check the KTN Port day page so you hit walkable downtown attractions before or after the mid-morning ship surge.',
      },
      {
        question: 'What are the top Ketchikan tourist attractions?',
        answer:
          'The classic tourist attractions in Ketchikan Alaska are Creek Street, the downtown waterfront and tunnel area, Totem Bight State Historical Park, Saxman Native Village, the Southeast Alaska Discovery Center, and rainforest / canopy experiences near Herring Cove. Hiking trails and quieter lakes are excellent things to see when the docks are packed.',
      },
      {
        question: 'Are there good Ketchikan hiking trails near downtown?',
        answer:
          'Yes. Rainbird Trail is a short boardwalk through rainforest with Tongass Narrows views and stays relatively quiet even on busy cruise days. Deer Mountain Trail starts near downtown and climbs to alpine views — crowds thin after the first mile. Ward Lake Recreation Area (about 7 miles north) adds easy loops and picnic spots off the usual excursion routes.',
      },
      {
        question: 'Can I experience the Ketchikan rainforest without a big tour?',
        answer:
          'Absolutely. Rainbird Trail and Ward Lake are self-guided rainforest walks. The Discovery Center downtown covers rainforest ecology indoors if weather turns. Canopy zip-line tours near Herring Cove are the booked option; book early or late slots when cruise groups fill mid-morning.',
      },
    ],
    sections: [
      {
        heading: 'Ketchikan attractions at a glance',
        body: [
          'Looking for things to do in Ketchikan Alaska? The town packs historic Creek Street, world-famous totem parks, Tongass rainforest, and hiking trails that start almost from the docks into a compact waterfront. This guide lists the top Ketchikan attractions and things to see — plus when each spot feels crowded on a cruise day.',
          'Crowds swing with the ship calendar. A multi-ship day can put more than 10,000 passengers ashore; a zero-ship day feels like a different town. Use the live schedule on KTN Port to pick quieter windows, then match the attractions below to your time and weather. Bookable shore excursions and tours are linked in the GetYourGuide section below.',
        ],
      },
      {
        heading: 'Downtown things to see',
        body: [
          'These Ketchikan tourist attractions sit within walking distance of berths 1–4. On heavy ship days, visit before about 10 a.m. or after mid-afternoon when sidewalks thin.',
        ],
        image: {
          src: '/guides/creek-street.jpg',
          alt: 'Creek Street historic boardwalk, a top Ketchikan tourist attraction',
          credit: 'Photo: Diego Delso / Wikimedia Commons (CC BY-SA 4.0)',
          creditUrl:
            'https://commons.wikimedia.org/wiki/File:Calle_hist%C3%B3rica_Creek,_Ketchikan,_Alaska,_Estados_Unidos,_2017-08-16,_DD_52.jpg',
        },
        relatedSlug: 'ketchikan-shore-excursions-timing',
        items: [
          {
            name: 'Creek Street & Married Man’s Trail',
            detail:
              'Historic boardwalk over Ketchikan Creek — galleries, shops, and salmon viewing in season. The #1 downtown tourist stop; go early or late on busy cruise days.',
            bookQuery: 'Ketchikan city tour Creek Street',
          },
          {
            name: 'Southeast Alaska Discovery Center',
            detail:
              'Indoor exhibits on rainforest ecology, Native culture, and regional natural history at 50 Main Street. Smart midday counter-programming when Creek Street is packed.',
            bookQuery: 'Ketchikan rainforest culture tour',
          },
          {
            name: 'Waterfront, tunnel & harbors',
            detail:
              'Photo walks along the docks and through the downtown tunnel. Best light and fewer elbows early morning or near all-aboard.',
            bookQuery: 'Ketchikan shore excursion',
          },
          {
            name: 'Waterfront dining (e.g. Alaska Fish House)',
            detail:
              'Fish and chips and harbor views near the docks. Peak lunch lines hit noon–2 p.m. on ship days — eat early or late.',
            bookQuery: 'Ketchikan crab feast seafood',
          },
        ],
      },
      {
        heading: 'Culture & totem parks',
        body: [
          'Standing totem poles are among the most famous things to see in Ketchikan Alaska. Tour buses concentrate mid-morning through early afternoon.',
        ],
        image: {
          src: '/guides/totem-bight.jpg',
          alt: 'Clan house at Totem Bight State Historical Park near Ketchikan',
          credit: 'Photo: public domain / Wikimedia Commons',
          creditUrl:
            'https://commons.wikimedia.org/wiki/File:Totem_Bight_Community_House,_Mud_Bight_Village,_North_Tongass_Highway,_Ketchikan_vicinity_(Ketchikan_Gateway_Borough,_Alaska).jpg',
        },
        relatedSlug: 'ketchikan-berth-locations-explained',
        items: [
          {
            name: 'Totem Bight State Historical Park',
            detail:
              'Fifteen restored poles and a replica clan house in forest north of downtown (~10 miles). Aim before 9 a.m. or after 3 p.m. to miss bus waves.',
            bookQuery: 'Totem Bight Ketchikan tour',
          },
          {
            name: 'Saxman Native Village',
            detail:
              'Large collection of standing poles with cultural programs about 2.5 miles south of downtown. Afternoons are often quieter than the morning tour rush.',
            bookQuery: 'Saxman Village Ketchikan',
          },
        ],
      },
      {
        heading: 'Ketchikan hiking trails & rainforest',
        body: [
          'Ketchikan sits in a temperate rainforest. These hiking trails and forest walks are some of the best things to do when you want green quiet instead of souvenir rows — and most stay calmer than Creek Street even on extreme ship days.',
        ],
        image: {
          src: '/guides/rainforest.jpg',
          alt: 'Temperate rainforest in Tongass National Forest near Ketchikan, Alaska',
          credit: 'Photo: USDA Forest Service / Wikimedia Commons (public domain)',
          creditUrl:
            'https://commons.wikimedia.org/wiki/File:Tongass_National_Forest_(20230525-FS-TNF-PAR-01).jpg',
        },
        items: [
          {
            name: 'Rainbird Trail',
            detail:
              'About 1.3 miles of boardwalk through rainforest with Tongass Narrows views, near downtown off Park Avenue. Low cruise sensitivity — ideal on packed dock days.',
            bookQuery: 'Ketchikan rainforest hiking',
          },
          {
            name: 'Deer Mountain Trail',
            detail:
              'Steeper hike from near downtown toward alpine views above the port. Plan 3–5 hours; solitude improves after the first mile.',
            bookQuery: 'Ketchikan hiking tour',
          },
          {
            name: 'Ward Lake Recreation Area',
            detail:
              'Easy lakeside trails, picnic spots, and fishing ~7 miles north. Rarely on cruise excursion loops — a local favorite rainforest escape.',
            bookQuery: 'Ketchikan rainforest experience',
          },
          {
            name: 'Rainforest canopy zip-lining',
            detail:
              'Guided zip lines and suspension bridges through old growth near Herring Cove. Book first or last slots; mid-morning fills with cruise groups.',
            bookQuery: 'Forest Zipline Ketchikan',
          },
        ],
      },
      {
        heading: 'Wildlife & adventure',
        body: [
          'Beyond the sidewalk attractions, these experiences show another side of Ketchikan things to do — water, wildlife, and time away from the pier.',
        ],
        image: {
          src: '/guides/saxman.jpg',
          alt: 'Standing totem poles at Saxman Totem Park south of Ketchikan',
          credit: 'Photo: Jerzy Strzelecki / Wikimedia Commons (CC BY 3.0)',
          creditUrl:
            'https://commons.wikimedia.org/wiki/File:Saxman_totem_park(js)02.jpg',
        },
        items: [
          {
            name: 'Kayak Tongass Narrows',
            detail:
              'Paddle for seals, eagles, and occasional whales. Morning departures (around 7–8 a.m.) usually beat the busiest excursion windows.',
            bookQuery: 'Kayak Ketchikan Alaska',
          },
          {
            name: 'Herring Cove bear viewing',
            detail:
              'Seasonal black bear fishing (roughly July–September). Midday tours crowd platforms; independent early or evening visits feel calmer.',
            bookQuery: 'Bear Viewing Ketchikan',
          },
        ],
      },
      {
        heading: 'How to time attractions around cruise crowds',
        relatedSlug: 'best-time-to-visit-ketchikan',
        body: [
          'Open your travel date on the KTN Port schedule. Note ship count, downtown vs Ward Cove berths, and the weather-adjusted crowd band. Downtown tourist attractions feel the walk-off surge most; rainforest trails and Ward Lake rarely do.',
          'For a short port call: Creek Street or the Discovery Center first if you arrive early, a booked tour midday, then a second downtown pass before all-aboard. For a land stay: pick low ship-count days from the month calendar for photography and shopping, and save Rainbird or Deer Mountain for any day the docks look extreme.',
          'Want live “go now / wait” tips by spot? The Activities page pairs these same places with today’s crowd curve.',
        ],
      },
    ],
  },
  {
    slug: 'best-time-to-visit-ketchikan',
    title: 'Best Time to Visit Ketchikan Alaska',
    description:
      'Best time to visit Ketchikan Alaska without cruise crowds — shoulder months, quiet weekdays, peak summer tips, and how to read a multi-ship day on the live schedule.',
    updated: '2026-07-22',
    readMinutes: 8,
    focusKeyword: 'best time to visit Ketchikan',
    tags: ['planning', 'crowds'],
    audiences: ['planner', 'cruise', 'local'],
    relatedSlugs: [
      'things-to-do-in-ketchikan',
      'ketchikan-shore-excursions-timing',
      'ketchikan-berth-locations-explained',
    ],
    hero: {
      src: '/guides/cruise-ships.jpg',
      alt: 'Cruise ship docked along the Ketchikan waterfront in Alaska',
      credit: 'Photo: Joe Mabel / Wikimedia Commons (CC BY-SA 4.0)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Holland_America_%27Westerdam%27_in_Ketchikan,_August_2023.jpg',
    },
    faqs: [
      {
        question: 'What is the best time to visit Ketchikan Alaska?',
        answer:
          'For fewer crowds, early May and late September are usually the best times to visit Ketchikan Alaska inside the cruise season. July–early August bring peak scenery and the densest downtown traffic. Outside May–September, ships drop off and sidewalks stay quieter.',
      },
      {
        question: 'What is the quietest time of year in Ketchikan?',
        answer:
          'Outside the main cruise season (roughly May–September), downtown is far quieter. Inside the season, shoulder weeks in early May and late September plus zero-ship midweek days are the softest.',
      },
      {
        question: 'What time of day are downtown crowds worst?',
        answer:
          'Most ship calls concentrate shore traffic between about 10 a.m. and 2 p.m. Alaska time. Early morning and late afternoon are usually easier.',
      },
    ],
    sections: [
      {
        heading: 'Two calendars, one sidewalk',
        body: [
          'The best time to visit Ketchikan depends less on the calendar month alone and more on the cruise berth board. A four-ship downtown day can put well over 10,000 passengers ashore; a zero-ship day feels like a different town. Locals already plan errands around that swing — visitors who want photos without elbows should too.',
          'KTN Port turns the Port of Ketchikan capacity calendar into a day-by-day crowd forecast. Use the schedule hub to pick dates before you book lodging or tours, then open the day page for the hourly shore curve.',
        ],
      },
      {
        heading: 'Shoulder season vs peak summer',
        body: [
          'May and September still see ships, but call frequency and passenger totals usually sit below July–August peaks. If your trip is flexible, aim for early May or the last two weeks of September and then cherry-pick low ship-count days inside that window.',
          'July and early August deliver classic Alaska scenery — and the densest Front Street traffic. You can still visit then; treat 10 a.m.–2 p.m. as peak and schedule creek walks, dining, or museum time on either side.',
        ],
        image: {
          src: '/guides/harbor-overview.jpg',
          alt: 'View of downtown Ketchikan from the cruise ship dock',
          credit: 'Photo: Barek / Wikimedia Commons (public domain)',
          creditUrl:
            'https://commons.wikimedia.org/wiki/File:Ketchikan_from_cruise_dock.JPG',
        },
      },
      {
        heading: 'How to read a day page before you go',
        body: [
          'Start with ship count and scheduled capacity, then check the weather-adjusted prediction. Rain often cancels floatplane and outdoor excursions, which keeps guests aboard and can drop a “busy on paper” day into a softer downtown.',
          'If Ward Cove holds one or two ships while downtown berths are empty, the waterfront still sees shuttle traffic, but Creek Street walk-off density is usually milder than a full berths 1–4 stack.',
          'Cross-link tip: open the month view for your travel window, then drill into the lightest days. From any day page you can jump to each ship’s profile for capacity context.',
        ],
      },
      {
        heading: 'Locals and businesses',
        body: [
          'For deliveries, contractor work, or restaurant staffing, the same numbers apply with different framing: extreme days need more sidewalk capacity and patience; quiet days are when downtown errands move faster. Bookmark tomorrow’s day card the night before.',
        ],
      },
    ],
  },
  {
    slug: 'ketchikan-berth-locations-explained',
    title: 'Ketchikan Cruise Berths Explained',
    description:
      'Ketchikan cruise berth locations explained — downtown berths 1–4 vs Ward Cove vs anchorage tenders, and why dock assignment changes how crowded Creek Street feels.',
    updated: '2026-07-22',
    readMinutes: 7,
    focusKeyword: 'Ketchikan berths',
    tags: ['berths', 'crowds', 'port-day'],
    audiences: ['cruise', 'local', 'planner'],
    relatedSlugs: [
      'things-to-do-in-ketchikan',
      'best-time-to-visit-ketchikan',
      'ketchikan-shore-excursions-timing',
    ],
    hero: {
      src: '/guides/cruise-ships.jpg',
      alt: 'Cruise ship at a Ketchikan berth along Tongass Narrows',
      credit: 'Photo: Joe Mabel / Wikimedia Commons (CC BY-SA 4.0)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Holland_America_%27Westerdam%27_in_Ketchikan,_August_2023.jpg',
    },
    faqs: [
      {
        question: 'Which Ketchikan berths put guests closest to downtown?',
        answer:
          'Berths 1–4 sit on the downtown waterfront. Guests can walk into the tourist core within minutes. Ward Cove is north of town and usually relies on shuttles or tours.',
      },
      {
        question: 'Do anchorage calls still crowd downtown?',
        answer:
          'Yes, but the flow is paced by tender boats, so peaks are often later and less sharp than a pier-side mega-ship all-call.',
      },
      {
        question: 'Where is Ward Cove relative to downtown Ketchikan?',
        answer:
          'Ward Cove sits north of the downtown core. It absorbs large ships that would otherwise intensify the downtown stack. Guests still reach town — often by shuttle — so restaurants and shops stay busy, but the immediate dockside surge is elsewhere.',
      },
    ],
    sections: [
      {
        heading: 'Downtown berths 1–4',
        body: [
          'The classic Ketchikan cruise picture is ships stacked along the downtown docks. When three or four vessels are in together, walk-off traffic converges on Front Street, the tunnel area, and Creek Street at the same time.',
          'KTN Port weights these berths at full downtown impact in the passenger forecast. See the berths explainer for a map-style breakdown, and any day page for which ships are assigned where.',
        ],
        image: {
          src: '/guides/dock-street.jpg',
          alt: 'Historic Dock Street in downtown Ketchikan near the cruise waterfront',
          credit: 'Photo: public domain / Wikimedia Commons',
          creditUrl:
            'https://commons.wikimedia.org/wiki/File:Dock_Street,_Ketchikan,_Alaska.jpg',
        },
      },
      {
        heading: 'Ward Cove (WW / WE)',
        body: [
          'Ward Cove sits north of the downtown core. It absorbs large ships that would otherwise intensify the downtown stack. Guests still reach town — often by shuttle — so restaurants and shops stay busy, but the immediate dockside surge is elsewhere.',
          'When you compare two days with similar passenger totals, prefer the one with more Ward Cove / anchorage share if your goal is a walkable Creek Street morning.',
        ],
      },
      {
        heading: 'Anchorage and tenders',
        body: [
          'Anchorage assignments (codes like AN3 / ANR in the feed) mean the ship stays offshore and moves guests by tender. Capacity still counts toward the day’s total, but the arrival ramp is slower. Photographers and locals often notice a later, flatter peak.',
        ],
      },
    ],
  },
  {
    slug: 'ketchikan-shore-excursions-timing',
    title: 'Ketchikan Shore Excursions: Timing Tips',
    description:
      'Ketchikan shore excursions timing — when to book tours, when to DIY downtown attractions, and how ship arrival windows and rain change your port-day plan.',
    updated: '2026-07-22',
    readMinutes: 6,
    focusKeyword: 'Ketchikan shore excursions',
    tags: ['tours', 'port-day', 'planning'],
    audiences: ['cruise', 'planner'],
    relatedSlugs: [
      'things-to-do-in-ketchikan',
      'ketchikan-berth-locations-explained',
      'best-time-to-visit-ketchikan',
    ],
    hero: {
      src: '/guides/harbor-overview.jpg',
      alt: 'Ketchikan harbor and hillside from the cruise dock on a shore day',
      credit: 'Photo: Barek / Wikimedia Commons (public domain)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Ketchikan_from_cruise_dock.JPG',
    },
    faqs: [
      {
        question: 'Should I book the earliest Ketchikan shore excursion?',
        answer:
          'Early tours often beat the heaviest sidewalk crowds and protect against late tender or all-aboard stress. Check your ship’s arrival on the KTN Port day page first.',
      },
      {
        question: 'What if it rains in Ketchikan on excursion day?',
        answer:
          'Outdoor flights and some nature tours cancel more often on wet days. Downtown shops stay open; expected passengers ashore usually drop versus a clear day with the same ship slate.',
      },
      {
        question: 'Is DIY downtown better than a booked tour?',
        answer:
          'On heavy multi-ship days, booked tours that leave the docks early can feel less crowded than walking Creek Street at noon. On light or zero-ship days, DIY midday shopping and photography are wide open.',
      },
    ],
    sections: [
      {
        heading: 'Match the tour to the ship window',
        body: [
          'Your usable shore time is not the full day — it is arrival plus clearance through security and tendering, until the all-aboard buffer before departure. Open your date on KTN Port, note arrival/departure, then back-plan the tour length.',
          'If three ships overlap from mid-morning, popular independent stops (Creek Street, harborside shops) peak then. Guided buses sometimes leave before that surge; DIY walkers feel it most.',
        ],
      },
      {
        heading: 'DIY downtown strategy',
        relatedSlug: 'things-to-do-in-ketchikan',
        body: [
          'On heavy days, walk the core right after arrival or in the last 90 minutes before all-aboard. Midday is for booked tours away from the docks or indoor stops like the Discovery Center.',
          'On light or zero-ship days, midday is wide open — use the schedule calendar to hunt those dates if shopping and photography matter more than tour inventory. Pair this with our things to do in Ketchikan guide for attraction ideas.',
        ],
        image: {
          src: '/guides/creek-street.jpg',
          alt: 'Creek Street shops and boardwalk during a Ketchikan port call',
          credit: 'Photo: Diego Delso / Wikimedia Commons (CC BY-SA 4.0)',
          creditUrl:
            'https://commons.wikimedia.org/wiki/File:Calle_hist%C3%B3rica_Creek,_Ketchikan,_Alaska,_Estados_Unidos,_2017-08-16,_DD_52.jpg',
        },
      },
      {
        heading: 'Locals hosting guests',
        body: [
          'When friends visit on a cruise-heavy Saturday, send them the day card link. The one-line passenger summary and hourly curve set expectations better than a generic “summer is busy” warning.',
        ],
      },
    ],
  },
]

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug)
}

export function getFeaturedGuide(): Guide | undefined {
  return GUIDES.find((g) => g.featured) ?? GUIDES[0]
}
