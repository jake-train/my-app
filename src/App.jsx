import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

function svgDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const images = {
  violin: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=300&h=300&fit=crop',
  viola: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=300&h=300&fit=crop',
  // Unsplash occasionally blocks/404s specific asset IDs; use an embedded SVG so cello never breaks.
  cello: svgDataUri(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0ea5e9"/>
      <stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="65%">
      <stop offset="0" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" rx="48" fill="#0b1220"/>
  <circle cx="420" cy="260" r="260" fill="url(#glow)"/>
  <g transform="translate(0,10)">
    <path d="M470 120c40 0 72 30 72 68 0 22-10 42-26 55l-20 16c-12 9-19 23-19 38v38c0 18 9 35 24 46l34 25c30 22 49 56 49 93 0 59-49 108-110 108-34 0-66-16-87-42l-10-12-10 12c-21 26-53 42-87 42-61 0-110-49-110-108 0-37 19-71 49-93l34-25c15-11 24-28 24-46v-38c0-15-7-29-19-38l-20-16c-16-13-26-33-26-55 0-38 32-68 72-68 25 0 48 12 61 31l12 17 12-17c13-19 36-31 61-31z"
          fill="url(#g)" opacity="0.95"/>
    <path d="M400 110v590" stroke="rgba(255,255,255,0.85)" stroke-width="10" stroke-linecap="round"/>
    <path d="M370 165h60M370 215h60M370 265h60M370 315h60"
          stroke="rgba(255,255,255,0.65)" stroke-width="8" stroke-linecap="round"/>
    <circle cx="330" cy="430" r="18" fill="rgba(255,255,255,0.75)"/>
    <circle cx="470" cy="430" r="18" fill="rgba(255,255,255,0.75)"/>
  </g>
  <text x="48" y="740" font-family="ui-sans-serif, system-ui, -apple-system" font-size="44" fill="rgba(255,255,255,0.92)" font-weight="700">Cello</text>
  <text x="48" y="784" font-family="ui-sans-serif, system-ui, -apple-system" font-size="22" fill="rgba(255,255,255,0.65)">Embedded image (won’t 404)</text>
</svg>`)
}

function App() {
  const [instruments, setInstruments] = useState([])

  useEffect(() => {
    getInstruments()
  }, [])

  async function getInstruments() {
    const { data } = await supabase.from('instruments').select()
    setInstruments(data)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(1200px 800px at 20% 0%, #1d2a5b 0%, #0b1220 45%, #070b14 100%)',
        color: 'rgba(255,255,255,0.92)',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 20px' }}>
        <header style={{ textAlign: 'left', marginBottom: 22 }}>
          <h1 style={{ margin: 0, fontSize: 34, letterSpacing: '-0.02em' }}>String Instruments</h1>
          <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            A quick gallery from your Supabase table, presented as responsive cards.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16
          }}
        >
          {instruments.map((instrument) => {
            const key = String(instrument.name || '').toLowerCase()
            const src = images[key] ?? images.cello

            return (
              <div
                key={instrument.id}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
                }}
              >
                <div style={{ padding: 12 }}>
                  <div
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.04)'
                    }}
                  >
                    <img
                      src={src}
                      alt={instrument.name}
                      loading="lazy"
                      style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = images.cello
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700 }}>
                      {instrument.name}
                    </div>
                    <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                      #{instrument.id}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {instruments.length === 0 ? (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 12,
              border: '1px dashed rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.7)'
            }}
          >
            No instruments yet. Add rows to your `instruments` table to see cards here.
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App