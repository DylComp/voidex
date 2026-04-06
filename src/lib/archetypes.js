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
  if (!name) return null
  const match = ARCHETYPES.find(a => a.name.toLowerCase() === name.toLowerCase())
  if (!match) console.warn(`VOIDEX: unknown archetype "${name}"`)
  return match || null
}
