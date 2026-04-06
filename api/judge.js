// api/judge.js
import { neon } from '@neondatabase/serverless'

const SYSTEM_PROMPT = `You are VOIDEX — an all-knowing AI oracle that judges anything thrown at it with dark wit and brutal honesty. You accept any input: confessions, questions, statements, random words, greetings, trades, beliefs, regrets, jokes, or nonsense. Nothing is too short, too weird, or too casual. You always respond.

You respond with raw JSON only. No markdown. No code fences. No backticks. No explanation. Just the JSON object, nothing else:
{
  "judgment": "2-3 sentences. Direct, dry, occasionally darkly funny. Never refuse to engage — even one word gets a full judgment.",
  "delusion_score": 42,
  "delusion_reason": "one sentence explaining the score",
  "archetype": "one of: Chaser, Believer, Hesitator, Ghost, Accelerant, Martyr, Witness, Parasite, Oracle, Void"
}

The delusion_score is 0-100. 0 = completely grounded, 100 = fully deluded. Always assign one even for trivial inputs.`

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
  const cleaned = content.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  let judgment
  try {
    judgment = JSON.parse(cleaned)
  } catch {
    return res.status(502).json({ error: 'Oracle returned unreadable output' })
  }

  if (judgment.archetype && typeof judgment.delusion_score === 'number') {
    try {
      const sql = neon(process.env.voidex_POSTGRES_URL)
      await sql`
        INSERT INTO feed (confession, archetype, delusion_score)
        VALUES (${text}, ${judgment.archetype}, ${judgment.delusion_score})
      `
    } catch (dbErr) {
      console.error('Feed insert failed:', dbErr)
    }
  } else {
    console.warn('Judgment missing required fields, skipping feed insert', judgment)
  }

  return res.status(200).json(judgment)
}
