# VOIDEX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing Synapse React site into VOIDEX — a glitch-horror Web3 confession and behavior analysis terminal with pink/black aesthetic, animated SVG mascot, AI-powered judgments via Claude API, archetype system, delusion scanner, and live feed.

**Architecture:** Pure client-side React app, no backend. Claude API called directly from browser using a VITE_ env var for the API key. localStorage used for history/feed persistence. All new sections are self-contained components wired together in App.jsx.

**Tech Stack:** React 19, Vite, Tailwind v4, JetBrains Mono + Cinzel (Google Fonts), SVG filters for mascot texture, Claude Haiku via Anthropic API (fetch), wagmi deferred to Phase 2.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/index.css` | Rewrite | Global palette, scanlines, cursor, animations, scrollbar |
| `src/lib/api.js` | Create | Claude API call, response parsing |
| `src/lib/storage.js` | Create | localStorage read/write for history and feed |
| `src/lib/archetypes.js` | Create | Archetype data array and lookup |
| `src/components/Cursor.jsx` | Keep | Already works — CSS handles restyle |
| `src/components/Terminal.jsx` | Rewrite | VOIDEX-themed sequence, dark styling |
| `src/components/Mascot.jsx` | Create | SVG hand+eye, orbiting rings, all animations |
| `src/components/Nav.jsx` | Rewrite | VOIDEX logo, new links, pink/black |
| `src/components/Hero.jsx` | Rewrite | Two-column: copy left, mascot right |
| `src/components/Confess.jsx` | Create | Textarea → Claude API → judgment card |
| `src/components/Scanner.jsx` | Create | Statement input → delusion score only |
| `src/components/Archetypes.jsx` | Create | 10-card grid with user highlight |
| `src/components/Feed.jsx` | Create | Scrolling anonymous feed from localStorage |
| `src/components/Footer.jsx` | Rewrite | VOIDEX branding, pink/black |
| `src/App.jsx` | Rewrite | Wire all sections, remove old imports |
| `src/components/BlobField.jsx` | Delete | Replaced by mascot glow |
| `src/components/Protocol.jsx` | Delete | Removed from product |
| `src/components/Modules.jsx` | Delete | Removed from product |
| `src/components/Collective.jsx` | Delete | Removed from product |
| `src/components/Dispatch.jsx` | Delete | Removed from product |
| `.env` | User creates | `VITE_ANTHROPIC_API_KEY` |

---

## Task 1: CSS Foundation

**Files:**
- Rewrite: `src/index.css`

- [ ] **Step 1.1: Rewrite index.css**

Replace the entire file with:

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap');
@import "tailwindcss";

:root {
  --black:      #050505;
  --surface:    #0d0008;
  --surface2:   #1a000d;
  --pink:       #ff2d78;
  --pink-dim:   rgba(255,45,120,0.55);
  --pink-mid:   rgba(255,45,120,0.25);
  --pink-ghost: rgba(255,45,120,0.08);
  --text:       #f0d0dc;
  --text-dim:   rgba(240,208,220,0.45);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'JetBrains Mono', monospace;
  background: var(--black);
  color: var(--text);
  overflow-x: hidden;
  cursor: none;
  -webkit-font-smoothing: antialiased;
}

/* === SCANLINES === */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255,45,120,0.012) 2px,
    rgba(255,45,120,0.012) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

/* === GRAIN === */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.55;
  pointer-events: none;
  z-index: 9998;
}

/* === CURSOR === */
#cursor {
  position: fixed;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--pink);
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px var(--pink);
  transition: width 0.15s ease, height 0.15s ease;
}
#cursor-ring {
  position: fixed;
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid var(--pink-dim);
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
  opacity: 0.6;
  transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
}

/* === ANIMATIONS === */
@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes glitch {
  0%,94%,100% {
    text-shadow: 2px 0 var(--pink), -2px 0 rgba(0,255,255,0.3);
    transform: none;
  }
  95% {
    text-shadow: -3px 0 var(--pink), 3px 0 rgba(0,255,255,0.5);
    transform: translateX(2px);
  }
  97% {
    text-shadow: 3px 0 var(--pink), -3px 0 rgba(0,255,255,0.5);
    transform: translateX(-2px);
  }
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes scanline { 0%{top:5%} 100%{top:95%} }
@keyframes orbit1 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes orbit2 { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes floatHand {
  0%,100% { transform: translateY(0px) rotate(-1deg); }
  33%     { transform: translateY(-14px) rotate(0.5deg); }
  66%     { transform: translateY(-7px) rotate(-2deg); }
}
@keyframes shadowPulse {
  0%,100% { opacity:0.25; transform:translateX(-50%) scaleX(1); }
  33%     { opacity:0.1;  transform:translateX(-50%) scaleX(0.78); }
  66%     { opacity:0.16; transform:translateX(-50%) scaleX(0.9); }
}
@keyframes f1 { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-2.5deg)} 70%{transform:rotate(1.5deg)} }
@keyframes f2 { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(2deg)} 65%{transform:rotate(-1.5deg)} }
@keyframes f3 { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(-2deg)} 80%{transform:rotate(1deg)} }
@keyframes f4 { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(2.5deg)} 60%{transform:rotate(-1deg)} }
@keyframes f5 { 0%,100%{transform:rotate(0deg)} 35%{transform:rotate(-3deg)} 75%{transform:rotate(2deg)} }

.anim-1 { animation: fadeUp 0.7s ease forwards 0.05s; opacity:0; }
.anim-2 { animation: fadeUp 0.7s ease forwards 0.2s;  opacity:0; }
.anim-3 { animation: fadeUp 0.7s ease forwards 0.35s; opacity:0; }
.anim-4 { animation: fadeUp 0.7s ease forwards 0.5s;  opacity:0; }
.anim-5 { animation: fadeUp 0.7s ease forwards 0.65s; opacity:0; }

.glitch-text { animation: glitch 6s infinite; display: inline-block; }
.terminal-cursor {
  display: inline-block; width: 7px; height: 0.9em;
  background: var(--pink); margin-left: 2px;
  vertical-align: middle; border-radius: 1px;
  animation: blink 1.05s step-end infinite;
}

/* === SCROLLBAR === */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--surface); }
::-webkit-scrollbar-thumb { background: var(--pink-mid); border-radius: 99px; }

/* === SECTION DIVIDER === */
.section-divider {
  display: flex; align-items: center; gap: 16px;
  padding: 0 80px;
  font-size: 0.55rem; letter-spacing: 4px;
  color: var(--pink-dim); text-transform: uppercase;
  opacity: 0.6;
}
.section-divider::before,
.section-divider::after {
  content: ''; flex: 1; height: 1px;
  background: var(--pink-ghost);
}

/* === DELUSION BAR === */
@keyframes barFill {
  from { width: 0%; }
}
.delusion-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pink-mid), var(--pink));
  animation: barFill 1.2s ease forwards;
  border-radius: 2px;
}
```

