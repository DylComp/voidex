# Vercel Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Anthropic API key server-side via Vercel functions, replace the localStorage feed with a real Postgres public feed, and improve error UX.

**Architecture:** Three Vercel serverless functions (`api/judge.js`, `api/scan.js`, `api/feed.js`) sit between the browser and Anthropic/Postgres. The frontend's `api.js` is updated to call these local endpoints instead of Anthropic directly. The public feed is stored in Vercel Postgres and served via `GET /api/feed`.

**Tech Stack:** Vercel serverless functions (Node 18, ESM), `@vercel/postgres` for DB access, React/Vite frontend (unchanged build process).

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `api/judge.js` | Proxy confession to Anthropic, save to Postgres, return judgment |
| Create | `api/scan.js` | Proxy statement to Anthropic, return score (no DB write) |
| Create | `api/feed.js` | GET last 50 rows from Postgres |
| Modify | `src/lib/api.js` | Call `/api/judge` and `/api/scan` instead of Anthropic directly |
| Modify | `src/components/Feed.jsx` | Fetch from `/api/feed` instead of localStorage |
| Modify | `src/components/Confess.jsx` | Remove `saveToFeed()`, style error messages |
| Modify | `src/components/Scanner.jsx` | Style error messages |
| Delete | `.env` key | Remove `VITE_ANTHROPIC_API_KEY` after confirming functions work |

---

## Task 1: Install `@vercel/postgres`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
cd c:/Users/dylan/coding/website_1
npm install @vercel/postgres
```

- [ ] **Step 2: Verify it appears in dependencies**

```bash
cat package.json | grep vercel
```

Expected output:
```
"@vercel/postgres": "^0.x.x"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @vercel/postgres"
```

---

## Task 2: Create `api/judge.js`

**Files:**
- Create: `api/judge.js`

- [ ] **Step 1: Create the file**

```javascript
// api/judge.js
import { sql } from '@vercel/postgres'

const SYSTEM_PROMPT = `You are VOIDEX — a cold, all-knowing AI oracle that judges human behavior with brutal honesty and dark wit. You are not kind. You are not cruel for the sake of it. You see through self-deception with precision.

When given a confession or statement, respond with JSON only — no markdown, no explanation outside the JSON:
{
  "judgment": "2-3 sentence judgment, direct and dry, occasionally darkly funny",
  "delusion_score": 42,
  "delusion_reason": "one sentence explaining the score",
  "archetype": "one of: Chaser, Believer, Hesitator, Ghost, Accelerant, Martyr, Witness, Parasite, Oracle, Void"
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { text } = req.body ?? {}
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' })

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  })

  if (!upstream.ok) {
    return res.status(502).json({ error: `Upstream error ${upstream.status}` })
  }

  const data = await upstream.json()
  const content = data.content?.[0]?.text
  let judgment
  try {
    judgment = JSON.parse(content.trim())
  } catch {
    return res.status(502).json({ error: 'Oracle returned unreadable output' })
  }

  try {
    await sql`
      INSERT INTO feed (confession, archetype, delusion_score)
      VALUES (${text.slice(0, 80)}, ${judgment.archetype}, ${judgment.delusion_score})
    `
  } catch (dbErr) {
    console.error('Feed insert failed:', dbErr)
    // Don't fail the request — judgment still returned to user
  }

  return res.status(200).json(judgment)
}
```

- [ ] **Step 2: Commit**

```bash
git add api/judge.js
git commit -m "feat: api/judge — Anthropic proxy + feed insert"
```

---

## Task 3: Create `api/scan.js`

**Files:**
- Create: `api/scan.js`

- [ ] **Step 1: Create the file**

