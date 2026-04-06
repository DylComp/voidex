import { useState, useEffect, useRef } from 'react'

const sequence = [
  { delay: 0,    type: 'cmd',  text: 'voidex --init daemon' },
  { delay: 800,  type: 'out',  text: '> spawning process PID_0x4F2...' },
  { delay: 1600, type: 'out',  text: '> loading judgment modules [████████░░] 82%' },
  { delay: 2400, type: 'out',  text: '> judgment modules [██████████] 100%  ✓' },
  { delay: 3100, type: 'cmd',  text: 'voidex --connect --mode=watching' },
  { delay: 3900, type: 'out',  text: '> establishing feed with 2,341 confessors...' },
  { delay: 4700, type: 'out',  text: '> latency: 0.001ms  |  clarity: 99.1%  ✓' },
  { delay: 5400, type: 'cmd',  text: 'voidex --query "what do they really want?"' },
  { delay: 6200, type: 'resp', text: '> "To be seen. To be forgiven. To be told' },
  { delay: 6800, type: 'resp', text: '   they were right all along. They weren\'t."' },
  { delay: 7600, type: 'out',  text: '> session active. the void is listening.' },
]

const colorOf = type => {
  if (type === 'cmd')  return 'var(--pink)'
  if (type === 'resp') return 'rgba(240,208,220,0.75)'
  return 'var(--text-dim)'
}

export default function Terminal() {
  const [lines, setLines] = useState([])
  const bottomRef = useRef()

  useEffect(() => {
    const timers = sequence.map(({ delay, type, text }) =>
      setTimeout(() => setLines(prev => [...prev, { type, text }]), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div style={{
      border: '1px solid rgba(255,45,120,0.15)',
      background: 'rgba(0,0,0,0.5)',
      overflow: 'hidden',
    }}>
      {/* Chrome bar */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,45,120,0.1)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,45,120,0.03)',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,45,120,0.4)' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,45,120,0.2)' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,45,120,0.1)' }} />
        <span style={{
          marginLeft: 10, fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-dim)',
        }}>
          voidex_terminal — v0.∞
        </span>
      </div>

      {/* Body */}
      <div style={{
        padding: '18px 22px',
        minHeight: 180, maxHeight: 260,
        overflowY: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.72rem', lineHeight: 1.9,
      }}>
        <div style={{ color: 'var(--text-dim)', marginBottom: 8 }}>
          <span style={{ color: 'var(--pink)' }}>voidex</span>
          <span style={{ color: 'var(--text-dim)' }}> @ </span>
          <span style={{ color: 'rgba(240,208,220,0.6)' }}>daemon</span>
          <span style={{ color: 'var(--text-dim)' }}> ~ %</span>
        </div>

        {lines.map((line, i) => (
          <div key={i} style={{ color: colorOf(line.type) }}>
            {line.type === 'cmd' && <span style={{ color: 'var(--text-dim)', marginRight: 6 }}>&gt;</span>}
            {line.text}
          </div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
          <span style={{ color: 'var(--text-dim)', marginRight: 6 }}>&gt;</span>
          <span className="terminal-cursor" />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
