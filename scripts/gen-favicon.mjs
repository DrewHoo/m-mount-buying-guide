// Favicon set from one SVG. Run: node scripts/gen-favicon.mjs
// A rangefinder silhouette: dark body, the viewfinder window, and the red dot.
import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public')
mkdirSync(outDir, { recursive: true })

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#1a1a1a"/>
  <rect x="8" y="22" width="48" height="26" rx="5" fill="#f7f6f3"/>
  <circle cx="32" cy="35" r="9" fill="#1a1a1a"/>
  <circle cx="32" cy="35" r="4.5" fill="#f7f6f3"/>
  <rect x="12" y="26" width="9" height="6" rx="1.5" fill="#1a1a1a"/>
  <circle cx="49" cy="29" r="3.5" fill="#b3282d"/>
</svg>`

writeFileSync(resolve(outDir, 'favicon.svg'), svg + '\n')
for (const { name, size } of [
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
]) {
  await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toFile(resolve(outDir, name))
  console.log(`wrote ${name}`)
}
