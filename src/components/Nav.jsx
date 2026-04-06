import { useState, useEffect } from 'react'

const links = ['Protocol', 'Modules', 'Collective', 'Dispatch']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '12px 40px' : '24px 40px',
      transition: 'padding 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease',
      background: scrolled ? 'rgba(250, 248, 244, 0.8)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201, 185, 234, 0.3)' : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'linear-gradient(135deg, var(--lavender), var(--mint))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="2.5" fill="white" fillOpacity="0.9" />
            <circle cx="2" cy="7" r="1.5" fill="white" fillOpacity="0.5" />
            <circle cx="12" cy="7" r="1.5" fill="white" fillOpacity="0.5" />
            <circle cx="7" cy="2" r="1.5" fill="white" fillOpacity="0.5" />
            <circle cx="7" cy="12" r="1.5" fill="white" fillOpacity="0.5" />
            <line x1="2" y1="7" x2="4.5" y2="7" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="9.5" y1="7" x2="12" y2="7" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="7" y1="2" x2="7" y2="4.5" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="7" y1="9.5" x2="7" y2="12" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
          </svg>
        </div>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.85rem',
          fontWeight: 700, letterSpacing: '0.18em',
          color: 'var(--ink)', textTransform: 'uppercase',
        }}>
          SYNAPSE
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {links.map(link => (
          <a key={link} href={`#${link.toLowerCase()}`} style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem', letterSpacing: '0.12em',
            color: 'var(--ink-soft)', textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--ink)'}
          onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
          >
            {link}
          </a>
        ))}
        <button style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.68rem', letterSpacing: '0.14em',
          color: 'white', textTransform: 'uppercase',
          background: 'linear-gradient(135deg, var(--lavender), var(--blush))',
          border: 'none', borderRadius: 8,
          padding: '8px 18px',
          cursor: 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          boxShadow: '0 4px 20px rgba(200, 140, 200, 0.3)',
        }}
        onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' }}
        >
          Initiate
        </button>
      </div>
    </nav>
  )
}
