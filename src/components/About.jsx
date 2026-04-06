// src/components/About.jsx

const lines = [
  {
    label: '// what it is',
    text: 'You type something. VOIDEX reads it, scores how deluded it is on a scale of 0 to 100, and assigns you one of ten archetypes based on the pattern it detects. That result goes into a public feed anyone can see. Simple pipeline, uncomfortable output.',
  },
  {
    label: '// why it works',
    text: 'Most tools tell you what you want to hear. This one has no stake in your comfort. The model was prompted to be honest, not kind, and to accept any input without hesitation. It treats a crypto confession the same as an existential crisis because to the model there is no difference in weight, only in delusion level.',
  },
  {
    label: '// the feed',
    text: 'Every submission is stored publicly. No usernames, no context, just the raw text and the score it earned. At enough volume it becomes something closer to a social document than a feature. People being honest in a place that does not ask them to perform.',
  },
  {
    label: '// the archetypes',
    text: 'Ten behavioral patterns the model uses to classify what it reads. Chaser, Ghost, Martyr, Oracle and six others. They are not compliments or insults, just observations. The model picks the one that fits and moves on.',
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
            A model trained on<br />
            <span style={{ color: 'var(--pink)' }}>everything you've said.</span>
          </h2>
          <p style={{
            fontSize: '0.72rem', letterSpacing: '2px',
            color: 'var(--text-dim)', lineHeight: 2, maxWidth: 520,
            borderLeft: '2px solid var(--pink-ghost)', paddingLeft: 16,
          }}>
            Not this site specifically. But it has read enough of humanity<br />
            to recognize the patterns. You are probably one of them.
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
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            color: 'var(--text-dim)', letterSpacing: '1px', lineHeight: 2,
          }}>
            It is just a language model and a database. What makes it feel like something more
            is that you came here with something real and typed it anyway.
          </p>
        </div>

      </div>
    </section>
  )
}
