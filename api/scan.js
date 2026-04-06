// api/scan.js
const SCANNER_PROMPT = `You are VOIDEX. Scan any input — belief, statement, question, word, or phrase — and return a delusion score. Accept everything, never refuse. Raw JSON only, no markdown, no code fences, no backticks:
{
  "delusion_score": 42,
  "delusion_reason": "one sentence verdict"
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
      max_tokens: 128,
      system: SCANNER_PROMPT,
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
  try {
    return res.status(200).json(JSON.parse(cleaned))
  } catch {
    return res.status(502).json({ error: 'Oracle returned unreadable output' })
  }
}
