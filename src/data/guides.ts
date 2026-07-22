export type GuideFaq = { question: string; answer: string }

export type Guide = {
  slug: string
  title: string
  description: string
  updated: string
  readMinutes: number
  faqs: GuideFaq[]
  /** HTML-ish paragraphs as plain strings */
  sections: { heading: string; body: string[] }[]
}

export const GUIDES: Guide[] = [
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
