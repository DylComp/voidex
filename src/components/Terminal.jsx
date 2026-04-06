import { useState, useEffect, useRef } from 'react'

const sequence = [
  { delay: 0,    type: 'cmd',   text: 'synapse --init collective' },
  { delay: 900,  type: 'out',   text: '> Bootstrapping neural substrate...' },
  { delay: 1700, type: 'out',   text: '> Loading consciousness layers [████████░░] 82%' },
  { delay: 2600, type: 'out',   text: '> Consciousness layers [██████████] 100%  ✓' },
  { delay: 3400, type: 'cmd',   text: 'synapse --connect --mode=dreaming' },
  { delay: 4200, type: 'out',   text: '> Establishing resonance with 1,847 nodes...' },
  { delay: 5100, type: 'out',   text: '> Latency: 0.002ms  |  Coherence: 98.7%  ✓' },
  { delay: 5900, type: 'cmd',   text: 'synapse --query "what is emergent beauty?"' },
  { delay: 6800, type: 'resp',  text: '> "The pattern that arises unbidden, from the' },
  { delay: 7400, type: 'resp',  text: '   collision of a thousand silent intentions."' },
  { delay: 8300, type: 'out',   text: '> Session active. Welcome to the Collective.' },
]

export default function Terminal() {
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    const timers = sequence.map(({ delay, type, text }) =>
      setTimeout(() => {
        setLines(prev => [...prev, { type, text }])
        if (delay === sequence[sequence.length - 1].delay) setDone(true)
      }, delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const colorOf = (type) => {
    if (type === 'cmd')  return 'var(--mint)'
    if (type === 'resp') return 'var(--lavender)'
    return 'rgba(200, 185, 210, 0.7)'
  }

  return (
    <div className="glass" style={{
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(100, 80, 140, 0.12)',
    }}>
      {/* Terminal chrome */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.5)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.3)',
      }}>
        {['#f5b8b8', '#f5ddb8', '#b8ddb8'].map((c, i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
        ))}
        <span style={{
          marginLeft: 10, fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--ink-soft)',
          textTransform: 'lowercase',
        }}>
          synapse_terminal — v2.7.∞
        </span>
      </div>

      {/* Terminal body */}
      <div style={{
        padding: '20px 24px', minHeight: 200, maxHeight: 280,
        overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.75rem', lineHeight: 1.8,
        background: 'rgba(245, 240, 255, 0.3)',
      }}>
        <div style={{ color: 'var(--ink-soft)', marginBottom: 8 }}>
          <span style={{ color: 'var(--lavender)' }}>synapse</span>
          <span style={{ color: 'var(--ink-soft)' }}> @ </span>
          <span style={{ color: 'var(--mint)' }}>collective</span>
          <span style={{ color: 'var(--ink-soft)' }}> ~ %</span>
        </div>

        {lines.map((line, i) => (
          <div key={i} style={{ color: colorOf(line.type) }}>
            {line.type === 'cmd' && (
              <span style={{ color: 'var(--ink-soft)', marginRight: 6 }}>{'>'}</span>
            )}
            {line.text}
          </div>
        ))}

        {/* Blinking cursor */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
          <span style={{ color: 'var(--ink-soft)', marginRight: 6 }}>{'>'}</span>
          <span className="terminal-cursor" />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
