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
