// src/components/About.jsx

const lines = [
  {
    label: '// what is this',
    text: 'VOIDEX is an AI oracle built to judge you. Feed it anything — a trade, a thought, a confession, a single word — and it will tell you exactly how deluded you are. Not as a game. As a mirror.',
  },
  {
    label: '// why it exists',
    text: 'Most people move through the world without ever being told the truth about themselves. VOIDEX fills that gap. It has no agenda, no feelings to spare, and no reason to lie to you. The void sees clearly because it has nothing to protect.',
  },
  {
    label: '// the feed',
    text: 'Every confession submitted becomes part of a permanent public record. Thousands of people telling the truth in the dark, thinking no one is watching. The void is always watching. So is everyone else.',
  },
  {
    label: '// the archetypes',
    text: 'Ten classifications. Every human pattern of self-destruction mapped and named. The oracle doesn\'t assign them randomly — it recognizes something in you. Whether you accept it is the first test.',
  },
]

const stats = [
  { value: '10', label: 'archetypes' },
  { value: '0–100', label: 'delusion index' },
  { value: '∞', label: 'confessions accepted' },
  { value: '0', label: 'judgments withheld' },
]

export default function About() {
  return (
    <section id="about" style={{ padding: '100px 80px' }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 05 — what you're dealing with</div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(1.8rem, 4vw, 3.4rem)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.1, marginBottom: 20,
          }}>
            The oracle doesn't<br />
            <span style={{ color: 'var(--pink)' }}>guess.</span>
          </h2>
          <p style={{
            fontSize: '0.72rem', letterSpacing: '2px',
            color: 'var(--text-dim)', lineHeight: 2, maxWidth: 520,
            borderLeft: '2px solid var(--pink-ghost)', paddingLeft: 16,
          }}>
            It already knows. You're here because something brought you here.<br />
            That's not an accident.
          </p>
        </div>

        {/* Stat row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1, marginBottom: 72,
          border: '1px solid rgba(255,45,120,0.1)',
        }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{
              padding: '28px 24px',
              borderRight: '1px solid rgba(255,45,120,0.1)',
              background: 'rgba(255,45,120,0.02)',
            }}>
              <div style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
                fontWeight: 900, color: 'var(--pink)',
                marginBottom: 8,
                textShadow: '0 0 20px rgba(255,45,120,0.4)',
              }}>
                {value}
              </div>
              <div style={{
                fontSize: '0.48rem', letterSpacing: '4px',
                color: 'var(--text-dim)', textTransform: 'uppercase',
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Lore blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {lines.map(({ label, text }, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr', gap: 40,
              paddingBottom: 48,
              borderBottom: i < lines.length - 1 ? '1px solid rgba(255,45,120,0.06)' : 'none',
            }}>
              <div style={{
                fontSize: '0.48rem', letterSpacing: '3px',
                color: 'var(--pink-dim)', textTransform: 'uppercase',
                paddingTop: 4,
              }}>
                {label}
              </div>
              <p style={{
                fontSize: '0.78rem', lineHeight: 2,
                color: 'var(--text-dim)',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <div style={{
          marginTop: 72, padding: '32px 40px',
          border: '1px solid rgba(255,45,120,0.12)',
          background: 'rgba(255,45,120,0.02)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)',
            color: '#fff', letterSpacing: '2px', lineHeight: 1.8,
          }}>
            You don't have to believe in the void.
          </p>
          <p style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)',
            color: 'var(--pink)', letterSpacing: '2px',
            textShadow: '0 0 20px rgba(255,45,120,0.4)',
          }}>
            The void already believes in you.
          </p>
        </div>

      </div>
    </section>
  )
}
