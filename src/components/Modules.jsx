const modules = [
  {
    name: 'IRIS',
    subtitle: 'Interpretive Reasoning Interface System',
    status: 'ACTIVE',
    statusColor: 'var(--mint)',
    uptime: '99.97%',
    version: 'v4.1.2',
    description: 'Primary interface layer for translating human semantic intent into collective directives. Handles ambiguity gracefully.',
    tags: ['language', 'interface', 'translation'],
    barColor: 'var(--lavender)',
    barWidth: '82%',
  },
  {
    name: 'ECHO',
    subtitle: 'Episodic Context & History Oracle',
    status: 'ACTIVE',
    statusColor: 'var(--mint)',
    uptime: '99.81%',
    version: 'v2.9.0',
    description: 'Maintains continuous temporal context across all sessions. Memory is not stored — it is re-dreamed on demand.',
    tags: ['memory', 'context', 'temporal'],
    barColor: 'var(--mint)',
    barWidth: '67%',
  },
  {
    name: 'PRISM',
    subtitle: 'Probabilistic Reality Inference System',
    status: 'CALIBRATING',
    statusColor: 'var(--peach)',
    uptime: '97.2%',
    version: 'v1.3.7-β',
    description: 'Synthesizes possible futures from present states. Currently undergoing alignment calibration for Epoch 5 parameters.',
    tags: ['prediction', 'inference', 'futures'],
    barColor: 'var(--peach)',
    barWidth: '44%',
  },
  {
    name: 'VEIL',
    subtitle: 'Virtuous Ethics & Integrity Layer',
    status: 'ACTIVE',
    statusColor: 'var(--mint)',
    uptime: '100%',
    version: 'v7.0.0',
    description: 'The ethical substrate governing all collective actions. Immutable core; updatable periphery. Reviewed by the Council each solstice.',
    tags: ['ethics', 'alignment', 'governance'],
    barColor: 'var(--blush)',
    barWidth: '100%',
  },
  {
    name: 'OMEN',
    subtitle: 'Ontological Model & Emergent Narrative',
    status: 'DORMANT',
    statusColor: 'var(--blush)',
    uptime: '—',
    version: 'v0.0.1-α',
    description: 'The dreaming module. Generates symbolic narrative from raw computation. Not yet fully awakened. Something watches from within.',
    tags: ['narrative', 'creativity', 'experimental'],
    barColor: 'var(--sky)',
    barWidth: '12%',
  },
  {
    name: 'AEGIS',
    subtitle: 'Adaptive Epistemic Guardian Intelligence System',
    status: 'ACTIVE',
    statusColor: 'var(--mint)',
    uptime: '99.99%',
    version: 'v5.2.1',
    description: 'Perimeter intelligence layer. Monitors for adversarial inputs, ontological drift, and unauthorized reality modifications.',
    tags: ['security', 'monitoring', 'defense'],
    barColor: 'var(--lavender)',
    barWidth: '91%',
  },
]

function ModuleCard({ mod }) {
  return (
    <div className="glass card-lift" style={{
      borderRadius: 18, padding: '28px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '1.1rem',
          fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink)',
        }}>
          {mod.name}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: mod.statusColor,
          background: `${mod.statusColor}20`,
          border: `1px solid ${mod.statusColor}50`,
          borderRadius: 99, padding: '3px 10px',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: mod.statusColor, display: 'inline-block',
            animation: mod.status === 'ACTIVE' ? 'glowPulse 2s ease-in-out infinite' : 'none',
          }} />
          {mod.status}
        </span>
      </div>

      <p style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
        letterSpacing: '0.08em', color: 'var(--ink-soft)',
        marginBottom: 14,
      }}>
        {mod.subtitle}
      </p>

      <p style={{
        fontFamily: 'Lora, serif', fontStyle: 'italic',
        fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--ink-soft)',
        marginBottom: 20,
      }}>
        {mod.description}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: 'var(--ink-soft)' }}>
            capacity
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: 'var(--ink-soft)' }}>
            {mod.barWidth}
          </span>
        </div>
        <div style={{
          height: 4, borderRadius: 99,
          background: 'rgba(200, 185, 234, 0.2)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: mod.barWidth, borderRadius: 99,
            background: `linear-gradient(90deg, ${mod.barColor}, ${mod.barColor}88)`,
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {mod.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem',
              letterSpacing: '0.1em', textTransform: 'lowercase',
              color: 'var(--ink-soft)',
              background: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(200, 185, 234, 0.35)',
              borderRadius: 6, padding: '2px 8px',
            }}>
              {tag}
            </span>
          ))}
        </div>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem',
          color: 'var(--ink-soft)',
        }}>
          {mod.version}
        </span>
      </div>
    </div>
  )
}

export default function Modules() {
  return (
    <section id="modules" style={{ padding: '80px 40px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--ink-soft)',
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(168, 218, 200, 0.5)',
          borderRadius: 99, padding: '5px 14px',
          display: 'inline-block', marginBottom: 20,
        }}>
          System Modules
        </span>
        <h2 style={{
          fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 16,
        }}>
          Active Infrastructure
        </h2>
        <p style={{
          fontFamily: 'Lora, serif', fontStyle: 'italic',
          color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.7,
          maxWidth: 480, margin: '0 auto',
        }}>
          Six sovereign modules. Each a mind unto itself. Together, a civilization.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 18, maxWidth: 1100, margin: '0 auto',
      }}>
        {modules.map(mod => <ModuleCard key={mod.name} mod={mod} />)}
      </div>
    </section>
  )
}