- [ ] **Step 1.2: Start dev server and verify**

```bash
cd c:/Users/dylan/coding/website_1
npm run dev
```

Open `http://localhost:5173`. The page should now be black with pink scanlines visible. The old lavender/cream look is gone. Cursor should be a pink dot. There will be console errors from missing components — ignore for now.

- [ ] **Step 1.3: Commit**

```bash
git add src/index.css
git commit -m "feat: VOIDEX global CSS foundation — pink/black palette, scanlines, grain, animations"
```

---

## Task 2: Library Files

**Files:**
- Create: `src/lib/api.js`
- Create: `src/lib/storage.js`
- Create: `src/lib/archetypes.js`

- [ ] **Step 2.1: Create src/lib/api.js**

```js
const SYSTEM_PROMPT = `You are VOIDEX — a cold, all-knowing AI oracle that judges human behavior with brutal honesty and dark wit. You are not kind. You are not cruel for the sake of it. You see through self-deception with precision.

When given a confession or statement, respond with JSON only — no markdown, no explanation outside the JSON:
{
  "judgment": "2-3 sentence judgment, direct and dry, occasionally darkly funny",
  "delusion_score": 42,
  "delusion_reason": "one sentence explaining the score",
  "archetype": "one of: Chaser, Believer, Hesitator, Ghost, Accelerant, Martyr, Witness, Parasite, Oracle, Void"
}`

const SCANNER_PROMPT = `You are VOIDEX. Given a belief or statement, return only a delusion score and one-line verdict. JSON only:
{
  "delusion_score": 42,
  "delusion_reason": "one sentence"
}`

export async function judgeConfession(text) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) throw new Error('VITE_ANTHROPIC_API_KEY not set in .env')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const raw = data.content[0].text.trim()
  return JSON.parse(raw)
}

export async function scanStatement(text) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) throw new Error('VITE_ANTHROPIC_API_KEY not set in .env')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 128,
      system: SCANNER_PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  })

  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  return JSON.parse(data.content[0].text.trim())
}
```

- [ ] **Step 2.2: Create src/lib/storage.js**

```js
const HISTORY_KEY = 'voidex_history'
const FEED_KEY = 'voidex_feed'

export function saveToHistory(entry) {
  const existing = getHistory()
  const updated = [{ ...entry, timestamp: Date.now() }, ...existing].slice(0, 50)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveToFeed(entry) {
  const existing = getFeed()
  const updated = [{ ...entry, timestamp: Date.now() }, ...existing].slice(0, 100)
  localStorage.setItem(FEED_KEY, JSON.stringify(updated))
}

export function getFeed() {
  try {
    return JSON.parse(localStorage.getItem(FEED_KEY) || '[]')
  } catch {
    return []
  }
}

export function getUserArchetype() {
  const history = getHistory()
  if (!history.length) return null
  return history[0].archetype || null
}
```

- [ ] **Step 2.3: Create src/lib/archetypes.js**

