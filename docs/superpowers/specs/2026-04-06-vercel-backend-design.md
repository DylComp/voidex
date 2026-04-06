# VOIDEX — Vercel Backend Design

**Date:** 2026-04-06  
**Scope:** API key proxy, public feed database, improved error UX

---

## Problem

1. `VITE_ANTHROPIC_API_KEY` is exposed in the browser bundle — any visitor can steal it and use the API credits.
2. The feed section only shows the current user's localStorage data — not a true public feed.
3. API errors surface as raw strings (e.g. `ERR :: VITE_ANTHROPIC_API_KEY not set in .env`) instead of styled VOIDEX messages.

---

## Solution: Vercel Functions + Vercel Postgres

### Architecture

```
Browser (React/Vite on Vercel)
  │
  ├─ POST /api/judge  ──→  Vercel Function (judge.js)
  │                            ├─ calls Anthropic API (key lives in Vercel env)
  │                            ├─ saves confession + archetype + score to Postgres
  │                            └─ returns judgment JSON to browser
  │
  ├─ POST /api/scan   ──→  Vercel Function (scan.js)
  │                            ├─ calls Anthropic API
  │                            └─ returns score + verdict (not saved to DB)
  │
  └─ GET  /api/feed   ──→  Vercel Function (feed.js)
                               └─ reads last 50 rows from Postgres, returns JSON
```

### Database Schema

```sql
CREATE TABLE feed (
  id             SERIAL PRIMARY KEY,
  confession     TEXT         NOT NULL,
  archetype      VARCHAR(20)  NOT NULL,
  delusion_score INTEGER      NOT NULL,
  created_at     TIMESTAMP    DEFAULT NOW()
);
```

One table. No auth, no user accounts. Confessions are truncated to 80 chars before storage.

---

## Files Changed

### New: `api/judge.js`
Vercel serverless function. Accepts `{ text }` POST body. Calls Anthropic with the full confession system prompt. On success, inserts a row into `feed` (truncated confession, archetype, delusion_score). Returns the full judgment JSON to the browser.

### New: `api/scan.js`
Vercel serverless function. Accepts `{ text }` POST body. Calls Anthropic with the scanner system prompt. Returns `{ delusion_score, delusion_reason }`. Does not write to DB.

### New: `api/feed.js`
Vercel serverless function. GET only. Queries `SELECT * FROM feed ORDER BY created_at DESC LIMIT 50`. Returns JSON array.

### Modified: `src/lib/api.js`
- Replace direct `fetch('https://api.anthropic.com/...')` calls with `fetch('/api/judge')` and `fetch('/api/scan')`.
- Remove all Anthropic headers and API key references from the frontend.
- Keep the same return shape so no other component changes.

### Modified: `src/components/Feed.jsx`
- Replace `getFeed()` localStorage call with `fetch('/api/feed')`.
- Remove the 3-second polling interval (use a single fetch on mount + window focus).
- Entry shape changes: `created_at` (ISO string) instead of `timestamp` (ms number) — update `timeAgo()` accordingly.

### Modified: `src/components/Confess.jsx`
- Remove `saveToFeed()` call — server now handles feed insertion.
- Keep `saveToHistory()` — full local history with judgment text stays in localStorage.

### Modified: Error displays (`Confess.jsx`, `Scanner.jsx`)
- Replace raw `err.message` with a styled VOIDEX error card.
- Human-readable messages: network errors → "VOID UNREACHABLE", non-200 → "TRANSMISSION REJECTED", etc.

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel project settings | Server-side only, never in browser |
| `POSTGRES_URL` | Auto-set by Vercel Postgres | DB connection string for functions |

`VITE_ANTHROPIC_API_KEY` is removed from `.env` entirely.

---

## User Setup Steps (one-time)

1. Push repo to GitHub ✅ (done)
2. Import repo on vercel.com → auto-detects Vite, no config needed
3. Go to Storage tab → Create Postgres database → link to project (auto-sets `POSTGRES_URL`)
4. Add `ANTHROPIC_API_KEY` in Project Settings → Environment Variables
5. Run migration in Vercel Postgres query console:
   ```sql
   CREATE TABLE feed (
     id SERIAL PRIMARY KEY,
     confession TEXT NOT NULL,
     archetype VARCHAR(20) NOT NULL,
     delusion_score INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
6. Redeploy

---

## Out of Scope

- Rate limiting / spam protection (can add later)
- User accounts or moderation
- Feed pagination (50 entries is enough for now)
- `api/judge.js` saving the full judgment text to DB (only score + archetype stored)
