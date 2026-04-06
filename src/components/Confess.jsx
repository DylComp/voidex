import { useState } from 'react'
import { judgeConfession } from '../lib/api'
import { saveToHistory } from '../lib/storage'

const ARCHETYPE_COLORS = {
  Chaser: '#ff6b35', Believer: '#c77dff', Hesitator: '#4cc9f0',
  Ghost: '#adb5bd', Accelerant: '#f72585', Martyr: '#e63946',
  Witness: '#90e0ef', Parasite: '#b5e48c', Oracle: '#ffd60a', Void: '#ff2d78',
}

function GlitchLoader() {
  return (
    <div style={{ padding: '32px 0', textAlign: 'center' }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.7rem', letterSpacing: '4px',
        color: 'var(--pink)', animation: 'glitch 0.8s infinite',
      }}>
        // PROCESSING CONFESSION...
      </div>
      <div style={{
        marginTop: 16,
        width: 200, height: 2,
        background: 'var(--surface2)',
        margin: '16px auto 0',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'var(--pink)',
          animation: 'barFill 1.5s ease forwards',
          width: '100%',
        }} />
      </div>
    </div>
  )
}

function JudgmentCard({ result, confession }) {
  const color = ARCHETYPE_COLORS[result.archetype] || 'var(--pink)'

  const handleShare = () => {
    const text = `VOIDEX JUDGMENT\n\n"${confession.slice(0, 80)}..."\n\n${result.judgment}\n\nDELUSION SCORE: ${result.delusion_score}/100\nARCHETYPE: ${result.archetype}\n\nvoidex.io`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div style={{
      border: '1px solid rgba(255,45,120,0.2)',
      background: 'var(--surface)',
      padding: '28px 32px',
      marginTop: 24,
    }}>
      <div style={{
        fontSize: '0.55rem', letterSpacing: '5px',
        color: 'var(--pink-dim)', marginBottom: 20,
        textTransform: 'uppercase',
      }}>
        // VOIDEX JUDGMENT
      </div>

      <p style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.82rem', lineHeight: 1.9,
        color: 'var(--text)',
        borderLeft: '2px solid var(--pink-ghost)',
        paddingLeft: 16,
        marginBottom: 28,
      }}>
        {result.judgment}
      </p>

      {/* Delusion score */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{ fontSize: '0.58rem', letterSpacing: '3px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Delusion Score
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pink)' }}>
            {result.delusion_score}<span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>/100</span>
          </span>
        </div>
        <div style={{ width: '100%', height: 4, background: 'var(--surface2)', borderRadius: 2 }}>
          <div
            className="delusion-bar-fill"
            style={{ width: `${result.delusion_score}%` }}
          />
        </div>
        <div style={{
          marginTop: 8, fontSize: '0.62rem',
          color: 'var(--text-dim)', fontStyle: 'italic',
        }}>
          {result.delusion_reason}
        </div>
      </div>

      {/* Archetype */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '3px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }}>
            Archetype
          </div>
          <div style={{
            display: 'inline-block',
            border: `1px solid ${color}`,
            padding: '4px 14px',
            fontSize: '0.7rem', letterSpacing: '3px',
            color, textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            {result.archetype}
          </div>
        </div>
        <button
          onClick={handleShare}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem', letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--text-dim)', background: 'transparent',
            border: '1px solid rgba(255,45,120,0.15)',
            padding: '8px 16px', cursor: 'none',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--pink)'; e.currentTarget.style.borderColor = 'var(--pink)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'rgba(255,45,120,0.15)' }}
        >
          [ Copy Result ]
        </button>
      </div>
    </div>
  )
}

export default function Confess() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const judgment = await judgeConfession(text)
      setResult(judgment)
      const entry = {
        confession: text,
        ...judgment,
      }
      saveToHistory(entry)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  return (
    <section id="confess" style={{ padding: '100px 80px' }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 01 — confess</div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 900, color: '#fff',
          marginBottom: 12,
        }}>
          Speak.
        </h2>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '2px',
          color: 'var(--text-dim)', marginBottom: 36,
        }}>
          Type a thought, a trade, a belief, a regret. VOIDEX will judge you.
          <span style={{ color: 'var(--pink)', marginLeft: 8 }}>⌘ + Enter to transmit.</span>
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="speak. the void is listening."
          style={{
            width: '100%', minHeight: 160,
            background: 'var(--surface)',
            border: '1px solid rgba(255,45,120,0.15)',
            borderRadius: 0, outline: 'none',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem', lineHeight: 1.9,
            color: 'var(--text)',
            padding: '20px 24px',
            resize: 'vertical',
            caretColor: 'var(--pink)',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--pink)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,45,120,0.15)'}
        />

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: 12,
        }}>
          <span style={{ fontSize: '0.58rem', letterSpacing: '2px', color: 'var(--text-dim)' }}>
            {text.length} / ∞
          </span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '4px', textTransform: 'uppercase',
              color: (!text.trim() || loading) ? 'var(--text-dim)' : '#000',
              background: (!text.trim() || loading) ? 'transparent' : 'var(--pink)',
              border: '1px solid',
              borderColor: (!text.trim() || loading) ? 'rgba(255,45,120,0.2)' : 'var(--pink)',
              padding: '12px 28px', cursor: 'none',
              transition: 'all 0.2s',
            }}
          >
            [ Transmit ]
          </button>
        </div>

        {loading && <GlitchLoader />}

        {error && (
          <div style={{
            marginTop: 24, padding: '20px 24px',
            border: '1px solid rgba(255,45,120,0.3)',
            background: 'rgba(255,45,120,0.05)',
          }}>
            <div style={{
              fontSize: '0.52rem', letterSpacing: '4px',
              color: 'var(--pink)', textTransform: 'uppercase', marginBottom: 8,
            }}>
              // TRANSMISSION FAILED
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem', color: 'var(--text-dim)',
            }}>
              {error.includes('502') || error.includes('Upstream')
                ? 'The oracle is unreachable. Try again.'
                : error.includes('fetch')
                ? 'Network error. Check your connection.'
                : error}
            </div>
          </div>
        )}

        {result && <JudgmentCard result={result} confession={text} />}
      </div>
    </section>
  )
}
