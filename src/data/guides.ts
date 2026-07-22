export type GuideFaq = { question: string; answer: string }

export type GuideListItem = {
  name: string
  detail: string
}

export type GuideSection = {
  heading: string
  body: string[]
  /** Optional consumer-facing list (attractions, trails, etc.) */
  items?: GuideListItem[]
}

export type Guide = {
  slug: string
  title: string
  description: string
  updated: string
  readMinutes: number
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
          'Ketchikan, Alaska packs a lot into a compact waterfront: historic Creek Street, world-famous totem parks, Tongass National Forest rainforest, and hiking trails that start almost from the docks. Whether you are hunting “things to do in Ketchikan,” comparing Ketchikan tourist attractions, or planning what to see on a short port call, this list covers the highlights locals and cruise guests actually use.',
          'Crowds swing with the cruise calendar. A multi-ship day can put more than 10,000 passengers ashore; a zero-ship day feels like a different town. Use the live schedule on KTN Port to pick quieter windows — then match attractions below to your time and weather.',
        ],
      },
      {
        heading: 'Downtown things to see',
        body: [
          'These Ketchikan attractions sit within walking distance of berths 1–4. On heavy ship days, visit before about 10 a.m. or after mid-afternoon when sidewalks thin.',
        ],
        items: [
          {
            name: 'Creek Street & Married Man’s Trail',
            detail:
              'Historic boardwalk over Ketchikan Creek — galleries, shops, and salmon viewing in season. The #1 downtown tourist stop; go early or late on busy cruise days.',
          },
          {
            name: 'Southeast Alaska Discovery Center',
            detail:
              'Indoor exhibits on rainforest ecology, Native culture, and regional natural history at 50 Main Street. Smart midday counter-programming when Creek Street is packed.',
          },
          {
            name: 'Waterfront, tunnel & harbors',
            detail:
              'Photo walks along the docks and through the downtown tunnel. Best light and fewer elbows early morning or near all-aboard.',
          },
          {
            name: 'Waterfront dining (e.g. Alaska Fish House)',
            detail:
              'Fish and chips and harbor views near the docks. Peak lunch lines hit noon–2 p.m. on ship days — eat early or late.',
          },
        ],
      },
      {
        heading: 'Culture & totem parks',
        body: [
          'Standing totem poles are among the most famous things to see in Ketchikan Alaska. Tour buses concentrate mid-morning through early afternoon.',
        ],
        items: [
          {
            name: 'Totem Bight State Historical Park',
            detail:
              'Fifteen restored poles and a replica clan house in forest north of downtown (~10 miles). Aim before 9 a.m. or after 3 p.m. to miss bus waves.',
          },
          {
            name: 'Saxman Native Village',
            detail:
              'Large collection of standing poles with cultural programs about 2.5 miles south of downtown. Afternoons are often quieter than the morning tour rush.',
          },
        ],
      },
      {
        heading: 'Ketchikan hiking trails & rainforest',
        body: [
          'Ketchikan sits in a temperate rainforest. These hiking trails and forest walks are some of the best things to do when you want green quiet instead of souvenir rows — and most stay calmer than Creek Street even on extreme ship days.',
        ],
        items: [
          {
            name: 'Rainbird Trail',
            detail:
              'About 1.3 miles of boardwalk through rainforest with Tongass Narrows views, near downtown off Park Avenue. Low cruise sensitivity — ideal on packed dock days.',
          },
          {
            name: 'Deer Mountain Trail',
            detail:
              'Steeper hike from near downtown toward alpine views above the port. Plan 3–5 hours; solitude improves after the first mile.',
          },
          {
            name: 'Ward Lake Recreation Area',
            detail:
              'Easy lakeside trails, picnic spots, and fishing ~7 miles north. Rarely on cruise excursion loops — a local favorite rainforest escape.',
          },
          {
            name: 'Rainforest canopy zip-lining',
            detail:
              'Guided zip lines and suspension bridges through old growth near Herring Cove. Book first or last slots; mid-morning fills with cruise groups.',
          },
        ],
      },
      {
        heading: 'Wildlife & adventure',
        body: [
          'Beyond the sidewalk attractions, these experiences show another side of Ketchikan things to do — water, wildlife, and time away from the pier.',
        ],
        items: [
          {
            name: 'Kayak Tongass Narrows',
            detail:
              'Paddle for seals, eagles, and occasional whales. Morning departures (around 7–8 a.m.) usually beat the busiest excursion windows.',
          },
          {
            name: 'Herring Cove bear viewing',
            detail:
              'Seasonal black bear fishing (roughly July–September). Midday tours crowd platforms; independent early or evening visits feel calmer.',
          },
        ],
      },
      {
        heading: 'How to time attractions around cruise crowds',
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
    title: 'Best Time to Visit Ketchikan Without Crowds',
    description:
      'How to time a Ketchikan visit around the cruise calendar — shoulder months, quiet weekdays, and how to read a multi-ship day.',
    updated: '2026-07-01',
    readMinutes: 8,
    faqs: [
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
          'Ketchikan’s visitor rhythm is driven by the cruise berth board. A four-ship downtown day can put well over 10,000 passengers ashore; a zero-ship day feels like a different town. Locals already plan errands around that swing. Visitors who want photos without elbows should too.',
          'KTN Port turns the Port of Ketchikan capacity calendar into a day-by-day crowd forecast. Use the schedule hub to pick dates before you book lodging or tours — then open the day page for the hourly shore curve.',
        ],
      },
      {
        heading: 'Shoulder season vs peak summer',
        body: [
          'May and September still see ships, but call frequency and passenger totals usually sit below July–August peaks. If your trip is flexible, aim for early May or the last two weeks of September and then cherry-pick low ship-count days inside that window.',
          'July and early August deliver the classic Alaska scenery — and the densest Front Street traffic. You can still visit then; just treat 10 a.m.–2 p.m. as peak and schedule creek walks, dining, or museum time on either side.',
        ],
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
    title: 'Ketchikan Berth Locations Explained',
    description:
      'Downtown berths 1–4 vs Ward Cove vs anchorage tenders — and why the dock assignment changes how crowded Creek Street feels.',
    updated: '2026-07-01',
    readMinutes: 7,
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
    ],
    sections: [
      {
        heading: 'Downtown berths 1–4',
        body: [
          'The classic Ketchikan cruise picture is ships stacked along the downtown docks. When three or four vessels are in together, walk-off traffic converges on Front Street, the tunnel area, and Creek Street at the same time.',
          'KTN Port weights these berths at full downtown impact in the passenger forecast. See the berths explainer for a map-style breakdown, and any day page for which ships are assigned where.',
        ],
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
    title: 'Ketchikan Shore Excursions Timing',
    description:
      'When to book tours, when to DIY downtown, and how ship arrival windows and rain change the plan.',
    updated: '2026-07-01',
    readMinutes: 6,
    faqs: [
      {
        question: 'Should I book the earliest shore excursion?',
        answer:
          'Early tours often beat the heaviest sidewalk crowds and protect against late tender or all-aboard stress. Check your ship’s arrival on the KTN Port day page first.',
      },
      {
        question: 'What if it rains?',
        answer:
          'Outdoor flights and some nature tours cancel more often on wet days. Downtown shops stay open; expected passengers ashore usually drop versus a clear day with the same ship slate.',
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
        body: [
          'On heavy days, walk the core right after arrival or in the last 90 minutes before all-aboard. Midday is for booked tours away from the docks or indoor stops.',
          'On light or zero-ship days, midday is wide open — use the schedule calendar to hunt those dates if shopping and photography matter more than tour inventory.',
        ],
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
