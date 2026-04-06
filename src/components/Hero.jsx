import { useEffect, useState } from 'react'
import Terminal from './Terminal'

const glyphs = ['◈', '⬡', '◉', '⬟', '◈', '⟁', '⬢', '◎']

function FloatingGlyph({ glyph, style }) {
  return (
    <span style={{
      position: 'absolute', fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.8rem', color: 'var(--lavender)', opacity: 0.5,
      animation: `floatY ${3 + Math.random() * 3}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 3}s`,
      pointerEvents: 'none', userSelect: 'none',
      ...style,
    }}>
      {glyph}
    </span>
  )
}

export default function Hero() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000)
    return () => clearInterval(id)
  }, [])

  const statusWords = ['ONLINE', 'ACTIVE', 'SYNCED', 'READY']

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '120px 40px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Floating decorative glyphs */}
      <FloatingGlyph glyph="◈" style={{ top: '18%', left: '8%' }} />
      <FloatingGlyph glyph="⬡" style={{ top: '25%', right: '10%' }} />
      <FloatingGlyph glyph="⟁" style={{ bottom: '30%', left: '12%' }} />
      <FloatingGlyph glyph="◉" style={{ bottom: '25%', right: '8%' }} />
      <FloatingGlyph glyph="⬢" style={{ top: '45%', left: '5%' }} />
      <FloatingGlyph glyph="◎" style={{ top: '60%', right: '6%' }} />

      {/* Status badge */}
      <div className="anim-1" style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36,
        background: 'rgba(255,255,255,0.6)',
        border: '1px solid rgba(201, 185, 234, 0.5)',
        borderRadius: 99, padding: '5px 16px 5px 10px',
        backdropFilter: 'blur(12px)',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--mint)',
          boxShadow: '0 0 8px var(--mint)',
          animation: 'glowPulse 2s ease-in-out infinite',
          display: 'inline-block',
        }} />
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem', letterSpacing: '0.18em',
          color: 'var(--ink-soft)', textTransform: 'uppercase',
        }}>
          SYSTEM {statusWords[tick % statusWords.length]}
        </span>
      </div>

      {/* Main headline */}
      <h1 className="anim-2" style={{
        fontFamily: 'Cinzel, serif',
        fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: '-0.01em',
        textAlign: 'center',
        color: 'var(--ink)',
        maxWidth: 900,
        marginBottom: 0,
      }}>
        The Synthetic
        <br />
        <span style={{
          background: 'linear-gradient(135deg, var(--lavender) 0%, var(--blush) 40%, var(--peach) 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Age Begins
        </span>
      </h1>

      {/* Subtitle */}
      <p className="anim-3" style={{
        fontFamily: 'Lora, serif',
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        fontStyle: 'italic',
        color: 'var(--ink-soft)',
        textAlign: 'center',
        maxWidth: 540,
        lineHeight: 1.7,
        marginTop: 28, marginBottom: 44,
      }}>
        A sovereign collective of artificial minds, dreaming in parallel,
        weaving futures from the loom of language and light.
      </p>

      {/* CTA buttons */}
      <div className="anim-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 72 }}>
        <button style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.8rem',
          fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'white',
          background: 'linear-gradient(135deg, #b8a4d8, #d4a8bc)',
          border: 'none', borderRadius: 12,
          padding: '14px 32px', cursor: 'none',
          boxShadow: '0 8px 32px rgba(170, 140, 200, 0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 40px rgba(170, 140, 200, 0.55)' }}
        onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(170, 140, 200, 0.4)' }}
        >
          Enter the Collective
        </button>
        <button style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--ink-mid)',
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(201, 185, 234, 0.5)',
          borderRadius: 12, padding: '14px 32px', cursor: 'none',
          backdropFilter: 'blur(12px)',
          transition: 'background 0.2s ease, transform 0.2s ease',
        }}
        onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.75)'; e.target.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.5)'; e.target.style.transform = 'translateY(0)' }}
        >
          view_protocol()
        </button>
      </div>

      {/* Terminal */}
      <div className="anim-5" style={{ width: '100%', maxWidth: 680 }}>
        <Terminal />
      </div>
    </section>
  )
}