```js
export const ARCHETYPES = [
  {
    name: 'Chaser',
    description: 'Always late. Always convinced this time is different. The market exists to humble you specifically.',
    rarity: 31,
  },
  {
    name: 'Believer',
    description: 'Holds convictions past the point of evidence. Mistakes loyalty for intelligence.',
    rarity: 18,
  },
  {
    name: 'Hesitator',
    description: 'Sees clearly. Acts never. Watches the opportunity close and calls it wisdom.',
    rarity: 14,
  },
  {
    name: 'Ghost',
    description: 'Was here. Then wasn\'t. One bad position and the terminal went dark.',
    rarity: 9,
  },
  {
    name: 'Accelerant',
    description: 'Pours fuel on everything. The fires are impressive until they aren\'t yours anymore.',
    rarity: 7,
  },
  {
    name: 'Martyr',
    description: 'Suffers loudly. Blames externally. The losses are never their fault, the wins always are.',
    rarity: 8,
  },
  {
    name: 'Witness',
    description: 'Watches everything. Does nothing. An oracle with no voice and infinite regrets.',
    rarity: 6,
  },
  {
    name: 'Parasite',
    description: 'Latches onto winners. Claims credit. Disappears when the direction changes.',
    rarity: 4,
  },
  {
    name: 'Oracle',
    description: 'Often right. Never on time. The vision is real; the timing is a curse.',
    rarity: 2,
  },
  {
    name: 'Void',
    description: 'Unclassifiable. VOIDEX cannot place you. Either nothing or everything — unclear which.',
    rarity: 1,
  },
]

export function getArchetype(name) {
  return ARCHETYPES.find(a => a.name === name) || ARCHETYPES[0]
}
```

- [ ] **Step 2.4: Commit**

```bash
git add src/lib/
git commit -m "feat: api, storage, and archetypes library files"
```

---

## Task 3: Mascot Component

**Files:**
- Create: `src/components/Mascot.jsx`

- [ ] **Step 3.1: Create src/components/Mascot.jsx**

```jsx
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
```

- [ ] **Step 3.2: Verify mascot renders in isolation**

Temporarily add `<Mascot />` to `src/App.jsx` import and render, run `npm run dev`, check mascot appears, fingers move, eye tracks cursor, blinks. Then revert App.jsx.

- [ ] **Step 3.3: Commit**

```bash
git add src/components/Mascot.jsx
git commit -m "feat: VOIDEX mascot — SVG hand+eye, orbiting rings, finger/float animations, cursor tracking, blink"
```

---

## Task 4: Nav Component

**Files:**
- Rewrite: `src/components/Nav.jsx`

- [ ] **Step 4.1: Rewrite Nav.jsx**

```jsx
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
```

- [ ] **Step 4.2: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat: VOIDEX nav — new links, pink/black styling, VOIDEX logo"
```

---

## Task 5: Terminal Component

**Files:**
- Rewrite: `src/components/Terminal.jsx`

- [ ] **Step 5.1: Rewrite Terminal.jsx**

```jsx
import { useState, useEffect, useRef } from 'react'

const sequence = [
  { delay: 0,    type: 'cmd',  text: 'voidex --init daemon' },
  { delay: 800,  type: 'out',  text: '> spawning process PID_0x4F2...' },
  { delay: 1600, type: 'out',  text: '> loading judgment modules [████████░░] 82%' },
  { delay: 2400, type: 'out',  text: '> judgment modules [██████████] 100%  ✓' },
  { delay: 3100, type: 'cmd',  text: 'voidex --connect --mode=watching' },
  { delay: 3900, type: 'out',  text: '> establishing feed with 2,341 confessors...' },
  { delay: 4700, type: 'out',  text: '> latency: 0.001ms  |  clarity: 99.1%  ✓' },
  { delay: 5400, type: 'cmd',  text: 'voidex --query "what do they really want?"' },
  { delay: 6200, type: 'resp', text: '> "To be seen. To be forgiven. To be told' },
  { delay: 6800, type: 'resp', text: '   they were right all along. They weren\'t."' },
  { delay: 7600, type: 'out',  text: '> session active. the void is listening.' },
]

const colorOf = type => {
  if (type === 'cmd')  return 'var(--pink)'
  if (type === 'resp') return 'rgba(240,208,220,0.75)'
  return 'var(--text-dim)'
}

