// src/components/Feed.jsx
import { useState, useEffect } from 'react'

const ARCHETYPE_COLORS = {
  Chaser: '#ff6b35', Believer: '#c77dff', Hesitator: '#4cc9f0',
  Ghost: '#adb5bd', Accelerant: '#f72585', Martyr: '#e63946',
  Witness: '#90e0ef', Parasite: '#b5e48c', Oracle: '#ffd60a', Void: '#ff2d78',
}

const ARCHETYPE_LORE = {
  Chaser:     'Always running toward something. Never arrives.',
  Believer:   'Faith without evidence. Conviction without proof.',
  Hesitator:  'Sees the door. Won\'t walk through it.',
  Ghost:      'Present but not really here.',
  Accelerant: 'Pours fuel on everything, including themselves.',
  Martyr:     'Suffers loudly. Refuses rescue.',
  Witness:    'Watches everything. Does nothing.',
  Parasite:   'Feeds on others\' energy and calls it connection.',
  Oracle:     'Speaks in certainties they haven\'t earned.',
  Void:       'Nothing left to classify.',
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

function DelusionBar({ score }) {
  const color = scoreColor(score)
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
      }}>
        <span style={{ fontSize: '0.48rem', letterSpacing: '3px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
          delusion index
        </span>
        <span style={{ fontSize: '0.65rem', letterSpacing: '2px', color, fontFamily: 'JetBrains Mono, monospace' }}>
          {score}/100
        </span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            width: `${score}%`,
            transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: `0 0 10px ${color}66`,
          }}
        />
      </div>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={e => { e.stopPropagation(); copy() }}
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.45rem', letterSpacing: '3px',
        color: copied ? '#4cc9f0' : 'var(--text-dim)',
        background: 'transparent', border: `1px solid ${copied ? '#4cc9f0' : 'rgba(255,255,255,0.08)'}`,
        padding: '4px 12px', cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'color 0.2s, border-color 0.2s',
      }}
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  )
}

function FeedEntry({ entry, index }) {
  const [open, setOpen] = useState(false)
  const archetypeColor = ARCHETYPE_COLORS[entry.archetype] || 'var(--pink)'
  const delusionColor = scoreColor(entry.delusion_score)
  const lore = ARCHETYPE_LORE[entry.archetype]

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,45,120,0.06)',
        opacity: 0,
        animation: `fadeUp 0.5s ease forwards ${index * 0.06}s`,
        cursor: 'pointer',
        transition: 'none',
        background: open ? 'rgba(255,45,120,0.03)' : 'transparent',
      }}
      onClick={() => setOpen(o => !o)}
      onMouseEnter={e => { if (!open) { e.currentTarget.style.background = 'rgba(255,45,120,0.04)'; e.currentTarget.style.boxShadow = 'inset 0 0 40px rgba(255,45,120,0.06), 0 0 20px rgba(255,45,120,0.04)' } }}
      onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' } }}
    >
      {/* Collapsed row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto',
        gap: 20, alignItems: 'center',
        padding: '18px 24px',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.52rem', letterSpacing: '3px',
          color: 'var(--text-dim)', minWidth: 72,
        }}>
          {txId(entry.id)}
        </div>

        <div>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem', lineHeight: 1.7,
            color: 'var(--text)', marginBottom: open ? 0 : 8,
          }}>
            "{open || entry.confession.length <= 120
              ? entry.confession
              : entry.confession.slice(0, 120) + '…'}"
          </p>
          {!open && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.48rem', letterSpacing: '3px',
                color: archetypeColor, border: `1px solid ${archetypeColor}44`,
                padding: '2px 10px', textTransform: 'uppercase',
              }}>
                {entry.archetype}
              </span>
              <span style={{ fontSize: '0.52rem', letterSpacing: '2px', color: delusionColor }}>
                DELUSION {entry.delusion_score}/100
              </span>
            </div>
          )}
        </div>

        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.5rem', letterSpacing: '2px',
          color: 'var(--text-dim)', whiteSpace: 'nowrap',
        }}>
          {timeAgo(entry.created_at)}
        </div>

        <div style={{
          fontSize: '0.55rem', color: 'var(--text-dim)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          lineHeight: 1,
        }}>
          ▾
        </div>
      </div>

      {/* Expanded panel */}
      {open && (
        <div
          style={{
            padding: '0 24px 24px 120px',
            animation: 'fadeUp 0.25s ease forwards',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Archetype + badges row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{
              fontSize: '0.48rem', letterSpacing: '3px',
              color: archetypeColor, border: `1px solid ${archetypeColor}44`,
              padding: '2px 10px', textTransform: 'uppercase',
            }}>
              {entry.archetype}
            </span>
            {lore && (
              <span style={{
                fontSize: '0.52rem', letterSpacing: '1px',
                color: archetypeColor, opacity: 0.7, fontStyle: 'italic',
              }}>
                — {lore}
              </span>
            )}
          </div>

          {/* Delusion bar */}
          <DelusionBar score={entry.delusion_score} />

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 16 }}>
            <CopyButton text={`"${entry.confession}" — ${entry.archetype}, DELUSION ${entry.delusion_score}/100`} />
            <button
              onClick={() => setOpen(false)}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.45rem', letterSpacing: '3px',
                color: 'var(--text-dim)', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '4px 12px', cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              collapse
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterPills({ archetypes, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
      <button
        onClick={() => onChange(null)}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.45rem', letterSpacing: '3px',
          textTransform: 'uppercase',
          color: active === null ? '#000' : 'var(--text-dim)',
          background: active === null ? 'var(--pink)' : 'transparent',
          border: `1px solid ${active === null ? 'var(--pink)' : 'rgba(255,255,255,0.1)'}`,
          padding: '4px 14px', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        all
      </button>
      {archetypes.map(a => {
        const color = ARCHETYPE_COLORS[a] || 'var(--pink)'
        const isActive = active === a
        return (
          <button
            key={a}
            onClick={() => onChange(isActive ? null : a)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.45rem', letterSpacing: '3px',
              textTransform: 'uppercase',
              color: isActive ? '#000' : color,
              background: isActive ? color : 'transparent',
              border: `1px solid ${color}66`,
              padding: '4px 14px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {a}
          </button>
        )
      })}
    </div>
  )
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

export default function Feed() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(null)

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

  const archetypesInFeed = [...new Set(entries.map(e => e.archetype).filter(Boolean))]
  const visible = filter ? entries.filter(e => e.archetype === filter) : entries

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

        {/* Archetype filter pills */}
        {archetypesInFeed.length > 1 && (
          <FilterPills archetypes={archetypesInFeed} active={filter} onChange={setFilter} />
        )}

        {entries.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto auto',
            gap: 20, padding: '8px 24px 12px',
            borderBottom: '1px solid rgba(255,45,120,0.15)',
          }}>
            {['ID', 'TRANSMISSION', 'WHEN', ''].map((label, i) => (
              <span key={i} style={{
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
          : visible.length === 0
            ? <EmptyState />
            : visible.map((entry, i) => <FeedEntry key={entry.id} entry={entry} index={i} />)
        }
      </div>
    </section>
  )
}
