// src/components/Feed.jsx
import { useState, useEffect } from 'react'

const ARCHETYPE_COLORS = {
  Chaser: '#ff6b35', Believer: '#c77dff', Hesitator: '#4cc9f0',
  Ghost: '#adb5bd', Accelerant: '#f72585', Martyr: '#e63946',
  Witness: '#90e0ef', Parasite: '#b5e48c', Oracle: '#ffd60a', Void: '#ff2d78',
}

function scoreColor(score) {
  if (score < 30) return '#4cc9f0'
  if (score < 60) return '#ffd60a'
  if (score < 80) return '#ff6b35'
  return '#ff2d78'
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function txId(id) {
  return 'TX-' + String(id).padStart(5, '0')
}

function EmptyState() {
  return (
    <div style={{
      border: '1px solid rgba(255,45,120,0.08)',
      background: 'var(--surface)',
      padding: '64px 40px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.55rem', letterSpacing: '5px',
        color: 'var(--pink-dim)', marginBottom: 20,
        textTransform: 'uppercase',
        animation: 'glitch 6s infinite',
      }}>
        // FEED EMPTY — NO TRANSMISSIONS LOGGED
      </div>
      <p style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--text-dim)', lineHeight: 2 }}>
        Confess something above.<br />
        Your transmissions appear here.
      </p>
    </div>
  )
}

function FeedEntry({ entry, index }) {
  const archetypeColor = ARCHETYPE_COLORS[entry.archetype] || 'var(--pink)'
  const delusionColor = scoreColor(entry.delusion_score)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 24, alignItems: 'start',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,45,120,0.06)',
        transition: 'background 0.2s',
        opacity: 0,
        animation: `fadeUp 0.5s ease forwards ${index * 0.06}s`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,120,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.52rem', letterSpacing: '3px',
        color: 'var(--text-dim)', paddingTop: 2, minWidth: 72,
      }}>
        {txId(entry.id)}
      </div>

      <div>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem', lineHeight: 1.7,
          color: 'var(--text)', marginBottom: 10,
        }}>
          "{entry.confession.length > 100
            ? entry.confession.slice(0, 100) + '…'
            : entry.confession}"
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.48rem', letterSpacing: '3px',
            color: archetypeColor,
            border: `1px solid ${archetypeColor}44`,
            padding: '2px 10px', textTransform: 'uppercase',
          }}>
            {entry.archetype}
          </span>
          <span style={{ fontSize: '0.52rem', letterSpacing: '2px', color: delusionColor }}>
            DELUSION {entry.delusion_score}/100
          </span>
        </div>
      </div>

      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.5rem', letterSpacing: '2px',
        color: 'var(--text-dim)', paddingTop: 2, whiteSpace: 'nowrap',
      }}>
        {timeAgo(entry.created_at)}
      </div>
    </div>
  )
}

export default function Feed() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeed = () => {
    fetch('/api/feed')
      .then(r => r.json())
      .then(data => { setEntries(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchFeed()
    window.addEventListener('focus', fetchFeed)
    return () => window.removeEventListener('focus', fetchFeed)
  }, [])

  return (
    <section id="feed" style={{ padding: '100px 80px' }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 04 — feed</div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: 40,
        }}>
          <div>
            <h2 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
              fontWeight: 900, color: '#fff', marginBottom: 10,
            }}>
              The Feed.
            </h2>
            <p style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--text-dim)' }}>
              Transmissions logged to the void.
            </p>
          </div>

          {entries.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.52rem', letterSpacing: '3px', color: 'var(--text-dim)',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--pink)', boxShadow: '0 0 8px var(--pink)',
                display: 'inline-block', animation: 'glowPulse 2s ease-in-out infinite',
              }} />
              {entries.length} TRANSMISSION{entries.length !== 1 ? 'S' : ''}
            </div>
          )}
        </div>

        {entries.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto',
            gap: 24, padding: '8px 24px 12px',
            borderBottom: '1px solid rgba(255,45,120,0.15)',
          }}>
            {['ID', 'TRANSMISSION', 'WHEN'].map(label => (
              <span key={label} style={{
                fontSize: '0.45rem', letterSpacing: '4px',
                color: 'var(--pink-dim)', textTransform: 'uppercase',
              }}>
                {label}
              </span>
            ))}
          </div>
        )}

        {loading
          ? <div style={{ padding: '40px 24px', fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--text-dim)' }}>
              // LOADING TRANSMISSIONS...
            </div>
          : entries.length === 0
            ? <EmptyState />
            : entries.map((entry, i) => <FeedEntry key={entry.id} entry={entry} index={i} />)
        }
      </div>
    </section>
  )
}