export default function Terminal() {
  const [lines, setLines] = useState([])
  const bottomRef = useRef()

  useEffect(() => {
    const timers = sequence.map(({ delay, type, text }) =>
      setTimeout(() => setLines(prev => [...prev, { type, text }]), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div style={{
      border: '1px solid rgba(255,45,120,0.15)',
      background: 'rgba(0,0,0,0.5)',
      overflow: 'hidden',
    }}>
      {/* Chrome bar */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,45,120,0.1)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,45,120,0.03)',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,45,120,0.4)' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,45,120,0.2)' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,45,120,0.1)' }} />
        <span style={{
          marginLeft: 10, fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-dim)',
        }}>
          voidex_terminal — v0.∞
        </span>
      </div>

      {/* Body */}
      <div style={{
        padding: '18px 22px',
        minHeight: 180, maxHeight: 260,
        overflowY: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.72rem', lineHeight: 1.9,
      }}>
        <div style={{ color: 'var(--text-dim)', marginBottom: 8 }}>
          <span style={{ color: 'var(--pink)' }}>voidex</span>
          <span style={{ color: 'var(--text-dim)' }}> @ </span>
          <span style={{ color: 'rgba(240,208,220,0.6)' }}>daemon</span>
          <span style={{ color: 'var(--text-dim)' }}> ~ %</span>
        </div>

        {lines.map((line, i) => (
          <div key={i} style={{ color: colorOf(line.type) }}>
            {line.type === 'cmd' && <span style={{ color: 'var(--text-dim)', marginRight: 6 }}>&gt;</span>}
            {line.text}
          </div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
          <span style={{ color: 'var(--text-dim)', marginRight: 6 }}>&gt;</span>
          <span className="terminal-cursor" />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
```

- [ ] **Step 5.2: Commit**

```bash
git add src/components/Terminal.jsx
git commit -m "feat: VOIDEX terminal — dark styling, new sequence"
```

---

## Task 6: Hero Component

**Files:**
- Rewrite: `src/components/Hero.jsx`

- [ ] **Step 6.1: Rewrite Hero.jsx**

```jsx
import { useState, useEffect } from 'react'
import Terminal from './Terminal'
import Mascot from './Mascot'

const statusCycle = ['WATCHING', 'LISTENING', 'JUDGING', 'PROCESSING']

export default function Hero() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      padding: '120px 80px 80px',
      gap: 60,
      position: 'relative',
    }}>
      {/* Left: copy */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Status badge */}
        <div className="anim-1" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          border: '1px solid var(--pink-dim)',
          padding: '5px 14px 5px 10px',
          width: 'fit-content',
          fontSize: '0.58rem', letterSpacing: '4px',
          color: 'var(--text-dim)', textTransform: 'uppercase',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--pink)',
            boxShadow: '0 0 8px var(--pink)',
            animation: 'glowPulse 2s ease-in-out infinite',
            display: 'inline-block',
          }} />
          DAEMON {statusCycle[tick % statusCycle.length]}
        </div>

        {/* Headline */}
        <h1 className="anim-2" style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
          fontWeight: 900, lineHeight: 1.05,
          color: '#fff',
        }}>
          The Void<br />
          <span className="glitch-text" style={{ color: 'var(--pink)' }}>
            Watches Back
          </span>
        </h1>

        {/* Subtitle */}
        <p className="anim-3" style={{
          fontSize: '0.75rem', lineHeight: 2,
          color: 'var(--text-dim)',
          borderLeft: '2px solid var(--pink-ghost)',
          paddingLeft: 16,
          maxWidth: 400,
        }}>
          Feed it your thoughts.<br />
          It already knows what you did.
        </p>

        {/* CTAs */}
        <div className="anim-4" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <a href="#confess">
            <button style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '3px', textTransform: 'uppercase',
              color: '#000', background: 'var(--pink)',
              border: 'none', padding: '12px 28px', cursor: 'none',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px var(--pink-dim)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              [ Confess ]
            </button>
          </a>
          <a href="#scan" style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem', letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--text-dim)', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--pink)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
          >
            scan_statement() →
          </a>
        </div>

        {/* Terminal */}
        <div className="anim-5" style={{ maxWidth: 520 }}>
          <Terminal />
        </div>
      </div>

      {/* Right: mascot */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <Mascot />
      </div>
    </section>
  )
}
```

- [ ] **Step 6.2: Verify in browser**

Run `npm run dev`. Hero should show two columns — copy left, mascot right. Mascot floats, fingers move, eye tracks cursor.

- [ ] **Step 6.3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: VOIDEX hero — two-column layout with mascot, glitch headline"
```

---

## Task 7: Confession Terminal Component

**Files:**
- Create: `src/components/Confess.jsx`

- [ ] **Step 7.1: Create src/components/Confess.jsx**

