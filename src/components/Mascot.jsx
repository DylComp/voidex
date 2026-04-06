import { useEffect, useRef } from 'react'

export default function Mascot() {
  const irisRef = useRef()
  const pupilRef = useRef()
  const highlightRef = useRef()
  const eyelidRef = useRef()
  const mascotRef = useRef()

  useEffect(() => {
    const cx = 122, cy = 200, maxDist = 10

    const onMove = (e) => {
      if (!mascotRef.current) return
      const rect = mascotRef.current.getBoundingClientRect()
      const mx = e.clientX - (rect.left + rect.width * (cx / 260))
      const my = e.clientY - (rect.top + rect.height * (cy / 340))
      const angle = Math.atan2(my, mx)
      const dist = Math.min(Math.sqrt(mx * mx + my * my), 120) / 120 * maxDist
      const nx = cx + Math.cos(angle) * dist
      const ny = cy + Math.sin(angle) * dist
      irisRef.current?.setAttribute('cx', nx)
      irisRef.current?.setAttribute('cy', ny)
      pupilRef.current?.setAttribute('cx', nx)
      pupilRef.current?.setAttribute('cy', ny)
      highlightRef.current?.setAttribute('cx', nx + 6)
      highlightRef.current?.setAttribute('cy', ny - 7)
    }

    let blinkTimer
    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        if (!eyelidRef.current) return
        eyelidRef.current.setAttribute('d', 'M78 200 Q100 226 122 228 Q144 226 166 200Z')
        setTimeout(() => {
          eyelidRef.current?.setAttribute('d', 'M78 200 Q100 175 122 172 Q144 175 166 200Z')
          scheduleBlink()
        }, 130)
      }, 2200 + Math.random() * 3800)
    }

    window.addEventListener('mousemove', onMove)
    const initialBlink = setTimeout(scheduleBlink, 1800)

    return () => {
      window.removeEventListener('mousemove', onMove)
      clearTimeout(blinkTimer)
      clearTimeout(initialBlink)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: 260, height: 360 }}>
      {/* Orbiting rings */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {/* Ring 1 */}
        <div style={{
          position: 'absolute',
          width: 300, height: 300,
          border: '1px solid rgba(255,45,120,0.18)',
          borderTopColor: 'var(--pink)',
          borderRadius: '50%',
          animation: 'orbit1 8s linear infinite',
        }}>
          <div style={{
            position: 'absolute', top: -4, left: '50%',
            width: 8, height: 8,
            background: 'var(--pink)',
            borderRadius: '50%',
            boxShadow: '0 0 10px var(--pink)',
            transform: 'translateX(-50%)',
          }} />
        </div>
        {/* Ring 2 */}
        <div style={{
          position: 'absolute',
          width: 340, height: 200,
          border: '1px dashed rgba(255,45,120,0.1)',
          borderBottomColor: 'rgba(255,45,120,0.35)',
          borderRadius: '50%',
          animation: 'orbit2 12s linear infinite',
        }}>
          <div style={{
            position: 'absolute', bottom: -3, left: '50%',
            width: 5, height: 5,
            background: 'var(--pink)',
            borderRadius: '50%',
            boxShadow: '0 0 6px var(--pink)',
            opacity: 0.6,
            transform: 'translateX(-50%)',
          }} />
        </div>
      </div>

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 220, height: 220,
          background: 'radial-gradient(ellipse, rgba(255,45,120,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* SVG hand */}
      <div style={{ position: 'absolute', top: 0, left: 0, animation: 'floatHand 5.5s ease-in-out infinite', transformOrigin: 'center bottom' }}>
        <svg
          ref={mascotRef}
          width="260"
          height="340"
          viewBox="0 0 260 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="mGrit" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="2" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            <filter id="mGrit2" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="4" seed="8" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            <filter id="mEyeGlow">
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Wrist */}
          <path d="M68 310 Q55 295 52 270 L205 270 Q202 295 190 310 Q168 335 130 338 Q92 340 68 310Z"
            fill="#120008" stroke="#ff2d78" strokeWidth="1.5" filter="url(#mGrit2)" opacity="0.9"/>

          {/* Palm */}
          <path d="M50 175 Q48 140 55 120 Q62 100 80 98 Q82 78 96 76 Q110 74 112 94 Q126 90 134 106 Q148 88 164 93 Q180 98 178 120 Q192 108 206 118 Q220 128 212 150 Q222 162 218 185 Q212 215 195 228 Q188 258 182 285 Q172 318 130 326 Q88 330 68 308 Q48 285 50 245 Q52 210 50 175Z"
            fill="#1a000d" stroke="#ff2d78" strokeWidth="2" filter="url(#mGrit)"/>

          {/* Finger 1 — pinky */}
          <g style={{ animation: 'f1 3.8s ease-in-out infinite', transformOrigin: '80px 120px' }}>
            <path d="M55 120 Q52 95 56 75 Q60 58 72 55 Q84 52 86 70 Q88 88 84 108"
              fill="#1a000d" stroke="#ff2d78" strokeWidth="1.8" strokeLinecap="round" filter="url(#mGrit2)"/>
          </g>

          {/* Finger 2 — ring */}
          <g style={{ animation: 'f2 4.4s ease-in-out infinite 0.3s', transformOrigin: '100px 105px' }}>
            <path d="M82 100 Q80 72 84 50 Q88 32 102 30 Q116 28 116 48 Q116 68 112 96"
              fill="#1a000d" stroke="#ff2d78" strokeWidth="1.8" strokeLinecap="round" filter="url(#mGrit2)"/>
          </g>

          {/* Finger 3 — middle */}
          <g style={{ animation: 'f3 3.6s ease-in-out infinite 0.7s', transformOrigin: '128px 100px' }}>
            <path d="M112 96 Q112 66 116 44 Q120 24 134 22 Q148 20 148 42 Q148 64 144 96"
              fill="#1a000d" stroke="#ff2d78" strokeWidth="1.8" strokeLinecap="round" filter="url(#mGrit2)"/>
          </g>

          {/* Finger 4 — index */}
          <g style={{ animation: 'f4 4.1s ease-in-out infinite 0.5s', transformOrigin: '155px 105px' }}>
            <path d="M142 100 Q144 72 148 52 Q152 34 166 36 Q180 38 178 60 Q176 82 172 110"
              fill="#1a000d" stroke="#ff2d78" strokeWidth="1.8" strokeLinecap="round" filter="url(#mGrit2)"/>
          </g>

          {/* Finger 5 — thumb */}
          <g style={{ animation: 'f5 3.2s ease-in-out infinite 0.9s', transformOrigin: '195px 140px' }}>
            <path d="M175 120 Q192 108 206 118 Q220 128 212 150 Q205 165 190 170"
              fill="#1a000d" stroke="#ff2d78" strokeWidth="1.8" strokeLinecap="round" filter="url(#mGrit2)"/>
          </g>

          {/* Palm creases */}
          <path d="M62 200 Q100 190 175 205" stroke="rgba(255,45,120,0.18)" strokeWidth="1.5" fill="none" filter="url(#mGrit2)"/>
          <path d="M58 230 Q90 218 180 232" stroke="rgba(255,45,120,0.12)" strokeWidth="1" fill="none" filter="url(#mGrit2)"/>

          {/* Eye socket */}
          <ellipse cx="122" cy="200" rx="44" ry="36"
            fill="#050505" stroke="#ff2d78" strokeWidth="1.5" filter="url(#mGrit)" opacity="0.95"/>

          {/* Eyelid top (blinks) */}
          <path ref={eyelidRef}
            d="M78 200 Q100 175 122 172 Q144 175 166 200Z"
            fill="#1a000d" stroke="#ff2d78" strokeWidth="1.5"/>

          {/* Eyelid bottom */}
          <path d="M78 200 Q100 222 122 225 Q144 222 166 200Z"
            fill="#1a000d" stroke="rgba(255,45,120,0.4)" strokeWidth="1"/>

          {/* Iris */}
          <circle ref={irisRef} cx="122" cy="200" r="22" fill="#ff2d78" filter="url(#mEyeGlow)"/>

          {/* Pupil */}
          <circle ref={pupilRef} cx="122" cy="200" r="11" fill="#050505"/>

          {/* Highlight */}
          <circle ref={highlightRef} cx="128" cy="193" r="4" fill="white" opacity="0.7"/>

          {/* Emo drip */}
          <path d="M114 235 Q112 252 110 268 Q108 278 106 288"
            stroke="#ff2d78" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" filter="url(#mGrit2)"/>
          <circle cx="104" cy="294" r="4" fill="#ff2d78" opacity="0.7"/>
          <path d="M130 234 Q129 244 128 252"
            stroke="#ff2d78" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>

          {/* Ink splatters */}
          <circle cx="70" cy="245" r="2.5" fill="#ff2d78" opacity="0.35"/>
          <circle cx="175" cy="238" r="2" fill="#ff2d78" opacity="0.25"/>

          {/* Emo brow */}
          <path d="M88 168 Q105 158 122 164"
            stroke="#ff2d78" strokeWidth="5" strokeLinecap="round" filter="url(#mGrit2)"/>
        </svg>
      </div>

      {/* Float shadow */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%',
        width: 120, height: 14,
        background: 'radial-gradient(ellipse, rgba(255,45,120,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'shadowPulse 5.5s ease-in-out infinite',
      }} />
    </div>
  )
}
