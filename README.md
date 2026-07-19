# Ketchikan Gateway

Daily cruise passenger forecasts for [ketchikangateway.org](https://ketchikangateway.org) — schedule capacity from the Port of Ketchikan database, cross-referenced with live weather so downtown foot traffic predictions reflect rain, wind, and clear skies.

## Features

- **Today** — downtown verdict (Quiet / Okay / Avoid 10–2), weather-adjusted passengers ashore, rain-relief callouts, hourly crowd curve, scheduled vs expected split, “why this number”
- **Calendar** — season schedule with crowd coloring and day detail
- **Activities** — picks filtered for the current crowd level
- **Weather × Crowds** — 7-day outlook and prediction model explanation
- **Manage** — CSV import, actuals logging (tunes the model), browser alerts, official port source links
- **PWA** — installable, offline-friendly schedule cache, auto-refresh every 10 minutes

## Prediction model

1. Sum ship capacity (preferring confirmed actuals)
2. Weight by ship size (mega vs expedition) and berth
3. Apply weather ashore factor (daily + hourly Open-Meteo)
4. Build an hourly ashore curve from arrival/departure ramps
5. Calibrate from logged predicted-vs-actual days

## Data

- Ship visits: PocketBase (`ship_visits`), with bundled `public/ship_visits.json` fallback
- Weather: [Open-Meteo](https://open-meteo.com/) for Ketchikan (55.34°N, 131.65°W)

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