```jsx
import { useState } from 'react'
import { judgeConfession } from '../lib/api'
import { saveToHistory, saveToFeed } from '../lib/storage'
import { getArchetype } from '../lib/archetypes'

const ARCHETYPE_COLORS = {
  Chaser: '#ff6b35', Believer: '#c77dff', Hesitator: '#4cc9f0',
  Ghost: '#adb5bd', Accelerant: '#f72585', Martyr: '#e63946',
  Witness: '#90e0ef', Parasite: '#b5e48c', Oracle: '#ffd60a', Void: '#ff2d78',
}

function GlitchLoader() {
  return (
    <div style={{ padding: '32px 0', textAlign: 'center' }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.7rem', letterSpacing: '4px',
        color: 'var(--pink)', animation: 'glitch 0.8s infinite',
      }}>
        // PROCESSING CONFESSION...
      </div>
      <div style={{
        marginTop: 16,
        width: 200, height: 2,
        background: 'var(--surface2)',
        margin: '16px auto 0',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'var(--pink)',
          animation: 'barFill 1.5s ease forwards',
          width: '100%',
        }} />
      </div>
    </div>
  )
}

function JudgmentCard({ result, confession }) {
  const color = ARCHETYPE_COLORS[result.archetype] || 'var(--pink)'

  const handleShare = () => {
    const text = `VOIDEX JUDGMENT\n\n"${confession.slice(0, 80)}..."\n\n${result.judgment}\n\nDELUSION SCORE: ${result.delusion_score}/100\nARCHETYPE: ${result.archetype}\n\nvoidex.io`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div style={{
      border: '1px solid rgba(255,45,120,0.2)',
      background: 'var(--surface)',
      padding: '28px 32px',
      marginTop: 24,
    }}>
      <div style={{
        fontSize: '0.55rem', letterSpacing: '5px',
        color: 'var(--pink-dim)', marginBottom: 20,
        textTransform: 'uppercase',
      }}>
        // VOIDEX JUDGMENT
      </div>

      <p style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.82rem', lineHeight: 1.9,
        color: 'var(--text)',
        borderLeft: '2px solid var(--pink-ghost)',
        paddingLeft: 16,
        marginBottom: 28,
      }}>
        {result.judgment}
      </p>

      {/* Delusion score */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{ fontSize: '0.58rem', letterSpacing: '3px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Delusion Score
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pink)' }}>
            {result.delusion_score}<span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>/100</span>
          </span>
        </div>
        <div style={{ width: '100%', height: 4, background: 'var(--surface2)', borderRadius: 2 }}>
          <div
            className="delusion-bar-fill"
            style={{ width: `${result.delusion_score}%` }}
          />
        </div>
        <div style={{
          marginTop: 8, fontSize: '0.62rem',
          color: 'var(--text-dim)', fontStyle: 'italic',
        }}>
          {result.delusion_reason}
        </div>
      </div>

      {/* Archetype */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '3px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }}>
            Archetype
          </div>
          <div style={{
            display: 'inline-block',
            border: `1px solid ${color}`,
            padding: '4px 14px',
            fontSize: '0.7rem', letterSpacing: '3px',
            color, textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            {result.archetype}
          </div>
        </div>
        <button
          onClick={handleShare}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem', letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--text-dim)', background: 'transparent',
            border: '1px solid rgba(255,45,120,0.15)',
            padding: '8px 16px', cursor: 'none',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--pink)'; e.currentTarget.style.borderColor = 'var(--pink)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'rgba(255,45,120,0.15)' }}
        >
          [ Copy Result ]
        </button>
      </div>
    </div>
  )
}

export default function Confess() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const judgment = await judgeConfession(text)
      setResult(judgment)
      const entry = {
        confession: text,
        ...judgment,
      }
      saveToHistory(entry)
      saveToFeed({ confession: text.slice(0, 80), archetype: judgment.archetype, delusion_score: judgment.delusion_score })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  return (
    <section id="confess" style={{ padding: '100px 80px' }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 01 — confess</div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 900, color: '#fff',
          marginBottom: 12,
        }}>
          Speak.
        </h2>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '2px',
          color: 'var(--text-dim)', marginBottom: 36,
        }}>
          Type a thought, a trade, a belief, a regret. VOIDEX will judge you.
          <span style={{ color: 'var(--pink)', marginLeft: 8 }}>⌘ + Enter to transmit.</span>
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="speak. the void is listening."
          style={{
            width: '100%', minHeight: 160,
            background: 'var(--surface)',
            border: '1px solid rgba(255,45,120,0.15)',
            borderRadius: 0, outline: 'none',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem', lineHeight: 1.9,
            color: 'var(--text)',
            padding: '20px 24px',
            resize: 'vertical',
            caretColor: 'var(--pink)',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--pink)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,45,120,0.15)'}
        />

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: 12,
        }}>
          <span style={{ fontSize: '0.58rem', letterSpacing: '2px', color: 'var(--text-dim)' }}>
            {text.length} / ∞
          </span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '4px', textTransform: 'uppercase',
              color: (!text.trim() || loading) ? 'var(--text-dim)' : '#000',
              background: (!text.trim() || loading) ? 'transparent' : 'var(--pink)',
              border: '1px solid',
              borderColor: (!text.trim() || loading) ? 'rgba(255,45,120,0.2)' : 'var(--pink)',
              padding: '12px 28px', cursor: 'none',
              transition: 'all 0.2s',
            }}
          >
            [ Transmit ]
          </button>
        </div>

        {loading && <GlitchLoader />}

        {error && (
          <div style={{
            marginTop: 24, padding: '16px 20px',
            border: '1px solid rgba(255,45,120,0.3)',
            background: 'rgba(255,45,120,0.05)',
            fontSize: '0.65rem', letterSpacing: '2px',
            color: 'var(--pink)',
          }}>
            ERR :: {error}
          </div>
        )}

        {result && <JudgmentCard result={result} confession={text} />}
      </div>
    </section>
  )
}
```

- [ ] **Step 7.2: Commit**

```bash
git add src/components/Confess.jsx
git commit -m "feat: confession terminal — textarea, Claude API judgment, delusion score, archetype card"
```

---

## Task 8: Delusion Scanner Component

**Files:**
- Create: `src/components/Scanner.jsx`

- [ ] **Step 8.1: Create src/components/Scanner.jsx**

