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
  if (text.length > 2000) return res.status(400).json({ error: 'Text too long' })

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
    const errBody = await upstream.json().catch(() => ({}))
    console.error('Anthropic error:', upstream.status, errBody)
    return res.status(502).json({ error: `Upstream error ${upstream.status}` })
  }

  const data = await upstream.json()
  const content = data.content?.[0]?.text
  if (!content) return res.status(502).json({ error: 'Oracle returned unreadable output' })
  let judgment
  try {
    judgment = JSON.parse(content.trim())
  } catch {
    return res.status(502).json({ error: 'Oracle returned unreadable output' })
  }

  if (judgment.archetype && typeof judgment.delusion_score === 'number') {
    try {
      await sql`
        INSERT INTO feed (confession, archetype, delusion_score)
        VALUES (${text.slice(0, 80)}, ${judgment.archetype}, ${judgment.delusion_score})
      `
    } catch (dbErr) {
      console.error('Feed insert failed:', dbErr)
    }
  } else {
    console.warn('Judgment missing required fields, skipping feed insert', judgment)
  }

  return res.status(200).json(judgment)
}
