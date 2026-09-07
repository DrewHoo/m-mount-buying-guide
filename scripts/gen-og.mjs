// OG preview (1200x630) and drewhoover.com index card (1200x750, 8:5).
// Run: node scripts/gen-og.mjs. Outputs are committed; CI does not regenerate.
// The visual is a horizontal timeline of the bodies, colored by generation,
// drawn from the same CAMERAS/FAMILIES data the page renders.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CAMERAS, FAMILIES } from '../src/data/cameras.js'

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public')
mkdirSync(outDir, { recursive: true })

const colorOf = Object.fromEntries(FAMILIES.map((f) => [f.id, f.color]))
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const render = (W, H, name) => {
  const left = 60
  const right = W - 60
  const railY = H - 200
  const years = CAMERAS.map((c) => +c.shipped.slice(0, 4))
  const y0 = Math.min(...years) - 0.5
  const y1 = Math.max(...years) + 0.8
  const x = (ym) => {
    const [y, m] = ym.split('-').map(Number)
    return left + ((y + ((m || 1) - 1) / 12 - y0) / (y1 - y0)) * (right - left)
  }
  // Stagger labels so neighbours don't collide.
  const labels = CAMERAS.map((c, i) => {
    const cx = x(c.shipped)
    const lane = i % 4
    const ly = railY - 34 - lane * 26
    return `<line x1="${cx}" y1="${railY - 8}" x2="${cx}" y2="${ly + 6}" stroke="${colorOf[c.family]}" stroke-opacity="0.5" stroke-width="1.5"/>
      <text x="${cx}" y="${ly}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="17" fill="#e8e8e8" font-weight="600">${esc(c.name)}</text>`
  })
  const dots = CAMERAS.map((c) => `<circle cx="${x(c.shipped)}" cy="${railY}" r="9" fill="${colorOf[c.family]}" stroke="#0a0d12" stroke-width="3"/>`)
  const ticks = []
  for (let y = Math.ceil(y0); y <= Math.floor(y1); y += 2) {
    ticks.push(`<text x="${x(`${y}-01`)}" y="${railY + 34}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="#9ba3b5">${y}</text>`)
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#11151c"/><stop offset="100%" stop-color="#0a0d12"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="${left}" y="92" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#9ba3b5" font-weight="600" letter-spacing="3">USED BUYER'S GUIDE</text>
  <text x="${left}" y="160" font-family="Helvetica, Arial, sans-serif" font-size="58" fill="#ffffff" font-weight="700" letter-spacing="-1.5">Every full-frame digital M-mount</text>
  <text x="${left}" y="222" font-family="Helvetica, Arial, sans-serif" font-size="58" fill="#ffffff" font-weight="700" letter-spacing="-1.5">camera, compared on what matters</text>
  <text x="${left}" y="268" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#9ba3b5">CCD vs CMOS · usable ISO · shutter · screen · cards · sealing · reliability · size · used price</text>
  <line x1="${left}" y1="${railY}" x2="${right}" y2="${railY}" stroke="#3a4152" stroke-width="3"/>
  ${labels.join('\n')}
  ${dots.join('\n')}
  ${ticks.join('\n')}
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#b3282d"/>
  <text x="${right}" y="${H - 22}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#9ba3b5">drewhoover.com/m-mount-buying-guide</text>
</svg>`
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(resolve(outDir, name))
}

await render(1200, 630, 'og.png')
await render(1200, 750, 'card.png')
console.log('wrote og.png and card.png')