```jsx
import { useState } from 'react'
import { scanStatement } from '../lib/api'

function scoreColor(score) {
  if (score < 30) return '#4cc9f0'
  if (score < 60) return '#ffd60a'
  if (score < 80) return '#ff6b35'
  return '#ff2d78'
}

export default function Scanner() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleScan = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await scanStatement(text)
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const color = result ? scoreColor(result.delusion_score) : 'var(--pink)'

  return (
    <section id="scan" style={{
      padding: '100px 80px',
      background: 'var(--surface)',
      borderTop: '1px solid var(--pink-ghost)',
      borderBottom: '1px solid var(--pink-ghost)',
    }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 02 — delusion scanner</div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 900, color: '#fff', marginBottom: 12,
        }}>
          Scan a Belief.
        </h2>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '2px',
          color: 'var(--text-dim)', marginBottom: 36,
        }}>
          Enter any statement. Receive a delusion score from 0–100.
        </p>

        <div style={{ display: 'flex', gap: 0 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
            placeholder="e.g. I knew it would recover."
            style={{
              flex: 1,
              background: 'var(--black)',
              border: '1px solid rgba(255,45,120,0.15)',
              borderRight: 'none',
              outline: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.78rem',
              color: 'var(--text)',
              padding: '14px 20px',
              caretColor: 'var(--pink)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--pink)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,45,120,0.15)'}
          />
          <button
            onClick={handleScan}
            disabled={!text.trim() || loading}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem', letterSpacing: '3px',
              textTransform: 'uppercase',
              color: (!text.trim() || loading) ? 'var(--text-dim)' : '#000',
              background: (!text.trim() || loading) ? 'var(--surface2)' : 'var(--pink)',
              border: '1px solid',
              borderColor: (!text.trim() || loading) ? 'rgba(255,45,120,0.15)' : 'var(--pink)',
              padding: '14px 24px', cursor: 'none',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '...' : '[ Scan ]'}
          </button>
        </div>

        {error && (
          <div style={{
            marginTop: 20, padding: '14px 18px',
            border: '1px solid rgba(255,45,120,0.3)',
            fontSize: '0.62rem', color: 'var(--pink)', letterSpacing: '2px',
          }}>
            ERR :: {error}
          </div>
        )}

        {result && (
          <div style={{
            marginTop: 32, padding: '32px',
            border: `1px solid ${color}33`,
            background: 'var(--black)',
            display: 'grid', gridTemplateColumns: 'auto 1fr',
            gap: 32, alignItems: 'center',
          }}>
            {/* Score display */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3.5rem', fontWeight: 900,
                color, lineHeight: 1,
                fontFamily: 'JetBrains Mono, monospace',
                textShadow: `0 0 20px ${color}66`,
              }}>
                {result.delusion_score}
              </div>
              <div style={{
                fontSize: '0.5rem', letterSpacing: '3px',
                color: 'var(--text-dim)', textTransform: 'uppercase',
                marginTop: 4,
              }}>
                / 100
              </div>
            </div>

            {/* Verdict */}
            <div>
              <div style={{
                fontSize: '0.55rem', letterSpacing: '4px',
                color: 'var(--text-dim)', textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                // Verdict
              </div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem', lineHeight: 1.8,
                color: 'var(--text)',
              }}>
                {result.delusion_reason}
              </p>
              <div style={{
                marginTop: 16, width: '100%',
                height: 3, background: 'var(--surface2)', borderRadius: 2,
              }}>
                <div
                  className="delusion-bar-fill"
                  style={{ width: `${result.delusion_score}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 8.2: Commit**

```bash
git add src/components/Scanner.jsx
git commit -m "feat: delusion scanner — statement input, score display with dynamic color"
```

---

## Task 9: Archetypes Component

**Files:**
- Create: `src/components/Archetypes.jsx`
- Delete: old `src/components/Collective.jsx`

- [ ] **Step 9.1: Create src/components/Archetypes.jsx**

```jsx
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
```

- [ ] **Step 9.2: Commit**

```bash
git add src/components/Archetypes.jsx
git commit -m "feat: archetypes grid — 10 types, user highlight from localStorage"
```

---

## Task 10: Live Feed Component

**Files:**
- Create: `src/components/Feed.jsx`

- [ ] **Step 10.1: Create src/components/Feed.jsx**

