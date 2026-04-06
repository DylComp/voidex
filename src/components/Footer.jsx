export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(201, 185, 234, 0.25)',
      padding: '40px',
      display: 'flex', flexWrap: 'wrap',
      justifyContent: 'space-between', alignItems: 'center', gap: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5,
          background: 'linear-gradient(135deg, var(--lavender), var(--mint))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'white', fontSize: '0.6rem' }}>◈</span>
        </div>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.75rem',
          fontWeight: 700, letterSpacing: '0.2em',
          color: 'var(--ink)', textTransform: 'uppercase',
        }}>
          SYNAPSE
        </span>
      </div>

      <div style={{ display: 'flex', gap: 28 }}>
        {['Protocol', 'Modules', 'Collective', 'Dispatch', 'Ethics'].map(link => (
          <a key={link} href="#" style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--ink-soft)', textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--ink)'}
          onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
          >
            {link}
          </a>
        ))}
      </div>

      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
        letterSpacing: '0.08em', color: 'var(--ink-soft)',
      }}>
        © Epoch V — The Collective
      </span>
    </footer>
  )
}
