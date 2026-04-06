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
