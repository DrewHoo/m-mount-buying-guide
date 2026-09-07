// The guide's dataset. One object per full-frame digital M-mount body.
// Prices are point-in-time observations (see META.asOf and each camera's
// prices.sources). Specs cite the source in sources.md at the repo root.

export const META = {
  asOf: '2026-09-07',
  method:
    'Specs come from Leica and Pixii product pages, press releases and manuals, cross-checked against DPReview, Red Dot Forum and the Leica Camera Forum. "Usable ISO" is a reviewer-consensus judgment, not a spec. Used prices were read directly off the B&H Used, KEH and Adorama Used listings on the date above; where a retailer had no stock, the range notes that and falls back to other sellers. Reliability history is limited to failure modes that are widely reported and sourced; one-off forum anecdotes are excluded.',
  suffixes: [
    { suffix: 'Plain number (M9, M10, M11)', meaning: 'the base model of a generation.' },
    { suffix: 'Typ 240 / 262 / 246 / 220', meaning: 'Leica\'s 2012–2016 internal type numbers, when the base model was just called "M". Typ 240 = the CMOS M, Typ 262 = its stripped version, Typ 246 = the CMOS Monochrom, Typ 220 = the CCD M-E.' },
    { suffix: '-P', meaning: 'the "professional" trim: no red dot, "Leica" script engraved on top, sapphire-glass screen, sometimes a bigger buffer or a quieter shutter. Same sensor as the base model.' },
    { suffix: '-E', meaning: 'the entry model: the previous generation reissued cheaper, usually in anthracite grey with a feature or two removed.' },
    { suffix: '-D', meaning: 'no rear screen at all. Exposure via the meter in the finder, ISO on a dial, review images on your phone (M10-D onward) or never (M-D).' },
    { suffix: '-R', meaning: '"resolution": the M10 with a 40 MP sensor.' },
    { suffix: 'Monochrom', meaning: 'black-and-white only sensor, no color filter array. About one stop more sensitivity and more detail than the color sibling; no color, ever.' },
    { suffix: 'EV1', meaning: 'electronic viewfinder. The M EV1 drops the rangefinder for an EVF but keeps the M mount and M11 sensor.' },
  ],
  sources: [
    { label: 'Leica Camera product pages and archive', url: 'https://leica-camera.com/en-US/photography/cameras/m', note: 'current models, specs, manuals' },
    { label: 'Pixii Max product page', url: 'https://pixii.fr/', note: 'the only non-Leica full-frame M-mount body' },
    { label: 'Leica Camera Forum (l-camera-forum.com)', url: 'https://www.l-camera-forum.com/forum/', note: 'reliability threads, sensor-corrosion program history' },
    { label: 'DPReview Leica reviews', url: 'https://www.dpreview.com/products/leica', note: 'ISO usability judgments' },
    { label: 'B&H Photo Used', url: 'https://www.bhphotovideo.com/c/used', note: 'prices' },
    { label: 'KEH', url: 'https://www.keh.com/', note: 'prices' },
    { label: 'Adorama Used', url: 'https://www.adorama.com/l/Used', note: 'prices' },
    { label: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/', note: 'images, licensed per caption' },
  ],
}

export const FAMILIES = [
  { id: 'm9', short: 'M9 (CCD)', name: 'M9 generation', years: '2009–2012', color: '#b45309', blurb: 'Kodak 18 MP CCD. The "CCD look" bodies. No live view, loud shutter, ISO tops out early, and the sensor corrosion saga lives here.' },
  { id: 'm240', short: 'Typ 240', name: 'Typ 240 generation', years: '2012–2019', color: '#1f4e8c', blurb: 'First CMOS M: 24 MP CMOSIS sensor, live view, video, a much bigger battery, and a body 5 mm thicker than any other M.' },
  { id: 'm10', short: 'M10', name: 'M10 generation', years: '2017–2020', color: '#2f7d55', blurb: 'Back to film-M thickness, ISO dial on top, three rear buttons, Wi-Fi. The quietest mechanical shutters (-P, -R, Monochrom).' },
  { id: 'm11', short: 'M11', name: 'M11 generation', years: '2022–present', color: '#6d3fa0', blurb: '60 MP BSI sensor, electronic shutter, USB-C, internal storage, no baseplate. Black bodies are aluminum and 110 g lighter than silver.' },
  { id: 'ev1', short: 'M EV1', name: 'M EV1', years: '2025–present', color: '#b3282d', blurb: 'The M11 sensor and body with an electronic viewfinder instead of a rangefinder. Focuses as close as the lens allows.' },
  { id: 'pixii', short: 'Pixii', name: 'Pixii Max', years: '2024–present', color: '#0f766e', blurb: 'A French rangefinder with a 24 MP full-frame sensor, no screen, electronic shutter only, and internal storage. The only non-Leica option.' },
]

export const DIMENSIONS = [
  { id: 'sensor', label: 'CCD vs CMOS', why: 'The M9 family uses a CCD: prized for color rendering at base ISO, but no live view, slow readout and poor high ISO. Everything from the Typ 240 on is CMOS: cleaner high ISO, live view, EVF support, and on the M11 an electronic shutter. The "CCD look" is real but small; most of it is the color profile and the lack of an AA filter.' },
  { id: 'iso', label: 'Usable ISO', why: 'Max ISO is a marketing number. The guide lists two numbers from reviewer consensus: the highest ISO that is clean enough to print without noise reduction, and the highest that is still usable with some noise reduction. The M9\'s max is 2500 but its usable ceiling is about 1250; the M11\'s max is 50,000 and its usable ceiling is about 12,500.' },
  { id: 'age', label: 'Age since release', why: 'Age predicts three things: battery availability, firmware support, and whether Leica will still service the body. Leica generally services bodies for about a decade after discontinuation, and CCD sensor replacements for the M9 family are no longer available.' },
  { id: 'reliability', label: 'Reliability', why: 'What actually breaks. The big one is M9-family sensor corrosion, which totals a body if the sensor was never replaced. Rangefinder alignment drift affects every rangefinder and is a $200–400 adjustment. Grades: A no known failure mode, B minor or rare, C a real known issue to check for, D a known issue that can total the body.' },
  { id: 'storage', label: 'Card format', why: 'All Leica Ms use one SD slot. The M9 is picky about cards (SDHC only, some fast cards fail); the M11 adds a UHS-II slot plus 64 or 256 GB internal storage; the Pixii Max has no card slot at all.' },
  { id: 'sealing', label: 'Weather sealing', why: 'No M is IP-rated. Leica describes the M10 and M11 as having a degree of splash protection; the M9 and Typ 240 have none. In practice all of them survive light rain if you keep the lens mount dry. Lenses are not sealed.' },
  { id: 'closeFocus', label: 'Close focus', why: 'Every Leica rangefinder couples down to 0.7 m; some lenses focus closer but you must use live view or an EVF past 0.7 m. The M EV1 and, with an EVF, any Typ 240/M10/M11 focuses to the lens\'s own minimum. The M9 family has no live view, so 0.7 m is a hard limit.' },
  { id: 'shutter', label: 'Shutter', why: 'Mechanical shutter noise ranges from the M9\'s two-stage clack to the near-silent M10-P. The M11 adds a fully electronic shutter to 1/16,000 s, which is silent but rolls on fast motion. Flash sync is 1/180 s on every model.' },
  { id: 'screen', label: 'Screen', why: 'The M9\'s 2.5" 230k-dot screen is barely usable for checking focus. The Typ 240 onward have 3" 920k+ screens; the M10-P and M11 add touch. The -D models have no screen at all, which is a feature or a dealbreaker.' },
  { id: 'size', label: 'Size and weight', why: 'Depth is the number that matters in a jacket pocket: the Typ 240 is 42 mm, every other M is 37–39 mm. Weight ranges from 530 g (black M11) to 680 g (Typ 240).' },
  { id: 'price', label: 'Used cost', why: 'Observed at B&H Used, KEH and Adorama Used on the date at the top. Ranges span condition grades; the typical number is a mid-grade body. Leica used prices are sticky: bodies hold value, so buying a generation older rarely saves as much as you would expect.' },
]

// Recommendations by what the buyer says they want. ids reference CAMERAS.
export const PICKS = [
  { want: 'the CCD look and you accept the risks', picks: ['m9p', 'me220'], why: 'only buy a body with a documented corrosion-resistant sensor replacement; the M-E is the cheapest way in.' },
  { want: 'the cheapest modern-feeling M', picks: ['m262', 'me240'], why: 'CMOS, good screen, big battery, at the bottom of the price curve.' },
  { want: 'the best all-rounder used', picks: ['m10', 'm10p'], why: 'film-M size, ISO dial, quiet shutter on the -P, plenty of stock at every retailer.' },
  { want: 'high resolution without M11 prices', picks: ['m10r'], why: '40 MP and the quiet M10-P shutter.' },
  { want: 'the current camera with the fewest compromises', picks: ['m11', 'm11p'], why: 'best sensor, electronic shutter, internal storage, USB-C charging; black is the light one.' },
  { want: 'no screen, film-like shooting', picks: ['m10d', 'm11d'], why: 'the M10-D adds Wi-Fi review via phone; the M-D 262 has nothing at all.' },
  { want: 'black and white only', picks: ['m10m', 'm11m'], why: 'the M10 Monochrom is the value pick; the M11 Monochrom is the best mono sensor Leica has made.' },
  { want: 'close focus, glasses, or no rangefinder', picks: ['ev1'], why: 'the EVF removes the 0.7 m limit and the eye-relief problem.' },
  { want: 'something nobody else has', picks: ['pixiimax'], why: 'the only non-Leica full-frame M-mount body; buy new, the used market barely exists.' },
]

export const CAMERAS = []
