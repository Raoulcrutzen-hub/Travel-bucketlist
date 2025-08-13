
# Travel Bucketlist (React + Vite + TS)

A ready-to-run web app to add dream trips and visualize them on a world map with tile-style markers.

## Features
- Quick add with autocomplete geocoding (Nominatim)
- Store trips in the browser (IndexedDB via Dexie)
- Filter by month / type / price / status
- World map with MapLibre GL and tile-like markers
- List view synchronized with filters
- Import/Export JSON

## Getting started
1. Ensure you have Node 18+ installed.
2. Install dependencies:
   ```bash
   npm i
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the printed URL in your browser.

## Notes
- The map uses a public demo style: `https://demotiles.maplibre.org/style.json`. You can swap it with your own style/tiles.
- Geocoding uses the public Nominatim endpoint. For production, host your own or add proper rate limiting & user-agent/terms compliance.

## Build
```bash
npm run build
npm run preview
```

## Project structure
- `src/components/*` — Map, form, filters, list, details
- `src/state/store.ts` — Zustand store and repo interactions
- `src/services/*` — Dexie repo, geocoding, import/export
- `src/data/seed.json` — initial sample trips
- `src/types` — basic types

## License
MIT
