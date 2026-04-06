import { useState, useEffect } from 'react'
import { getHistory, clearHistory } from '../lib/storage'

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

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
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
      }}>
        // NO HISTORY — VOID HAS NOT YET JUDGED YOU
      </div>
      <p style={{
        fontSize: '0.65rem', letterSpacing: '2px',
        color: 'var(--text-dim)', lineHeight: 2,
      }}>
        Confess something above.<br />
        Your judgments will be recorded here.
      </p>
    </div>
  )
}

function HistoryCard({ entry, index }) {
  const [expanded, setExpanded] = useState(false)
  const archetypeColor = ARCHETYPE_COLORS[entry.archetype] || 'var(--pink)'
  const delusionColor = scoreColor(entry.delusion_score)

  return (
    <div
      style={{
        border: '1px solid rgba(255,45,120,0.08)',
        background: 'var(--surface)',
        marginBottom: 2,
        opacity: 0,
        animation: `fadeUp 0.5s ease forwards ${index * 0.05}s`,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.08)'}
    >
      {/* Header row — always visible */}
      <div
        onClick={() => setExpanded(x => !x)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: 20, alignItems: 'center',
          padding: '18px 24px',
          cursor: 'none',
        }}
      >
        {/* Confession snippet */}
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.72rem', lineHeight: 1.5,
          color: 'var(--text)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          "{entry.confession.length > 80
            ? entry.confession.slice(0, 80) + '…'
            : entry.confession}"
        </p>

        {/* Archetype */}
        <span style={{
          fontSize: '0.48rem', letterSpacing: '3px',
          color: archetypeColor,
          border: `1px solid ${archetypeColor}44`,
          padding: '2px 10px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {entry.archetype}
        </span>

        {/* Score */}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.85rem', fontWeight: 700,
          color: delusionColor,
          whiteSpace: 'nowrap',
        }}>
          {entry.delusion_score}
          <span style={{ fontSize: '0.48rem', color: 'var(--text-dim)', fontWeight: 400 }}>/100</span>
        </span>

        {/* Expand toggle + time */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '0.48rem', letterSpacing: '2px',
            color: 'var(--text-dim)', marginBottom: 4,
          }}>
            {timeAgo(entry.timestamp)}
          </div>
          <div style={{
            fontSize: '0.48rem', letterSpacing: '2px',
            color: 'var(--pink-dim)',
          }}>
            {expanded ? '▲ collapse' : '▼ expand'}
          </div>
        </div>
      </div>

      {/* Expanded judgment */}
      {expanded && (
        <div style={{
          borderTop: '1px solid rgba(255,45,120,0.08)',
          padding: '20px 24px 24px',
        }}>
          {/* Full confession */}
          <div style={{
            fontSize: '0.55rem', letterSpacing: '3px',
            color: 'var(--text-dim)', marginBottom: 10,
            textTransform: 'uppercase',
          }}>
            // Confession
          </div>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.72rem', lineHeight: 1.8,
            color: 'var(--text)',
            borderLeft: '2px solid var(--pink-ghost)',
            paddingLeft: 14,
            marginBottom: 20,
          }}>
            {entry.confession}
          </p>

          {/* Judgment */}
          <div style={{
            fontSize: '0.55rem', letterSpacing: '3px',
            color: 'var(--pink-dim)', marginBottom: 10,
            textTransform: 'uppercase',
          }}>
            // Judgment
          </div>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem', lineHeight: 1.9,
            color: 'var(--text)',
            marginBottom: 16,
          }}>
            {entry.judgment}
          </p>

          {/* Delusion reason */}
          <p style={{
            fontSize: '0.62rem', lineHeight: 1.7,
            color: 'var(--text-dim)', fontStyle: 'italic',
          }}>
            {entry.delusion_reason}
          </p>
        </div>
      )}
    </div>
  )
}

export default function History() {
  const [entries, setEntries] = useState([])
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    setEntries(getHistory())
  }, [])

  const handleClear = () => {
    if (!confirming) { setConfirming(true); return }
    clearHistory()
    setEntries([])
    setConfirming(false)
  }

  return (
    <section id="history" style={{
      padding: '100px 80px',
      background: 'var(--surface)',
      borderTop: '1px solid var(--pink-ghost)',
      borderBottom: '1px solid var(--pink-ghost)',
    }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 05 — history</div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
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
              Your Record.
            </h2>
            <p style={{
              fontSize: '0.7rem', letterSpacing: '2px',
              color: 'var(--text-dim)',
            }}>
              Every judgment the void has rendered upon you.
            </p>
          </div>

          {entries.length > 0 && (
            <button
              onClick={handleClear}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.55rem', letterSpacing: '3px',
                textTransform: 'uppercase',
                color: confirming ? 'var(--pink)' : 'var(--text-dim)',
                background: 'transparent',
                border: `1px solid ${confirming ? 'var(--pink)' : 'rgba(255,45,120,0.15)'}`,
                padding: '8px 16px', cursor: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--pink)'; e.currentTarget.style.borderColor = 'var(--pink)' }}
              onMouseLeave={e => {
                if (!confirming) {
                  e.currentTarget.style.color = 'var(--text-dim)'
                  e.currentTarget.style.borderColor = 'rgba(255,45,120,0.15)'
                }
              }}
            >
              {confirming ? '[ Confirm Purge ]' : '[ Purge Record ]'}
            </button>
          )}
        </div>

        {entries.length === 0
          ? <EmptyState />
          : entries.map((entry, i) => (
              <HistoryCard key={entry.timestamp} entry={entry} index={i} />
            ))
        }
      </div>
    </section>
  )
}
