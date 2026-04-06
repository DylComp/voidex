import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  console.log('POSTGRES_URL set:', !!process.env.POSTGRES_URL)
  try {
    const { rows } = await sql`
      SELECT id, confession, archetype, delusion_score, created_at
      FROM feed
      ORDER BY created_at DESC
      LIMIT 50
    `

    return res.status(200).json(rows)
  } catch (err) {
    console.error('Feed query failed:', err)
    return res.status(500).json({ error: 'Feed unavailable' })
  }
}
