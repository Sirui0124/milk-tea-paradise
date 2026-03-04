import type { GameState, WorkbenchSlot } from '@/types/game'
import { getSlotCountForLevel } from '@/data/levels'

const SAVE_VERSION = 1

function makSlots(count: number): WorkbenchSlot[] {
  return Array.from({ length: count }, (_, i) => ({
    slotIndex: i,
    status: 'empty' as const,
    ingredientId: null,
    startTime: null,
    readyTime: null,
  }))
}

export function createInitialState(): GameState {
  const now = Date.now()
  const today = new Date().toISOString().slice(0, 10)
  return {
    player: {
      level: 1,
      exp: 0,
      gold: 50,
      stamina: 30,
      maxStamina: 60,
      lastStaminaUpdate: now,
      lastLoginDate: today,
      dailyBonusClaimed: false,
    },
    workbenchSlots: makSlots(getSlotCountForLevel(1)),
    craftSlot: { status: 'idle', recipeId: null, startTime: null, readyTime: null, resultQuality: null },
    inventory: {},
    craftedDrinks: {},
    recipeProgress: {},
    activeOrders: [],
    unlockedRecipes: ['R001', 'R002', 'R003'],
    unlockedIngredients: ['M001', 'M002', 'M003', 'T001', 'T002', 'T003'],
    ordersCompleted: 0,
    goldEarned: 0,
    saveVersion: SAVE_VERSION,
    createdAt: now,
    lastSavedAt: now,
  }
}

/** Apply offline stamina recovery and update slot count based on level */
export function applyOfflineRecovery(state: GameState): GameState {
  const now = Date.now()
  const elapsed = now - state.player.lastStaminaUpdate
  const recovered = Math.floor(elapsed / (3 * 60 * 1000))  // 1 per 3 min

  const newStamina = Math.min(
    state.player.maxStamina * 2,  // cap at 2× for offline (120)
    state.player.stamina + recovered
  )

  // Ensure slot count matches current level
  const expectedSlotCount = getSlotCountForLevel(state.player.level)
  let workbenchSlots = state.workbenchSlots
  if (workbenchSlots.length < expectedSlotCount) {
    const extra = makSlots(expectedSlotCount).slice(workbenchSlots.length).map((s, i) => ({
      ...s,
      slotIndex: workbenchSlots.length + i,
    }))
    workbenchSlots = [...workbenchSlots, ...extra]
  }

  return {
    ...state,
    player: {
      ...state.player,
      stamina: recovered > 0 ? newStamina : state.player.stamina,
      lastStaminaUpdate: recovered > 0 ? now : state.player.lastStaminaUpdate,
    },
    workbenchSlots,
  }
}
