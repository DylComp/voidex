import { useState } from 'react'
import { scanStatement } from '../lib/api'

function scoreColor(score) {
  if (score < 30) return '#4cc9f0'
  if (score < 60) return '#ffd60a'
  if (score < 80) return '#ff6b35'
  return '#ff2d78'
}

export default function Scanner() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleScan = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await scanStatement(text)
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const color = result ? scoreColor(result.delusion_score) : 'var(--pink)'

  return (
    <section id="scan" style={{
      padding: '100px 80px',
      background: 'var(--surface)',
      borderTop: '1px solid var(--pink-ghost)',
      borderBottom: '1px solid var(--pink-ghost)',
    }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 02 — delusion scanner</div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 900, color: '#fff', marginBottom: 12,
        }}>
          Scan a Belief.
        </h2>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '2px',
          color: 'var(--text-dim)', marginBottom: 36,
        }}>
          Enter any statement. Receive a delusion score from 0–100.
        </p>

        <div style={{ display: 'flex', gap: 0 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
            placeholder="e.g. I knew it would recover."
            style={{
              flex: 1,
              background: 'var(--black)',
              border: '1px solid rgba(255,45,120,0.15)',
              borderRight: 'none',
              outline: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.78rem',
              color: 'var(--text)',
              padding: '14px 20px',
              caretColor: 'var(--pink)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--pink)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,45,120,0.15)'}
          />
          <button
            onClick={handleScan}
            disabled={!text.trim() || loading}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem', letterSpacing: '3px',
              textTransform: 'uppercase',
              color: (!text.trim() || loading) ? 'var(--text-dim)' : '#000',
              background: (!text.trim() || loading) ? 'var(--surface2)' : 'var(--pink)',
              border: '1px solid',
              borderColor: (!text.trim() || loading) ? 'rgba(255,45,120,0.15)' : 'var(--pink)',
              padding: '14px 24px', cursor: 'none',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '...' : '[ Scan ]'}
          </button>
        </div>

        {error && (
          <div style={{
            marginTop: 20, padding: '14px 18px',
            border: '1px solid rgba(255,45,120,0.3)',
            fontSize: '0.62rem', color: 'var(--pink)', letterSpacing: '2px',
          }}>
            ERR :: {error}
          </div>
        )}

        {result && (
          <div style={{
            marginTop: 32, padding: '32px',
            border: `1px solid ${color}33`,
            background: 'var(--black)',
            display: 'grid', gridTemplateColumns: 'auto 1fr',
            gap: 32, alignItems: 'center',
          }}>
            {/* Score display */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3.5rem', fontWeight: 900,
                color, lineHeight: 1,
                fontFamily: 'JetBrains Mono, monospace',
                textShadow: `0 0 20px ${color}66`,
              }}>
                {result.delusion_score}
              </div>
              <div style={{
                fontSize: '0.5rem', letterSpacing: '3px',
                color: 'var(--text-dim)', textTransform: 'uppercase',
                marginTop: 4,
              }}>
                / 100
              </div>
            </div>

            {/* Verdict */}
            <div>
              <div style={{
                fontSize: '0.55rem', letterSpacing: '4px',
                color: 'var(--text-dim)', textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                // Verdict
              </div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem', lineHeight: 1.8,
                color: 'var(--text)',
              }}>
                {result.delusion_reason}
              </p>
              <div style={{
                marginTop: 16, width: '100%',
                height: 3, background: 'var(--surface2)', borderRadius: 2,
              }}>
                <div
                  className="delusion-bar-fill"
                  style={{ width: `${result.delusion_score}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
