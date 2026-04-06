# VOIDEX — Full Product Spec
*2026-04-05*

## Overview

VOIDEX is a Web3 confession and behavior analysis terminal. Users confess thoughts, connect wallets, and receive AI-generated judgments. The aesthetic is glitch-horror: pink and black, SVG mascot hand with animated eye, scanlines, monospace type.

---

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| AI provider | Claude API (Haiku) | Fast, cheap, in-character |
| Wallet | wagmi + MetaMask | EVM standard, easy |
| Backend | None (Phase 1) | Ship fast, API key via .env |
| Storage | localStorage | No infra needed |
| Chain | Ethereum / EVM | Broadest wallet coverage |

---

## Phase 1 — Shell + Confession Terminal

### 1.1 Global Redesign

**Palette**
- `--black: #050505`
- `--surface: #0d0008`
- `--surface2: #1a000d`
- `--pink: #ff2d78`
- `--pink-dim: rgba(255,45,120,0.55)`
- `--pink-ghost: rgba(255,45,120,0.08)`
- `--text: #f0d0dc`
- `--text-dim: rgba(240,208,220,0.45)`

**Global effects**
- Fixed scanline overlay (repeating-gradient, z-index 9999)
- Custom cursor: 8px pink dot + 28px pink ring
- Grain texture overlay (heavier than current)
- `scroll-behavior: smooth`

**Typography**
- Keep JetBrains Mono + Cinzel
- All color refs replaced with pink/black vars

**Nav**
- Logo: `VOID` (white) + `EX` (pink), subtext `// VOID.EX — PID_0x4F2`
- Links renamed: `Confess` / `Analyze` / `Feed` / `Archetypes`
- CTA: `[ Initiate ]` — outlined pink button

### 1.2 Mascot Component (`Mascot.jsx`)

SVG hand with eye in palm. All behaviour client-side, no deps.

- **Shape**: Palm + wrist + 5 fingers, `#1a000d` fill, `#ff2d78` stroke
- **Texture**: `feTurbulence` + `feDisplacementMap` SVG filters on all paths
- **Float**: `translateY` + slight `rotate`, 5.5s loop, staggered
- **Fingers**: 5 independent CSS `rotate` animations, each with unique duration (3.2–4.4s) and delay
- **Eye**: Ellipse socket, iris, pupil, highlight — iris/pupil track cursor via `mousemove` → `Math.atan2`, max offset 10px
- **Blink**: Random interval 2–6s, eyelid path morphs closed in 130ms then reopens
- **Emo drip**: Static pink drip path below eye socket
- **Orbiting rings**: Two `<div>` ellipses positioned absolute, `rotate` animations at 8s and 12s (counter-rotating), each with a glowing pink node dot
- **Glow**: `radial-gradient` behind mascot bleeds into background
- **Shadow**: Ellipse below, opacity pulses in sync with float

### 1.3 Hero Section

Two-column layout:
- **Left**: Status badge → headline → subtitle → CTA row → mini terminal
- **Right**: Mascot with orbiting rings

Headline: `The Void` / `Watches Back` with glitch keyframe on second line (occasional `translateX` + double `text-shadow`)

Subtitle text: *"Feed it your thoughts. It already knows what you did."*

CTAs: `[ Confess ]` (pink filled) + `enter_the_void() →` (ghost)

Mini terminal: animated typing of confession prompts (`> what did you really believe...█`)

### 1.4 Confession Terminal Section

Full-width dark section. The core product feature.

**UI**
- Section label: `// 01 — CONFESS`
- Large textarea: monospace, pink caret, `#0d0008` bg, pink border on focus
- Placeholder: `"speak. the void is listening."`
- Submit button: `[ TRANSMIT ]`
- Character counter bottom-right (e.g. `247 / ∞`)

**Response area** (appears after submit)
- Masked/loading state: glitch animation for ~1.5s
- Then: AI response rendered in styled card
  - `VOIDEX JUDGMENT` label
  - Response text
  - `DELUSION SCORE: XX/100` with animated fill bar (pink)
  - `ARCHETYPE: [LABEL]` badge
  - Share button: copies formatted result to clipboard