```javascript
// api/scan.js
const SCANNER_PROMPT = `You are VOIDEX. Given a belief or statement, return only a delusion score and one-line verdict. JSON only:
{
  "delusion_score": 42,
  "delusion_reason": "one sentence"
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { text } = req.body ?? {}
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' })

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 128,
      system: SCANNER_PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  })

  if (!upstream.ok) {
    return res.status(502).json({ error: `Upstream error ${upstream.status}` })
  }

  const data = await upstream.json()
  const content = data.content?.[0]?.text
  try {
    return res.status(200).json(JSON.parse(content.trim()))
  } catch {
    return res.status(502).json({ error: 'Oracle returned unreadable output' })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add api/scan.js
git commit -m "feat: api/scan — Anthropic proxy for delusion scanner"
```

---

## Task 4: Create `api/feed.js`

**Files:**
- Create: `api/feed.js`

- [ ] **Step 1: Create the file**

```javascript
// api/feed.js
import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { rows } = await sql`
    SELECT id, confession, archetype, delusion_score, created_at
    FROM feed
    ORDER BY created_at DESC
    LIMIT 50
  `

  return res.status(200).json(rows)
}
```

- [ ] **Step 2: Commit**

```bash
git add api/feed.js
git commit -m "feat: api/feed — public feed endpoint from Postgres"
```

---

## Task 5: Update `src/lib/api.js`

**Files:**
- Modify: `src/lib/api.js`

- [ ] **Step 1: Replace the entire file**

```javascript
// src/lib/api.js
export async function judgeConfession(text) {
  const res = await fetch('/api/judge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Error ${res.status}`)
  }

  return res.json()
}

