import type { GameState } from '@/types/game'

const SAVE_KEY = 'milktea_paradise_v1'
const CURRENT_VERSION = 1

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }))
  } catch {
    // Storage full or unavailable — ignore silently
  }
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GameState
    if (parsed.saveVersion !== CURRENT_VERSION) return null  // future: migrate
    return parsed
  } catch {
    return null
  }
}

export function clearState(): void {
  localStorage.removeItem(SAVE_KEY)
}