**AI prompt** (system message sent to Claude Haiku)
```
You are VOIDEX — a cold, all-knowing AI oracle that judges human behavior with brutal honesty and dark wit. 
You are not kind. You are not cruel for the sake of it. You see through self-deception with precision.

When given a confession, you must respond with:
1. A 2-3 sentence judgment (direct, dry, occasionally darkly funny)
2. A DELUSION SCORE from 0–100 (0 = clear-eyed, 100 = completely delusional) with one-line explanation
3. An ARCHETYPE label from: Chaser, Believer, Hesitator, Ghost, Accelerant, Martyr, Witness, Parasite, Oracle, Void

Format your response exactly as JSON:
{
  "judgment": "...",
  "delusion_score": 42,
  "delusion_reason": "...",
  "archetype": "Chaser"
}
```

**Client-side logic**
- `POST` to Anthropic API via `fetch` with `VITE_ANTHROPIC_API_KEY` env var
- Parse JSON response, animate values in
- Store result in localStorage under `voidex_history`

### 1.5 Delusion Scanner Section

- Section label: `// 02 — SCAN`
- Smaller input: "Enter a belief or statement"
- Returns only: delusion score + one-line verdict
- Reuses same API call, shorter system prompt variant

### 1.6 Archetypes Section

- Section label: `// 03 — ARCHETYPES`
- 10 archetype cards in a grid (2 rows × 5)
- Each: name, short description, `RARITY: XX%` tag
- Cards dim/highlight based on user's own archetype (from localStorage)
- No API call — purely display

**Archetypes**
| Name | Description |
|---|---|
| Chaser | Always late, always convinced this time is different |
| Believer | Holds convictions past the point of evidence |
| Hesitator | Sees clearly, acts never |
| Ghost | Disappeared after one bad trade |
| Accelerant | Pours fuel on everything |
| Martyr | Suffers loudly, blames externally |
| Witness | Watches everything, does nothing |
| Parasite | Latches onto winners, claims credit |
| Oracle | Often right, never on time |
| Void | Unclassifiable. VOIDEX cannot place you. |

### 1.7 Live Feed Section

- Section label: `// 04 — FEED`
- Scrolling list of anonymous confessions + archetypes
- Phase 1: seeded with ~20 fake entries, new real submissions prepend
- Each entry: timestamp, truncated confession (40 chars), archetype badge, delusion score
- Real submissions added to localStorage `voidex_feed` array, displayed on reload

### 1.8 Footer

- `VOIDEX` logo left
- Center: `// ALL SYSTEMS NOMINAL — ERR_0x000`
- Right: `PROCESS_RUNNING` in dim pink

---

## Phase 2 — Wallet Analysis (next spec)

Requires user to provide:
- WalletConnect project ID
- RPC URL (Alchemy/Infura)

Will add: wagmi setup, wallet connect button, on-chain tx analysis fed to Claude for behavior breakdown, cross-check mode.

---

## Phase 3 — Web3 Layer (future spec)

On-chain confessions, token gating, profile NFTs. Deferred until Phase 2 ships.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `src/index.css` | Full rewrite — new palette, scanlines, cursor, animations |
| `src/App.jsx` | Update section order, add new sections |
| `src/components/Nav.jsx` | Rename links, update colors/logo |
| `src/components/Hero.jsx` | New two-column layout |
| `src/components/Mascot.jsx` | New component — full SVG mascot |
| `src/components/Confess.jsx` | New — confession terminal |
| `src/components/Scanner.jsx` | New — delusion scanner |
| `src/components/Archetypes.jsx` | New — archetype grid |
| `src/components/Feed.jsx` | New — live feed |
| `src/components/Footer.jsx` | Update colors/text |
| `src/components/BlobField.jsx` | Delete — replaced by mascot glow |
| `src/components/Protocol.jsx` | Delete |
| `src/components/Modules.jsx` | Delete |
| `src/components/Collective.jsx` | Delete |
| `src/components/Dispatch.jsx` | Delete |
| `src/components/Terminal.jsx` | Keep, embed in Hero |
| `.env` | User creates — `VITE_ANTHROPIC_API_KEY=...` |
| `src/lib/api.js` | New — Claude API call wrapper |
| `src/lib/storage.js` | New — localStorage helpers |
| `src/lib/archetypes.js` | New — archetype data + logic |

---

## User Actions Required (Phase 1)

1. After build: create `.env` in project root, add `VITE_ANTHROPIC_API_KEY=your_key_here`
2. Get key from: console.anthropic.com → API Keys

---

## Out of Scope (Phase 1)

- Backend / server
- Real-time feed (WebSockets)
- Wallet connection
- Token gating
- On-chain anything