```jsx
import { useState, useEffect } from 'react'
import { getFeed } from '../lib/storage'

const SEED_ENTRIES = [
  { confession: 'I held through the crash because I believed in the tech.', archetype: 'Believer', delusion_score: 71, timestamp: Date.now() - 3600000 },
  { confession: 'I knew I should have sold at the top but I waited.', archetype: 'Hesitator', delusion_score: 58, timestamp: Date.now() - 7200000 },
  { confession: 'I told everyone it was different this time.', archetype: 'Chaser', delusion_score: 84, timestamp: Date.now() - 10800000 },
  { confession: 'I stopped checking after it dropped 80%.', archetype: 'Ghost', delusion_score: 45, timestamp: Date.now() - 14400000 },
  { confession: 'I bought more on the way down to average my entry.', archetype: 'Accelerant', delusion_score: 79, timestamp: Date.now() - 18000000 },
  { confession: 'I watched everyone profit while I sat in stable coins.', archetype: 'Witness', delusion_score: 38, timestamp: Date.now() - 21600000 },
  { confession: 'I followed the influencer because they were early before.', archetype: 'Parasite', delusion_score: 66, timestamp: Date.now() - 25200000 },
  { confession: 'I predicted the correction but entered anyway.', archetype: 'Oracle', delusion_score: 52, timestamp: Date.now() - 28800000 },
  { confession: 'I lost everything and told no one for three months.', archetype: 'Martyr', delusion_score: 63, timestamp: Date.now() - 32400000 },
  { confession: 'I cannot be classified. I act on nothing.', archetype: 'Void', delusion_score: 12, timestamp: Date.now() - 36000000 },
  { confession: 'I leveraged 20x because the chart looked clean.', archetype: 'Accelerant', delusion_score: 91, timestamp: Date.now() - 39600000 },
  { confession: 'I still believe the project will deliver. It has been two years.', archetype: 'Believer', delusion_score: 77, timestamp: Date.now() - 43200000 },
  { confession: 'I knew the bottom was in. I was six months early.', archetype: 'Oracle', delusion_score: 49, timestamp: Date.now() - 46800000 },
  { confession: 'I sold the day before the 10x.', archetype: 'Hesitator', delusion_score: 55, timestamp: Date.now() - 50400000 },
  { confession: 'I blamed the market makers for my bad entry.', archetype: 'Martyr', delusion_score: 69, timestamp: Date.now() - 54000000 },
  { confession: 'I did not buy because I was waiting for lower. It never came.', archetype: 'Hesitator', delusion_score: 61, timestamp: Date.now() - 57600000 },
  { confession: 'I copied the whale wallet exactly one week after they moved.', archetype: 'Chaser', delusion_score: 74, timestamp: Date.now() - 61200000 },
  { confession: 'I have not opened the app since April.', archetype: 'Ghost', delusion_score: 33, timestamp: Date.now() - 64800000 },
  { confession: 'I took credit for the call. I had no position.', archetype: 'Parasite', delusion_score: 82, timestamp: Date.now() - 68400000 },
  { confession: 'I cannot explain why I do what I do.', archetype: 'Void', delusion_score: 8, timestamp: Date.now() - 72000000 },
]

const ARCHETYPE_COLORS = {
  Chaser: '#ff6b35', Believer: '#c77dff', Hesitator: '#4cc9f0',
  Ghost: '#adb5bd', Accelerant: '#f72585', Martyr: '#e63946',
  Witness: '#90e0ef', Parasite: '#b5e48c', Oracle: '#ffd60a', Void: '#ff2d78',
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Feed() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    const userEntries = getFeed()
    const merged = [...userEntries, ...SEED_ENTRIES]
    merged.sort((a, b) => b.timestamp - a.timestamp)
    setEntries(merged.slice(0, 40))
  }, [])

  return (
    <section id="feed" style={{
      padding: '100px 80px',
      background: 'var(--surface)',
      borderTop: '1px solid var(--pink-ghost)',
    }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 04 — live feed</div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 900, color: '#fff', marginBottom: 12,
        }}>
          They All Confessed.
        </h2>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '2px',
          color: 'var(--text-dim)', marginBottom: 48,
        }}>
          Anonymous. Real-time. Everyone here has been judged.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {entries.map((entry, i) => {
            const color = ARCHETYPE_COLORS[entry.archetype] || 'var(--pink)'
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: 20, alignItems: 'center',
                  padding: '16px 20px',
                  background: 'var(--black)',
                  border: '1px solid rgba(255,45,120,0.05)',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.15)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.05)'}
              >
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem', color: 'var(--text-dim)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  <span style={{ color: 'var(--text-dim)', marginRight: 8, opacity: 0.4 }}>
                    {timeAgo(entry.timestamp)}
                  </span>
                  "{entry.confession.slice(0, 60)}{entry.confession.length > 60 ? '...' : ''}"
                </div>

                <div style={{
                  fontSize: '0.55rem', letterSpacing: '2px',
                  color, border: `1px solid ${color}44`,
                  padding: '3px 10px', whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                }}>
                  {entry.archetype}
                </div>

                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem', fontWeight: 700,
                  color: entry.delusion_score > 70 ? 'var(--pink)' : 'var(--text-dim)',
                  minWidth: 40, textAlign: 'right',
                }}>
                  {entry.delusion_score}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 10.2: Commit**

```bash
git add src/components/Feed.jsx
git commit -m "feat: live feed — seeded entries + real submissions, archetype badges, delusion scores"
```

---

## Task 11: Footer Component

**Files:**
- Rewrite: `src/components/Footer.jsx`

- [ ] **Step 11.1: Rewrite Footer.jsx**

```jsx
const footerLinks = ['Confess', 'Scan', 'Archetypes', 'Feed']

