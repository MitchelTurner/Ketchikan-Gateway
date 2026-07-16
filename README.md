# Ketchikan Gateway

Daily cruise passenger forecasts for [ketchikangateway.org](https://ketchikangateway.org) — schedule capacity from the Port of Ketchikan database, cross-referenced with live weather so downtown foot traffic predictions reflect rain, wind, and clear skies.

## Features

- **Today** — weather-adjusted passengers predicted ashore, crowd band, and ships in port
- **Calendar** — season schedule with crowd coloring and day detail
- **Activities** — picks filtered for the current crowd level
- **Weather × Crowds** — 7-day outlook and how the ashore factor works

## Data

- Ship visits: PocketBase (`ship_visits`), with bundled `public/ship_visits.json` fallback
- Weather: [Open-Meteo](https://open-meteo.com/) forecast for Ketchikan (55.34°N, 131.65°W)

Optional env:

```bash
VITE_POCKETBASE_URL=https://your-pocketbase-host
```

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
