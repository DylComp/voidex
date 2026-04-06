import { useState, useEffect } from 'react'

const links = [
  { label: 'Confess',    href: '#confess' },
  { label: 'Scan',       href: '#scan' },
  { label: 'Archetypes', href: '#archetypes' },
  { label: 'Feed',       href: '#feed' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    padding: scrolled ? '12px 48px' : '22px 48px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'padding 0.3s ease, background 0.3s ease',
    background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,45,120,0.1)' : 'none',
  }

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700, fontSize: '1rem',
          letterSpacing: '4px', textTransform: 'uppercase',
        }}>
          <span style={{ color: '#fff' }}>VOID</span>
          <span style={{ color: 'var(--pink)' }}>EX</span>
        </div>
        <div style={{
          fontSize: '0.5rem', letterSpacing: '3px',
          color: 'var(--text-dim)', marginTop: 1,
        }}>
          // VOID.EX — PID_0x4F2
        </div>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.62rem', letterSpacing: '3px',
              color: 'var(--text-dim)', textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--pink)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
          >
            {label}
          </a>
        ))}
        <button
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem', letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--pink)', background: 'transparent',
            border: '1px solid var(--pink)',
            padding: '8px 18px', cursor: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--pink)'; e.currentTarget.style.color = '#000' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--pink)' }}
        >
          [ Initiate ]
        </button>
      </div>
    </nav>
  )
}
