// ─── IDs ─────────────────────────────────────────────────────────────────────
export type IngredientId = string
export type RecipeId = string

// ─── Enums ────────────────────────────────────────────────────────────────────
export type SlotStatus = 'empty' | 'producing' | 'ready'
export type CraftStatus = 'idle' | 'crafting' | 'ready'
export type OrderStatus = 'pending' | 'completed' | 'expired'
export type Quality = 'N' | 'R' | 'SR' | 'SSR' | 'UR'
export type NavTab = 'main' | 'recipe' | 'shop' | 'collection' | 'settings'
export type MainTab = 'workbench' | 'craft' | 'orders'

// ─── Static Data Types ────────────────────────────────────────────────────────
export interface IngredientDef {
  id: IngredientId
  name: string
  emoji: string
  productionTime: number  // seconds
  staminaCost: number
  unlockLevel: number
  description: string
}

export interface RecipeDef {
  id: RecipeId
  name: string
  emoji: string
  ingredients: IngredientId[]
  basePrice: number  // gold reward
  craftTime: number  // seconds (MVP always 2)
  unlockLevel: number
  description: string
}

export interface LevelDef {
  level: number
  expRequired: number  // exp needed to reach this level
  expTotal: number     // cumulative exp at start of level
  unlocks: LevelUnlock[]
}

export interface LevelUnlock {
  type: 'recipe' | 'ingredient' | 'workbench_slots' | 'feature'
  id?: string
  count?: number
  label: string
}

// ─── Runtime State Types ──────────────────────────────────────────────────────
export interface WorkbenchSlot {
  slotIndex: number
  status: SlotStatus
  ingredientId: IngredientId | null
  startTime: number | null   // unix ms
  readyTime: number | null   // unix ms
}

export interface CraftSlot {
  status: CraftStatus
  recipeId: RecipeId | null
  startTime: number | null
  readyTime: number | null
  resultQuality: Quality | null
}

export interface Order {
  id: string
  recipeId: RecipeId
  quantity: number  // MVP always 1
  goldReward: number
  expReward: number
  createdAt: number  // unix ms
  expiresAt: number  // unix ms
  status: OrderStatus
}

// ─── Player Stats ─────────────────────────────────────────────────────────────
export interface PlayerStats {
  level: number
  exp: number
  gold: number
  stamina: number
  maxStamina: number        // 60 base
  lastStaminaUpdate: number // unix ms
  lastLoginDate: string     // 'YYYY-MM-DD'
  dailyBonusClaimed: boolean
}

// ─── Recipe Progress ──────────────────────────────────────────────────────────
export interface RecipeProgress {
  craftCount: number
  currentQuality: Quality
}

// ─── Core GameState ───────────────────────────────────────────────────────────
export interface GameState {
  player: PlayerStats
  workbenchSlots: WorkbenchSlot[]
  craftSlot: CraftSlot
  inventory: Record<IngredientId, number>
  craftedDrinks: Record<RecipeId, number>
  recipeProgress: Record<RecipeId, RecipeProgress>
  activeOrders: Order[]
  unlockedRecipes: RecipeId[]
  unlockedIngredients: IngredientId[]
  ordersCompleted: number
  goldEarned: number
  saveVersion: number
  createdAt: number
  lastSavedAt: number
}

// ─── UI State (not persisted) ─────────────────────────────────────────────────
export interface UIState {
  activeNavTab: NavTab
  activeMainTab: MainTab
  selectedRecipeId: RecipeId | null
  showDailyBonus: boolean
  notification: AppNotification | null
}

export interface AppNotification {
  message: string
  type: 'success' | 'error' | 'info'
  id: number
}
