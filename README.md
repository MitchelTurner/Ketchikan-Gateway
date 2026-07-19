# Ketchikan Gateway

Daily cruise passenger forecasts for [ketchikangateway.org](https://ketchikangateway.org) — schedule capacity from the Port of Ketchikan database, cross-referenced with live weather so downtown foot traffic predictions reflect rain, wind, and clear skies.

## Features

- **Right now** — ships alongside this hour + whether to go downtown
- **Today / Tomorrow** — weather-adjusted passengers, verdict, rain relief, confidence
- **Shareable day cards** — `/day/YYYY-MM-DD` with glanceable summary + share button
- **Hourly crowd curve** — peak window + clearest stretch
- **Tide, wind & air** — NOAA tides + Open-Meteo for floatplane / fishing context
- **Activities** — favorites with go-now / wait tips + quiet-hours map
- **Alerts** — morning digest + extreme / rain-relief browser notifications
- **Manage** (admin-only at `/manage`) — CSV / season import, actuals, cancellations

## Prediction model

1. Sum ship capacity (preferring confirmed actuals; skip cancellations)
2. Weight by ship size, berth, and line profile (shopping / excursion / expedition)
3. Apply weather ashore factor (daily + hourly Open-Meteo)
4. Build an hourly ashore curve from arrival/departure ramps
5. Calibrate from logged predicted-vs-actual days
6. Score confidence (clear + simple slate → high; mixed rain / heavy day → low)

## Data

- Ship visits: PocketBase (`ship_visits`), with bundled `public/ship_visits.json` fallback
- Weather: [Open-Meteo](https://open-meteo.com/)
- Tides: [NOAA CO-OPS](https://tidesandcurrents.noaa.gov/) station 9450460 (Ketchikan)

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
