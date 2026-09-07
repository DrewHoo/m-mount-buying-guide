import React, { useEffect, useMemo, useState } from 'react'
import { CAMERAS, FAMILIES, DIMENSIONS, PICKS, META } from './data/cameras.js'

const BASE = import.meta.env.BASE_URL

const familyById = Object.fromEntries(FAMILIES.map((f) => [f.id, f]))

const fmtUsd = (n) => (n == null ? '—' : `$${n.toLocaleString('en-US')}`)
const yearsOld = (shipped) => {
  const [y, m] = shipped.split('-').map(Number)
  const now = new Date(META.asOf)
  const years = now.getFullYear() - y + (now.getMonth() + 1 - (m || 1)) / 12
  return Math.max(0, Math.round(years * 10) / 10)
}
const fmtDate = (ym) => {
  if (!ym) return '—'
  const [y, m] = ym.split('-')
  if (!m) return y
  return new Date(Date.UTC(+y, +m - 1, 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

// ---- URL state -------------------------------------------------------------
// Read on mount only (never during render): the prerender step renders the
// default view on the server and the URL is applied right after hydration.
const readUrl = () => {
  const p = new URLSearchParams(window.location.search)
  return {
    view: p.get('view') === 'table' ? 'table' : 'timeline',
    families: (p.get('family') || '').split(',').filter((id) => familyById[id]),
    mono: p.get('mono') !== 'hide',
    screenless: p.get('screenless') !== 'hide',
    sort: p.get('sort') || 'shipped',
    dir: p.get('dir') === 'desc' ? 'desc' : 'asc',
  }
}
const writeUrl = (s) => {
  const p = new URLSearchParams()
  if (s.view !== 'timeline') p.set('view', s.view)
  if (s.families.length) p.set('family', s.families.join(','))
  if (!s.mono) p.set('mono', 'hide')
  if (!s.screenless) p.set('screenless', 'hide')
  if (s.sort !== 'shipped') p.set('sort', s.sort)
  if (s.dir !== 'asc') p.set('dir', s.dir)
  const qs = p.toString()
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}

const DEFAULT_STATE = { view: 'timeline', families: [], mono: true, screenless: true, sort: 'shipped', dir: 'asc' }

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(readUrl())
    setHydrated(true)
  }, [])
  useEffect(() => {
    if (hydrated) writeUrl(state)
  }, [state, hydrated])

  const update = (patch) => setState((s) => ({ ...s, ...patch }))

  const visible = useMemo(
    () =>
      CAMERAS.filter(
        (c) =>
          (state.families.length === 0 || state.families.includes(c.family)) &&
          (state.mono || !c.sensor.mono) &&
          (state.screenless || c.screen.present),
      ),
    [state.families, state.mono, state.screenless],
  )

  return (
    <main>
      <Header />
      <Decoder />
      <Glossary />
      <Controls state={state} update={update} count={visible.length} />
      {state.view === 'timeline' ? (
        <Timeline cameras={visible} />
      ) : (
        <Table cameras={visible} sort={state.sort} dir={state.dir} onSort={(sort, dir) => update({ sort, dir })} />
      )}
      <Picks />
      <Sources />
    </main>
  )
}

// ---- Header ----------------------------------------------------------------
function Header() {
  return (
    <header className="hero">
      <h1 className="m-head">
        <span className="m-eyebrow">Used buyer's guide</span>
        <span className="m-title">Every full-frame digital M-mount camera, compared on what matters</span>
      </h1>
      <p className="lede">
        Leica has shipped a dozen-plus full-frame rangefinder bodies since the M9 in 2009, and the names (M-P, Typ 240, M-E, M-D,
        M10-R, M11-P) hide which ones actually differ. This guide lines them all up, plus the EVF-only M EV1 and the
        screenless Pixii Max, on the dimensions that decide a used purchase: sensor type and usable ISO, shutter, screen,
        cards, sealing, close focus, reliability history, size, and what they sell for used at B&amp;H, KEH and Adorama.
      </p>
      <p className="lede small">
        Prices observed {fmtDate(META.asOf)}. Images are Creative Commons photographs credited per camera. Not affiliated
        with Leica or any retailer.
      </p>
    </header>
  )
}

