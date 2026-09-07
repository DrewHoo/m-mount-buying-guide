// Downloads each camera's licensed source image into public/img/, resized to
// a 960px-wide JPEG so the page doesn't ship multi-megabyte Commons originals.
// Run once when adding an image: node scripts/fetch-images.mjs
// Reads src/data/images.json: [{ id, sourceUrl }]. Attribution lives on the
// camera row in cameras.js (image.credit / license / pageUrl).
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const list = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/images.json'), 'utf8'))
fs.mkdirSync(path.join(ROOT, 'public/img'), { recursive: true })

for (const { id, sourceUrl } of list) {
  const out = path.join(ROOT, 'public/img', `${id}.jpg`)
  if (fs.existsSync(out) && !process.argv.includes('--force')) { console.log(`skip ${id}`); continue }
  // Commons originals are 10MB+ and the upload host rate-limits bursts; ask
  // for a 1280px thumbnail through Special:FilePath instead.
  const commons = sourceUrl.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[0-9a-f]\/[0-9a-f]{2}\/(.+)$/)
  const url = commons ? `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/${commons[1]}&width=1280` : sourceUrl
  const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'm-mount-buying-guide/1.0 (https://drewhoover.com/m-mount-buying-guide/; drewhoover@gmail.com)' } })
  if (!res.ok) { console.error(`${id}: ${res.status} ${sourceUrl}`); continue }
  const buf = Buffer.from(await res.arrayBuffer())
  await sharp(buf).rotate().resize({ width: 960, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out)
  console.log(`wrote ${id}.jpg`)
  // Commons returns 429 on back-to-back fetches; pace them.
  await new Promise((r) => setTimeout(r, 1500))
}