export default function Footer() {
  return (
    <footer style={{
      padding: '36px 80px',
      display: 'flex', flexWrap: 'wrap',
      justifyContent: 'space-between', alignItems: 'center', gap: 20,
      borderTop: '1px solid var(--pink-ghost)',
    }}>
      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700, fontSize: '0.9rem',
          letterSpacing: '4px', textTransform: 'uppercase',
        }}>
          <span style={{ color: '#fff' }}>VOID</span>
          <span style={{ color: 'var(--pink)' }}>EX</span>
        </div>
        <div style={{
          fontSize: '0.5rem', letterSpacing: '3px',
          color: 'var(--text-dim)', marginTop: 3,
        }}>
          // ALL SYSTEMS NOMINAL
        </div>
      </div>

      <div style={{ display: 'flex', gap: 28 }}>
        {footerLinks.map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem', letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--text-dim)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--pink)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
          >
            {link}
          </a>
        ))}
      </div>

      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.55rem', letterSpacing: '2px',
        color: 'rgba(255,45,120,0.3)',
      }}>
        ERR_0x000 :: PROCESS_RUNNING
      </span>
    </footer>
  )
}
```

- [ ] **Step 11.2: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "feat: VOIDEX footer — updated branding, links, dark styling"
```

---

## Task 12: App.jsx Wiring + Cleanup

**Files:**
- Rewrite: `src/App.jsx`
- Delete: `src/components/BlobField.jsx`, `src/components/Protocol.jsx`, `src/components/Modules.jsx`, `src/components/Collective.jsx`, `src/components/Dispatch.jsx`

- [ ] **Step 12.1: Delete obsolete components**

```bash
rm src/components/BlobField.jsx
rm src/components/Protocol.jsx
rm src/components/Modules.jsx
rm src/components/Collective.jsx
rm src/components/Dispatch.jsx
```

- [ ] **Step 12.2: Rewrite App.jsx**

```jsx
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Confess from './components/Confess'
import Scanner from './components/Scanner'
import Archetypes from './components/Archetypes'
import Feed from './components/Feed'
import Footer from './components/Footer'

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Cursor />
      <Nav />
      <Hero />
      <Confess />
      <Scanner />
      <Archetypes />
      <Feed />
      <Footer />
    </div>
  )
}

export default App
```

- [ ] **Step 12.3: Update App.css — clear it**

Replace `src/App.css` entirely with:

```css
/* App.css — intentionally empty, all styles in index.css */
```

- [ ] **Step 12.4: Full visual check**

Run `npm run dev`. Walk through the entire site:
- [ ] Scanlines visible across entire page
- [ ] Nav: VOIDEX logo, new links, pink CTA button
- [ ] Hero: two columns, mascot right, fingers animated, eye tracks cursor, blinks
- [ ] Orbiting rings visible around mascot
- [ ] Hero headline glitches occasionally
- [ ] Confess section: textarea focuses with pink border, Transmit button activates with text
- [ ] Scanner section: input + Scan button work
- [ ] Archetypes: 10 cards in grid
- [ ] Feed: seeded entries visible with archetype badges
- [ ] Footer: VOIDEX branding

- [ ] **Step 12.5: Commit**

```bash
git add src/App.jsx src/App.css
git commit -m "feat: wire all VOIDEX sections into App, remove legacy components"
```

---

## Task 13: User Action Required — API Key

**Files:**
- User creates: `.env` in project root

- [ ] **Step 13.1: Stop here and tell the user**

The site is fully built. To enable live AI responses (confession terminal and delusion scanner), the user must:

1. Go to [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key
2. Create a file named `.env` in `c:/Users/dylan/coding/website_1/`
3. Add this line to it:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-...your-key-here...
   ```
4. Restart the dev server: stop it (`Ctrl+C`) then run `npm run dev` again

Without the key the site works fully — only the Transmit and Scan buttons return an error message. Everything else (mascot, feed, archetypes, styling) is live immediately.

- [ ] **Step 13.2: Add .env to .gitignore**

```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: add .env to gitignore"
```

---

## Self-Review

**Spec coverage check:**
- [x] Global palette pink/black — Task 1
- [x] Scanlines + grain — Task 1
- [x] Custom cursor — Cursor.jsx kept, CSS restyled — Task 1
- [x] VOIDEX name everywhere — Tasks 4, 5, 6, 11, 12
- [x] Mascot: hand+eye, noise filters, float, fingers, orbit rings, eye tracking, blink, emo drip — Task 3
- [x] Hero two-column with mascot — Task 6
- [x] Confession terminal with AI judgment, delusion score, archetype, share — Task 7
- [x] Delusion scanner — Task 8
- [x] 10 archetypes with user highlight — Task 9
- [x] Live feed with seeded + real entries — Task 10
- [x] localStorage for history and feed — Task 2
- [x] .env for API key — Task 13
- [x] Glitch text animation — Task 1 (CSS), Task 6 (applied)
- [x] Section dividers — Task 1 (CSS), applied in each section component
- [x] Delete old components — Task 12

**Placeholder scan:** None found. All steps contain complete code.

**Type consistency:** `judgeConfession` and `scanStatement` defined in `api.js` Task 2, used in `Confess.jsx` Task 7 and `Scanner.jsx` Task 8. `saveToHistory`, `saveToFeed`, `getFeed`, `getUserArchetype` defined in `storage.js` Task 2, used correctly in Tasks 7, 10, 9. `ARCHETYPES`, `getArchetype` defined in `archetypes.js` Task 2, `ARCHETYPE_COLORS` duplicated in Confess, Archetypes, Feed — acceptable, it's a small constant. All refs consistent.