// ---- Naming decoder --------------------------------------------------------
function Decoder() {
  return (
    <section className="card decoder">
      <h2>Decoding the names</h2>
      <div className="decoder-grid">
        <div>
          <h3>Generations</h3>
          <ul className="plain">
            {FAMILIES.map((f) => (
              <li key={f.id}>
                <span className="dot" style={{ background: f.color }} />
                <strong>{f.name}</strong> <span className="muted">({f.years})</span> — {f.blurb}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Suffixes</h3>
          <ul className="plain">
            {META.suffixes.map((s) => (
              <li key={s.suffix}>
                <strong>{s.suffix}</strong> — {s.meaning}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ---- Dimension glossary ----------------------------------------------------
function Glossary() {
  const [open, setOpen] = useState(false)
  return (
    <section className="card glossary">
      <button className="disclosure" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <h2>What the dimensions mean and why they matter</h2>
        <span className="chev">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <dl className="dims">
          {DIMENSIONS.map((d) => (
            <div key={d.id}>
              <dt>{d.label}</dt>
              <dd>{d.why}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

// ---- Controls --------------------------------------------------------------
function Controls({ state, update, count }) {
  const toggleFamily = (id) =>
    update({
      families: state.families.includes(id) ? state.families.filter((f) => f !== id) : [...state.families, id],
    })
  return (
    <div className="controls">
      <div className="seg" role="tablist" aria-label="View">
        <button role="tab" aria-selected={state.view === 'timeline'} className={state.view === 'timeline' ? 'on' : ''} onClick={() => update({ view: 'timeline' })}>
          Timeline
        </button>
        <button role="tab" aria-selected={state.view === 'table'} className={state.view === 'table' ? 'on' : ''} onClick={() => update({ view: 'table' })}>
          Table
        </button>
      </div>
      <div className="chips" aria-label="Filter by generation">
        {FAMILIES.map((f) => {
          const on = state.families.length === 0 || state.families.includes(f.id)
          return (
            <button key={f.id} className={`chip ${on ? 'on' : ''}`} onClick={() => toggleFamily(f.id)} style={{ '--chip': f.color }}>
              <span className="dot" />
              {f.short}
            </button>
          )
        })}
        {state.families.length > 0 && (
          <button className="chip clear" onClick={() => update({ families: [] })}>
            all
          </button>
        )}
      </div>
      <div className="toggles">
        <label>
          <input type="checkbox" checked={state.mono} onChange={(e) => update({ mono: e.target.checked })} /> Monochrom
        </label>
        <label>
          <input type="checkbox" checked={state.screenless} onChange={(e) => update({ screenless: e.target.checked })} /> Screenless
        </label>
        <span className="count muted">{count} bodies</span>
      </div>
    </div>
  )
}

// ---- Shared pieces ---------------------------------------------------------
function Chip({ label, value, tone }) {
  return (
    <span className={`spec ${tone || ''}`}>
      <span className="spec-k">{label}</span>
      <span className="spec-v">{value}</span>
    </span>
  )
}

const relTone = { A: 'good', B: 'ok', C: 'warn', D: 'bad' }
const sealingLabel = { none: 'None', splash: 'Splash resistant', ip: 'IP-rated' }

function Credit({ img }) {
  return (
    <>
      <a href={img.pageUrl} target="_blank" rel="noreferrer">
        {img.credit}
      </a>
      , {img.license}
    </>
  )
}

function CameraImage({ camera, size }) {
  const img = camera.image
  if (!img) {
    return (
      <div className={`img-missing ${size}`}>
        <span>No freely licensed photo yet.</span>
        <a href={camera.referenceUrl} target="_blank" rel="noreferrer">
          Manufacturer page
        </a>
      </div>
    )
  }
  return (
    <div className="imgs">
      <figure className={`camimg ${size}`}>
        <img src={`${BASE}${img.src}`} alt={img.alt} loading="lazy" />
        {img.standIn && <span className="standin">stand-in</span>}
        <figcaption>
          {img.standIn ? <span className="standin-note">{img.standIn} </span> : null}
          <Credit img={img} />
        </figcaption>
      </figure>
      {camera.altImage && (
        <figure className="camimg alt">
          <img src={`${BASE}${camera.altImage.src}`} alt={camera.altImage.alt} loading="lazy" />
          <figcaption>
            {camera.altImage.caption} <Credit img={camera.altImage} />
          </figcaption>
        </figure>
      )}
    </div>
  )
}

// ---- Timeline --------------------------------------------------------------
function Timeline({ cameras }) {
  // Strict ship order, so a late reissue (the 2019 M-E Typ 240) lands among
  // the M10s. The generation header appears once, on first appearance; every
  // entry also carries its generation on the rail so late entries read right.
  const seen = new Set()
  return (
    <section className="timeline" aria-label="Release timeline">
      {cameras.map((c) => {
        const fam = familyById[c.family]
        const showFamily = !seen.has(fam.id)
        seen.add(fam.id)
        return (
          <React.Fragment key={c.id}>
            {showFamily && (
              <div className="tl-family" style={{ '--fam': fam.color }}>
                <span className="tl-family-dot" />
                <h2 id={`fam-${fam.id}`}>
                  {fam.name} <span className="muted">{fam.years}</span>
                </h2>
              </div>
            )}
            <TimelineEntry camera={c} fam={fam} />
          </React.Fragment>
        )
      })}
    </section>
  )
}

function TimelineEntry({ camera: c, fam }) {
  const age = yearsOld(c.shipped)
  return (
    <article className="tl-entry" id={c.id} style={{ '--fam': fam.color }}>
      <div className="tl-rail">
        <span className="tl-dot" />
        <span className="tl-date">{fmtDate(c.shipped)}</span>
        <span className="tl-age muted">{age} yrs old</span>
        <span className="tl-fam">{fam.short}</span>
      </div>
      <div className="card tl-card">
        <div className="tl-top">
          <CameraImage camera={c} size="lg" />
          <div className="tl-head">
            <h3>
              {c.maker} {c.name}
            </h3>
            <p className="role">{c.role}</p>
            <p className="summary">{c.summary}</p>
            <div className="specs">
              <Chip label="Sensor" value={`${c.sensor.mp} MP ${c.sensor.type}${c.sensor.mono ? ' mono' : ''}`} />
              <Chip label="Usable ISO" value={`${c.iso.usable.toLocaleString()} clean / ${c.iso.ceiling.toLocaleString()} max`} />
              <Chip label="Shutter" value={c.shutter.short} />
              <Chip label="Screen" value={c.screen.short} />
              <Chip label="Cards" value={c.storage.short} />
              <Chip label="Sealing" value={sealingLabel[c.sealing.level]} tone={c.sealing.level === 'none' ? 'warn' : 'good'} />
              <Chip label="Close focus" value={`${c.closeFocus.m} m`} />
              <Chip label="Size" value={`${c.body.weight} g · ${c.body.d} mm deep`} />
              <Chip label="Reliability" value={c.reliability.grade} tone={relTone[c.reliability.grade]} />
            </div>
          </div>
        </div>
        <div className="tl-body">
          <div>
            <h4>How to recognize it</h4>
            <ul>
              {c.identifiers.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Reliability history</h4>
            {c.reliability.issues.length === 0 ? (
              <p className="muted">No widely reported failure mode specific to this body.</p>
            ) : (
              <ul>
                {c.reliability.issues.map((it, i) => (
                  <li key={i}>
                    <strong>{it.title}.</strong> {it.detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h4>Used price</h4>
            <p className="price">
              <span className="price-typ">{fmtUsd(c.prices.usedTypical)}</span>
              <span className="muted"> typical · {fmtUsd(c.prices.usedLow)}–{fmtUsd(c.prices.usedHigh)}</span>
            </p>
            {c.prices.newPrice && <p className="muted small">Still sold new at {fmtUsd(c.prices.newPrice)}.</p>}
            <p className="muted small">Launch MSRP {fmtUsd(c.msrp)}.</p>
            {c.prices.sources.length > 0 && (
              <ul className="src-list">
                {c.prices.sources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.retailer}
                    </a>{' '}
                    {fmtUsd(s.price)} <span className="muted">{s.grade}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="tl-notes">
          <Note label="ISO">{c.iso.note}</Note>
          <Note label="Shutter">{c.shutter.noise}</Note>
          <Note label="Screen">{c.screen.note}</Note>
          <Note label="Cards">{c.storage.note}</Note>
          <Note label="Sealing">{c.sealing.note}</Note>
          <Note label="Close focus">{c.closeFocus.note}</Note>
          <Note label="Battery">{c.battery.note}</Note>
          <Note label="Firmware">{c.firmware.note}</Note>
        </div>
        <p className="verdict">
          <strong>Verdict.</strong> {c.verdict}
        </p>
      </div>
    </article>
  )
}

function Note({ label, children }) {
  if (!children) return null
  return (
    <p className="note">
      <span className="note-k">{label}</span> {children}
    </p>
  )
}

// ---- Table -----------------------------------------------------------------
const COLUMNS = [
  { id: 'name', label: 'Model', get: (c) => c.name, render: (c) => <ModelCell camera={c} /> },
  { id: 'shipped', label: 'Shipped', get: (c) => c.shipped, render: (c) => `${fmtDate(c.shipped)} (${yearsOld(c.shipped)} y)` },
  { id: 'sensor', label: 'Sensor', get: (c) => `${c.sensor.type}${c.sensor.mono ? '-mono' : ''}-${c.sensor.mp}`, render: (c) => `${c.sensor.mp} MP ${c.sensor.type}${c.sensor.mono ? ' mono' : ''}` },
  { id: 'iso', label: 'Usable ISO', get: (c) => c.iso.usable, render: (c) => `${c.iso.usable.toLocaleString()} / ${c.iso.ceiling.toLocaleString()}`, title: 'clean / max usable' },
  { id: 'shutter', label: 'Shutter', get: (c) => c.shutter.short, render: (c) => c.shutter.short },
  { id: 'screen', label: 'Screen', get: (c) => (c.screen.present ? c.screen.size : 0), render: (c) => c.screen.short },
  { id: 'cards', label: 'Storage', get: (c) => c.storage.short, render: (c) => c.storage.short },
  { id: 'sealing', label: 'Sealing', get: (c) => ({ none: 0, splash: 1, ip: 2 })[c.sealing.level], render: (c) => sealingLabel[c.sealing.level] },
  { id: 'close', label: 'Close focus', get: (c) => c.closeFocus.m, render: (c) => `${c.closeFocus.m} m` },
  { id: 'weight', label: 'Weight', get: (c) => c.body.weight, render: (c) => `${c.body.weight} g` },
  { id: 'depth', label: 'Depth', get: (c) => c.body.d, render: (c) => `${c.body.d} mm` },
  { id: 'rel', label: 'Reliability', get: (c) => c.reliability.grade, render: (c) => <span className={`grade ${relTone[c.reliability.grade]}`}>{c.reliability.grade}</span> },
  { id: 'price', label: 'Used, typical', get: (c) => c.prices.usedTypical ?? Infinity, render: (c) => fmtUsd(c.prices.usedTypical) },
  { id: 'range', label: 'Used range', get: (c) => c.prices.usedLow ?? Infinity, render: (c) => `${fmtUsd(c.prices.usedLow)}–${fmtUsd(c.prices.usedHigh)}` },
]

function ModelCell({ camera: c }) {
  const fam = familyById[c.family]
  return (
    <span className="model-cell">
      <span className="dot" style={{ background: fam.color }} />
      <a href={`#${c.id}`} onClick={(e) => e.stopPropagation()}>
        {c.name}
      </a>
      {c.sensor.mono && <span className="tag">mono</span>}
      {!c.screen.present && <span className="tag">no screen</span>}
    </span>
  )
}

function Table({ cameras, sort, dir, onSort }) {
  const col = COLUMNS.find((c) => c.id === sort) || COLUMNS[1]
  const rows = useMemo(() => {
    const arr = [...cameras]
    arr.sort((a, b) => {
      const x = col.get(a)
      const y = col.get(b)
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))
      return dir === 'asc' ? r : -r
    })
    return arr
  }, [cameras, col, dir])
  const click = (id) => onSort(id, sort === id && dir === 'asc' ? 'desc' : 'asc')
  return (
    <section className="card table-wrap" aria-label="Comparison table">
      <div className="scroll">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.id} title={c.title} aria-sort={sort === c.id ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button onClick={() => click(c.id)}>
                    {c.label}
                    {sort === c.id && <span className="sort">{dir === 'asc' ? '▲' : '▼'}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                {COLUMNS.map((col) => (
                  <td key={col.id}>{col.render(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">
        Usable ISO is the reviewer consensus for "clean" and "still usable with noise reduction", not the max setting. Reliability
        grades: A no known failure mode on a current platform, B no known failure mode but an aging platform, C a real known
        issue to check for, D a known issue that can total the body. Click a model name to jump to its timeline entry.
      </p>
    </section>
  )
}

// ---- Picks -----------------------------------------------------------------
function Picks() {
  return (
    <section className="card picks">
      <h2>If you want…</h2>
      <ul className="picks-list">
        {PICKS.map((p) => (
          <li key={p.want}>
            <strong>{p.want}</strong> →{' '}
            {p.picks.map((id, i) => {
              const c = CAMERAS.find((x) => x.id === id)
              return (
                <React.Fragment key={id}>
                  {i > 0 && ', '}
                  <a href={`#${id}`}>{c.name}</a>
                </React.Fragment>
              )
            })}
            <span className="muted"> — {p.why}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ---- Sources ---------------------------------------------------------------
function Sources() {
  return (
    <section className="card sources">
      <h2>Method and sources</h2>
      <p>{META.method}</p>
      <ul>
        {META.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
            {s.note && <span className="muted"> — {s.note}</span>}
          </li>
        ))}
      </ul>
      <p className="muted small">
        Not included: the M8 and M8.2 (APS-H, 1.33× crop), the Epson R-D1 and Pixii A1571/A2572 (APS-C), and the analog
        Leica M-A/MP. Adapting M lenses to a Sony, Nikon Z or Sigma body works but isn't a rangefinder and is out of scope here.
      </p>
    </section>
  )
}