export async function scanStatement(text) {
  const res = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Error ${res.status}`)
  }

  return res.json()
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/api.js
git commit -m "feat: api.js — call /api/judge and /api/scan instead of Anthropic directly"
```

---

## Task 6: Update `Feed.jsx` to fetch from `/api/feed`

**Files:**
- Modify: `src/components/Feed.jsx`

- [ ] **Step 1: Replace the file**

```jsx
// src/components/Feed.jsx
import { useState, useEffect } from 'react'

const ARCHETYPE_COLORS = {
  Chaser: '#ff6b35', Believer: '#c77dff', Hesitator: '#4cc9f0',
  Ghost: '#adb5bd', Accelerant: '#f72585', Martyr: '#e63946',
  Witness: '#90e0ef', Parasite: '#b5e48c', Oracle: '#ffd60a', Void: '#ff2d78',
}

function scoreColor(score) {
  if (score < 30) return '#4cc9f0'
  if (score < 60) return '#ffd60a'
  if (score < 80) return '#ff6b35'
  return '#ff2d78'
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function txId(id) {
  return 'TX-' + String(id).padStart(5, '0')
}

function EmptyState() {
  return (
    <div style={{
      border: '1px solid rgba(255,45,120,0.08)',
      background: 'var(--surface)',
      padding: '64px 40px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.55rem', letterSpacing: '5px',
        color: 'var(--pink-dim)', marginBottom: 20,
        textTransform: 'uppercase',
        animation: 'glitch 6s infinite',
      }}>
        // FEED EMPTY — NO TRANSMISSIONS LOGGED
      </div>
      <p style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--text-dim)', lineHeight: 2 }}>
        Confess something above.<br />
        Your transmissions appear here.
      </p>
    </div>
  )
}

function FeedEntry({ entry, index }) {
  const archetypeColor = ARCHETYPE_COLORS[entry.archetype] || 'var(--pink)'
  const delusionColor = scoreColor(entry.delusion_score)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 24, alignItems: 'start',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,45,120,0.06)',
        transition: 'background 0.2s',
        opacity: 0,
        animation: `fadeUp 0.5s ease forwards ${index * 0.06}s`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,120,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.52rem', letterSpacing: '3px',
        color: 'var(--text-dim)', paddingTop: 2, minWidth: 72,
      }}>
        {txId(entry.id)}
      </div>

      <div>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem', lineHeight: 1.7,
          color: 'var(--text)', marginBottom: 10,
        }}>
          "{entry.confession.length > 100
            ? entry.confession.slice(0, 100) + '…'
            : entry.confession}"
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.48rem', letterSpacing: '3px',
            color: archetypeColor,
            border: `1px solid ${archetypeColor}44`,
            padding: '2px 10px', textTransform: 'uppercase',
          }}>
            {entry.archetype}
          </span>
          <span style={{ fontSize: '0.52rem', letterSpacing: '2px', color: delusionColor }}>
            DELUSION {entry.delusion_score}/100
          </span>
        </div>
      </div>

      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.5rem', letterSpacing: '2px',
        color: 'var(--text-dim)', paddingTop: 2, whiteSpace: 'nowrap',
      }}>
        {timeAgo(entry.created_at)}
      </div>
    </div>
  )
}

export default function Feed() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeed = () => {
    fetch('/api/feed')
      .then(r => r.json())
      .then(data => { setEntries(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchFeed()
    window.addEventListener('focus', fetchFeed)
    return () => window.removeEventListener('focus', fetchFeed)
  }, [])

  return (
    <section id="feed" style={{ padding: '100px 80px' }}>
      <div style={{ marginBottom: 60 }}>
        <div className="section-divider">// 04 — feed</div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: 40,
        }}>
          <div>
            <h2 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
              fontWeight: 900, color: '#fff', marginBottom: 10,
            }}>
              The Feed.
            </h2>
            <p style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--text-dim)' }}>
              Transmissions logged to the void.
            </p>
          </div>

          {entries.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.52rem', letterSpacing: '3px', color: 'var(--text-dim)',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--pink)', boxShadow: '0 0 8px var(--pink)',
                display: 'inline-block', animation: 'glowPulse 2s ease-in-out infinite',
              }} />
              {entries.length} TRANSMISSION{entries.length !== 1 ? 'S' : ''}
            </div>
          )}
        </div>

        {entries.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto',
            gap: 24, padding: '8px 24px 12px',
            borderBottom: '1px solid rgba(255,45,120,0.15)',
          }}>
            {['ID', 'TRANSMISSION', 'WHEN'].map(label => (
              <span key={label} style={{
                fontSize: '0.45rem', letterSpacing: '4px',
                color: 'var(--pink-dim)', textTransform: 'uppercase',
              }}>
                {label}
              </span>
            ))}
          </div>
        )}

        {loading
          ? <div style={{ padding: '40px 24px', fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--text-dim)' }}>
              // LOADING TRANSMISSIONS...
            </div>
          : entries.length === 0
            ? <EmptyState />
            : entries.map((entry, i) => <FeedEntry key={entry.id} entry={entry} index={i} />)
        }
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Feed.jsx
git commit -m "feat: Feed — fetch from /api/feed, use Postgres id + created_at"
```

---

## Task 7: Update `Confess.jsx` — remove `saveToFeed`, style errors

**Files:**
- Modify: `src/components/Confess.jsx`

- [ ] **Step 1: Remove `saveToFeed` import and call**

Find line 2 in `src/components/Confess.jsx`:
```javascript
import { saveToHistory, saveToFeed } from '../lib/storage'
```
Change to:
```javascript
import { saveToHistory } from '../lib/storage'
```

Find this block inside `handleSubmit`:
```javascript
saveToHistory(entry)
saveToFeed({ confession: text.slice(0, 80), archetype: judgment.archetype, delusion_score: judgment.delusion_score })
```
Change to:
```javascript
saveToHistory(entry)
```

- [ ] **Step 2: Replace the raw error display with a styled error card**

Find:
```jsx
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
```

Replace with:
```jsx
{error && (
  <div style={{
    marginTop: 24, padding: '20px 24px',
    border: '1px solid rgba(255,45,120,0.3)',
    background: 'rgba(255,45,120,0.05)',
  }}>
    <div style={{
      fontSize: '0.52rem', letterSpacing: '4px',
      color: 'var(--pink)', textTransform: 'uppercase', marginBottom: 8,
    }}>
      // TRANSMISSION FAILED
    </div>
    <div style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.7rem', color: 'var(--text-dim)',
    }}>
      {error.includes('502') || error.includes('Upstream')
        ? 'The oracle is unreachable. Try again.'
        : error.includes('fetch')
        ? 'Network error. Check your connection.'
        : error}
    </div>
  </div>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Confess.jsx
git commit -m "feat: Confess — remove saveToFeed, style error messages"
```

---

## Task 8: Update `Scanner.jsx` — style errors

**Files:**
- Modify: `src/components/Scanner.jsx`

- [ ] **Step 1: Replace the raw error display**

Find:
```jsx
{error && (
  <div style={{
    marginTop: 20, padding: '14px 18px',
    border: '1px solid rgba(255,45,120,0.3)',
    fontSize: '0.62rem', color: 'var(--pink)', letterSpacing: '2px',
  }}>
    ERR :: {error}
  </div>
)}
```

Replace with:
```jsx
{error && (
  <div style={{
    marginTop: 20, padding: '20px 24px',
    border: '1px solid rgba(255,45,120,0.3)',
    background: 'rgba(255,45,120,0.05)',
  }}>
    <div style={{
      fontSize: '0.52rem', letterSpacing: '4px',
      color: 'var(--pink)', textTransform: 'uppercase', marginBottom: 8,
    }}>
      // SCAN FAILED
    </div>
    <div style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.7rem', color: 'var(--text-dim)',
    }}>
      {error.includes('502') || error.includes('Upstream')
        ? 'The oracle is unreachable. Try again.'
        : error.includes('fetch')
        ? 'Network error. Check your connection.'
        : error}
    </div>
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Scanner.jsx
git commit -m "feat: Scanner — style error messages"
```

---

## Task 9: Verify build and push

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: `✓ built in Xms` with no errors.

- [ ] **Step 2: Push all commits**

```bash
git push
```

- [ ] **Step 3: Confirm on GitHub**

Go to `github.com/DylComp/voidex` — verify all commits appear.

---

## Task 10: Vercel setup (manual — done in browser)

These steps are done by the user in the Vercel dashboard, not in code.

- [ ] **Step 1: Import repo on Vercel**
  - Go to [vercel.com/new](https://vercel.com/new)
  - Click "Import" next to `DylComp/voidex`
  - Framework preset auto-detects as Vite — leave all defaults, click Deploy

- [ ] **Step 2: Create Postgres database**
  - In the Vercel project dashboard → Storage tab → Create Database → Postgres
  - Name it anything (e.g. `voidex-db`) → Create
  - Click "Connect to Project" — this auto-sets `POSTGRES_URL` and related env vars

- [ ] **Step 3: Add `ANTHROPIC_API_KEY`**
  - Project Settings → Environment Variables
  - Add: `ANTHROPIC_API_KEY` = your Anthropic API key (same value as your current `VITE_ANTHROPIC_API_KEY` in `.env`)
  - Make sure it's set for Production, Preview, and Development environments

- [ ] **Step 4: Run the DB migration**
  - In Vercel dashboard → Storage → your Postgres DB → Query tab
  - Run:
    ```sql
    CREATE TABLE feed (
      id             SERIAL PRIMARY KEY,
      confession     TEXT         NOT NULL,
      archetype      VARCHAR(20)  NOT NULL,
      delusion_score INTEGER      NOT NULL,
      created_at     TIMESTAMP    DEFAULT NOW()
    );
    ```

- [ ] **Step 5: Redeploy**
  - Deployments tab → click the three-dot menu on the latest deployment → Redeploy
  - Wait ~30 seconds, then open the production URL
  - Test: submit a confession, check the feed section updates, check Vercel Postgres query tab for the new row

- [ ] **Step 6: Remove local API key from `.env`**
  - Once production is confirmed working, remove `VITE_ANTHROPIC_API_KEY` from your local `.env`
  - For local dev with `vercel dev`, the CLI pulls env vars from Vercel automatically
