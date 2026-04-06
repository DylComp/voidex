export default function Footer() {
  const footerLinks = [
    { label: 'Protocol', href: '#protocol' },
    { label: 'Modules',  href: '#modules' },
    { label: 'Collective', href: '#collective' },
    { label: 'Dispatch', href: '#dispatch' },
  ]

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,45,120,0.12)',
      padding: '40px 80px',
      display: 'flex', flexWrap: 'wrap',
      justifyContent: 'space-between', alignItems: 'center', gap: 20,
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 700, fontSize: '0.9rem',
        letterSpacing: '4px', textTransform: 'uppercase',
      }}>
        <span style={{ color: '#fff' }}>VOID</span>
        <span style={{ color: 'var(--pink)' }}>EX</span>
        <div style={{
          fontSize: '0.45rem', letterSpacing: '3px',
          color: 'var(--text-dim)', marginTop: 2,
        }}>
          // VOID.EX — PID_0x4F2
        </div>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        {footerLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.58rem', letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--text-dim)', textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--pink)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            {label}
          </a>
        ))}
      </div>

      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.52rem', letterSpacing: '3px',
        color: 'var(--text-dim)',
      }}>
        © Epoch V — The Void
      </span>
    </footer>
  )
}
