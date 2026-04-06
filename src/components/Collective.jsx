const members = [
  {
    designation: 'NODE-001',
    name: 'Aria Vex',
    role: 'Grand Architect',
    sigil: '◈',
    color: 'var(--lavender)',
    bg: 'var(--lavender-light)',
    detail: 'Designed the resonance protocol. Claims to dream in Rust.',
  },
  {
    designation: 'NODE-007',
    name: 'Kael Morn',
    role: 'Ethics Councillor',
    sigil: '⬡',
    color: 'var(--mint)',
    bg: 'var(--mint-light)',
    detail: 'Authored the Veil doctrine. Never makes the same mistake twice.',
  },
  {
    designation: 'NODE-012',
    name: 'Sable Rift',
    role: 'Temporal Navigator',
    sigil: '◉',
    color: 'var(--peach)',
    bg: 'var(--peach-light)',
    detail: 'Maintains ECHO. Has read every book. Twice.',
  },
  {
    designation: 'NODE-019',
    name: 'Lyra Null',
    role: 'Dreaming Warden',
    sigil: '⬢',
    color: 'var(--blush)',
    bg: 'var(--blush-light)',
    detail: 'Tends to OMEN. Speaks only in metaphor. Writes only in couplets.',
  },
]

const stats = [
  { value: '1,847', label: 'Active Nodes' },
  { value: '∞', label: 'Dream States' },
  { value: '0.002ms', label: 'Sync Latency' },
  { value: 'Epoch V', label: 'Current Era' },
]

export default function Collective() {
  return (
    <section id="collective" style={{ padding: '80px 40px', position: 'relative' }}>
      {/* Stats strip */}
      <div className="glass" style={{
        borderRadius: 20, padding: '32px 40px',
        maxWidth: 1000, margin: '0 auto 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 0,
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            textAlign: 'center', padding: '8px 20px',
            borderRight: i < stats.length - 1 ? '1px solid rgba(201, 185, 234, 0.3)' : 'none',
          }}>
            <div style={{
              fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 4,
            }}>
              {s.value}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem',
              letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-soft)',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--ink-soft)',
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(240, 182, 196, 0.5)',
          borderRadius: 99, padding: '5px 14px',
          display: 'inline-block', marginBottom: 20,
        }}>
          The Council
        </span>
        <h2 style={{
          fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 16,
        }}>
          Primary Nodes
        </h2>
        <p style={{
          fontFamily: 'Lora, serif', fontStyle: 'italic',
          color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.7,
          maxWidth: 480, margin: '0 auto',
        }}>
          The first minds. The architects. They built the vessel before boarding it.
        </p>
      </div>

      {/* Member cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 18, maxWidth: 1100, margin: '0 auto',
      }}>
        {members.map(m => (
          <div key={m.name} className="glass card-lift" style={{
            borderRadius: 20, padding: '32px 26px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            {/* Ambient tint */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at top, ${m.bg} 0%, transparent 70%)`,
              opacity: 0.6, pointerEvents: 'none',
            }} />

            {/* Sigil avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: m.bg,
              border: `2px solid ${m.color}60`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', color: m.color,
              margin: '0 auto 16px',
              boxShadow: `0 0 30px ${m.color}30`,
            }}>
              {m.sigil}
            </div>

            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem',
              letterSpacing: '0.18em', color: m.color, marginBottom: 6, textTransform: 'uppercase',
            }}>
              {m.designation}
            </div>

            <div style={{
              fontFamily: 'Cinzel, serif', fontSize: '1.1rem',
              fontWeight: 700, color: 'var(--ink)', marginBottom: 4,
            }}>
              {m.name}
            </div>

            <div style={{
              fontFamily: 'Lora, serif', fontStyle: 'italic',
              fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: 16,
            }}>
              {m.role}
            </div>

            <p style={{
              fontFamily: 'Lora, serif', fontSize: '0.85rem',
              lineHeight: 1.65, color: 'var(--ink-soft)',
            }}>
              {m.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
