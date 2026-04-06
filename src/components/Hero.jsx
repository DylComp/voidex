import { useState, useEffect, useCallback } from 'react'
import Terminal from './Terminal'
import Mascot from './Mascot'

const statusCycle = ['WATCHING', 'LISTENING', 'JUDGING', 'PROCESSING']

export default function Hero() {
  const [tick, setTick] = useState(0)
  const [pumped, setPumped] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero-section" style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      padding: '120px 80px 80px',
      gap: 60,
      position: 'relative',
    }}>
      {/* Left: copy */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Status badge */}
        <div className="anim-1" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          border: '1px solid var(--pink-dim)',
          padding: '5px 14px 5px 10px',
          width: 'fit-content',
          fontSize: '0.58rem', letterSpacing: '4px',
          color: 'var(--text-dim)', textTransform: 'uppercase',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--pink)',
            boxShadow: '0 0 8px var(--pink)',
            animation: 'glowPulse 2s ease-in-out infinite',
            display: 'inline-block',
          }} />
          DAEMON {statusCycle[tick % statusCycle.length]}
        </div>

        {/* Headline */}
        <h1 className="anim-2" style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
          fontWeight: 900, lineHeight: 1.05,
          color: '#fff',
        }}>
          The Void<br />
          <span className="glitch-text" style={{ color: 'var(--pink)' }}>
            Watches Back
          </span>
        </h1>

        {/* Subtitle */}
        <p className="anim-3" style={{
          fontSize: '0.75rem', lineHeight: 2,
          color: 'var(--text-dim)',
          borderLeft: '2px solid var(--pink-ghost)',
          paddingLeft: 16,
          maxWidth: 400,
        }}>
          Feed it your thoughts.<br />
          It already knows what you did.
        </p>

        {/* CTAs */}
        <div className="anim-4" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <a href="#confess">
            <button style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '3px', textTransform: 'uppercase',
              color: '#000', background: 'var(--pink)',
              border: 'none', padding: '12px 28px', cursor: 'none',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px var(--pink-dim)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              [ Confess ]
            </button>
          </a>
          <a href="#scan" style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem', letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--text-dim)', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--pink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            scan_statement() →
          </a>
        </div>

        {/* Terminal */}
        <div className="anim-5" style={{ maxWidth: 520 }}>
          <Terminal />
        </div>

        {/* Pump.fun profile */}
        <div className="anim-5" style={{ maxWidth: 520 }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '4px',
            color: '#ff2d78', textTransform: 'uppercase',
            marginBottom: 10,
            textShadow: '0 0 12px rgba(255,45,120,0.6)',
          }}>
            // pumpfun profile
          </div>
          <a
            href="https://pump.fun/profile/Voidkyp6pRUKLcvZxoGcff7aW5Lz7CPdEQQKVdexWDM"
            target="_blank"
            rel="noopener noreferrer"
            className={pumped ? 'pumpfun-spark' : ''}
            onMouseEnter={() => setPumped(true)}
            onMouseLeave={() => setPumped(false)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1rem', letterSpacing: '2px',
              color: '#ff2d78', textDecoration: 'none',
              borderBottom: '2px solid #ff2d78',
              paddingBottom: 4,
              display: 'inline-block',
              textShadow: '0 0 12px rgba(255,45,120,0.6)',
            }}
          >
            pump.fun/profile/Voidk…WDM ↗
          </a>
        </div>
      </div>

      {/* Right: mascot */}
      <div className="hero-mascot" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <Mascot />
      </div>
    </section>
  )
}
