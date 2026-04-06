import { ARCHETYPES } from '../lib/archetypes'
import { getUserArchetype } from '../lib/storage'

const ARCHETYPE_COLORS = {
  Chaser: '#ff6b35', Believer: '#c77dff', Hesitator: '#4cc9f0',
  Ghost: '#adb5bd', Accelerant: '#f72585', Martyr: '#e63946',
  Witness: '#90e0ef', Parasite: '#b5e48c', Oracle: '#ffd60a', Void: '#ff2d78',
}

export default function Archetypes() {
  const userArchetype = getUserArchetype()

  return (
    <section id="archetypes" style={{ padding: '100px 80px' }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 03 — archetypes</div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 900, color: '#fff', marginBottom: 12,
        }}>
          What Are You?
        </h2>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '2px',
          color: 'var(--text-dim)', marginBottom: 52,
        }}>
          {userArchetype
            ? `VOIDEX has classified you as: ${userArchetype}. Others are listed below.`
            : 'Confess something to receive your classification.'}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
        }}>
          {ARCHETYPES.map(({ name, description, rarity }) => {
            const isUser = name === userArchetype
            const color = ARCHETYPE_COLORS[name] || 'var(--pink)'

            return (
              <div
                key={name}
                style={{
                  background: isUser ? `${color}15` : 'var(--surface)',
                  border: `1px solid ${isUser ? color : 'rgba(255,45,120,0.06)'}`,
                  padding: '28px 24px',
                  position: 'relative',
                  opacity: userArchetype && !isUser ? 0.5 : 1,
                  transition: 'opacity 0.3s, border-color 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = `${color}66` }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = userArchetype && !isUser ? '0.5' : '1'
                  e.currentTarget.style.borderColor = isUser ? color : 'rgba(255,45,120,0.06)'
                }}
              >
                {isUser && (
                  <div style={{
                    position: 'absolute', top: 10, right: 12,
                    fontSize: '0.45rem', letterSpacing: '3px',
                    color, textTransform: 'uppercase',
                  }}>
                    // YOU
                  </div>
                )}

                <div style={{
                  fontSize: '0.85rem', fontWeight: 700,
                  letterSpacing: '2px', color,
                  textTransform: 'uppercase', marginBottom: 10,
                }}>
                  {name}
                </div>

                <p style={{
                  fontSize: '0.62rem', lineHeight: 1.9,
                  color: 'var(--text-dim)',
                  marginBottom: 16,
                }}>
                  {description}
                </p>

                <div style={{
                  fontSize: '0.5rem', letterSpacing: '3px',
                  color: `${color}88`, textTransform: 'uppercase',
                }}>
                  RARITY: {rarity}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
