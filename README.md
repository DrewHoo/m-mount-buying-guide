# Full-frame M-mount buying guide

A used buyer's guide to every full-frame digital M-mount camera: Leica M9 through M11, the M EV1, and the Pixii Max. Live at https://drewhoover.com/m-mount-buying-guide/.

Each body is compared on the dimensions that decide a used purchase: sensor type (CCD vs CMOS), usable ISO rather than max ISO, age since release, reliability history, card format, weather sealing, close focus, shutter, screen, size, and what it sells for used at B&H, KEH and Adorama. Two views: a vertical timeline with images and distinguishing features, and a sortable table.

## Layout

- `src/data/cameras.js` — the dataset. One object per body plus the generation list, the dimension glossary, the "if you want…" picks, and the method text. Everything on the page renders from this file.
- `src/data/images.json` — source URLs for the licensed photos. `npm run fetch:images` downloads them into `public/img/` as 960px JPEGs. Attribution lives on each camera row (`image.credit`, `image.license`, `image.pageUrl`) and renders in the caption.
- `sources.md` — where each model's specs and reliability claims came from.
- `scripts/check-data.mjs` — data gate run in CI: required fields, known family ids, price ranges in order, image files present with attribution.
- `scripts/prerender.mjs` — bakes the rendered page into `dist/index.html` after `vite build`, plus JSON-LD and a sitemap.
- `scripts/gen-og.mjs` / `scripts/gen-favicon.mjs` — social image, index card and favicons, generated from the same dataset.

## Updating prices

Prices are point-in-time observations, not live listings. To refresh: read the used listings at B&H, KEH and Adorama for each model, update `prices.usedLow/usedTypical/usedHigh` and the `prices.sources` array on the camera row, then set `META.asOf`. Run `npm run check:data`.

## Commands

```
npm install
npm run dev          # local dev server
npm run build        # vite build + prerender
npm run check:data   # validate the dataset
npm run fetch:images # download licensed images listed in images.json
npm run gen:og       # regenerate og.png and card.png
```

## Images

Photographs are Creative Commons from Wikimedia Commons and Flickr, credited per image on the page. Six bodies (M Monochrom Typ 246, M-E Typ 240, M11-P, M11-D, M EV1, Pixii Max) have no freely licensed photograph anywhere; the page shows a labeled stand-in of the shared body or links to the manufacturer page. Contributions of CC-licensed photos of those are welcome.

Not affiliated with Leica, Pixii, or any retailer.
