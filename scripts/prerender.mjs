// Bakes the rendered app into dist/index.html after `vite build`, so the
// deployed page carries the guide as plain HTML instead of an empty #root.
// Also emits JSON-LD from the same CAMERAS array the page renders.
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://drewhoover.com/m-mount-buying-guide/'
const OUT = path.join(ROOT, 'dist/index.html')

const vite = await createServer({
  root: ROOT,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'warn',
})
const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
const { CAMERAS } = await vite.ssrLoadModule('/src/data/cameras.js')
const appHtml = renderToString(React.createElement(App))
await vite.close()

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': SITE,
      url: SITE,
      name: 'Used Leica M buying guide: every full-frame digital M-mount body',
      description:
        'Every full-frame digital M-mount camera compared on sensor, usable ISO, shutter, screen, storage, sealing, reliability, size and used price.',
      isPartOf: { '@type': 'WebSite', url: 'https://drewhoover.com/', name: 'drewhoover.com' },
      mainEntity: { '@id': `${SITE}#cameras` },
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}#cameras`,
      name: 'Full-frame digital M-mount cameras in release order',
      numberOfItems: CAMERAS.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: CAMERAS.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: `${c.maker} ${c.name}`,
          brand: { '@type': 'Brand', name: c.maker },
          releaseDate: c.shipped,
          description: c.summary,
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'drewhoover.com', item: 'https://drewhoover.com/' },
        { '@type': 'ListItem', position: 2, name: 'M-mount buying guide', item: SITE },
      ],
    },
  ],
}

let html = fs.readFileSync(OUT, 'utf8')
if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find an empty #root in dist/index.html')
}
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
html = html.replace(
  '</head>',
  `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
)
fs.writeFileSync(OUT, html)

const lastmod = new Date().toISOString().slice(0, 10)
fs.writeFileSync(
  path.join(ROOT, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}</loc><lastmod>${lastmod}</lastmod></url>
</urlset>
`,
)

const words = appHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
console.log(`prerendered ${(appHtml.length / 1024).toFixed(0)}KB (~${words} words), ${CAMERAS.length} cameras in JSON-LD`)
