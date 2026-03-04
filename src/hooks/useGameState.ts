import { useState, useCallback } from 'react'
import type { GameState, IngredientId, RecipeId, Order } from '@/types/game'
import { INGREDIENTS_MAP } from '@/data/ingredients'
import { RECIPES_MAP } from '@/data/recipes'
import { LEVELS, getSlotCountForLevel } from '@/data/levels'
import { saveState } from '@/utils/storage'
import { getQualityFromCount } from '@/utils/qualityCalc'

type Setter = (prev: GameState) => GameState

export function useGameState(initial: GameState) {
  const [state, setStateRaw] = useState<GameState>(initial)

  const setState = useCallback((updater: Setter) => {
    setStateRaw(prev => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }, [])

  // ─── Stamina ────────────────────────────────────────────────────────────────
  const tickStamina = useCallback(() => {
    setStateRaw(prev => {
      const now = Date.now()
      const elapsed = now - prev.player.lastStaminaUpdate
      const recovered = Math.floor(elapsed / (3 * 60 * 1000))
      if (recovered === 0) return prev
      const newStamina = Math.min(prev.player.maxStamina * 2, prev.player.stamina + recovered)
      const next = {
        ...prev,
        player: { ...prev.player, stamina: newStamina, lastStaminaUpdate: now },
      }
      saveState(next)
      return next
    })
  }, [])

  // ─── Workbench ──────────────────────────────────────────────────────────────
  const startProducing = useCallback((slotIndex: number, ingredientId: IngredientId) => {
    setState(prev => {
      const def = INGREDIENTS_MAP[ingredientId]
      if (!def) return prev
      if (prev.player.stamina < def.staminaCost) return prev
      const now = Date.now()
      const slots = prev.workbenchSlots.map(s =>
        s.slotIndex === slotIndex
          ? { ...s, status: 'producing' as const, ingredientId, startTime: now, readyTime: now + def.productionTime * 1000 }
          : s
      )
      return {
        ...prev,
        player: { ...prev.player, stamina: prev.player.stamina - def.staminaCost },
        workbenchSlots: slots,
      }
    })
  }, [setState])

  const harvestSlot = useCallback((slotIndex: number) => {
    setState(prev => {
      const slot = prev.workbenchSlots[slotIndex]
      if (slot.status !== 'ready' || !slot.ingredientId) return prev
      const ingredientId = slot.ingredientId
      const slots = prev.workbenchSlots.map(s =>
        s.slotIndex === slotIndex
          ? { ...s, status: 'empty' as const, ingredientId: null, startTime: null, readyTime: null }
          : s
      )
      return {
        ...prev,
        workbenchSlots: slots,
        inventory: { ...prev.inventory, [ingredientId]: (prev.inventory[ingredientId] ?? 0) + 1 },
      }
    })
  }, [setState])

  /** Called by timer hook to mark ready slots */
  const checkWorkbenchReady = useCallback(() => {
    setStateRaw(prev => {
      const now = Date.now()
      let changed = false
      const slots = prev.workbenchSlots.map(s => {
        if (s.status === 'producing' && s.readyTime !== null && s.readyTime <= now) {
          changed = true
          return { ...s, status: 'ready' as const }
        }
        return s
      })
      if (!changed) return prev
      const next = { ...prev, workbenchSlots: slots }
      saveState(next)
      return next
    })
  }, [])

  // ─── Craft ──────────────────────────────────────────────────────────────────
  const startCrafting = useCallback((recipeId: RecipeId) => {
    setState(prev => {
      if (prev.craftSlot.status !== 'idle') return prev
      const recipe = RECIPES_MAP[recipeId]
      if (!recipe) return prev
      // Check inventory
      for (const ing of recipe.ingredients) {
        if ((prev.inventory[ing] ?? 0) < 1) return prev
      }
      // Consume ingredients
      const newInventory = { ...prev.inventory }
      for (const ing of recipe.ingredients) {
        newInventory[ing] = (newInventory[ing] ?? 0) - 1
      }
      const now = Date.now()
      return {
        ...prev,
        inventory: newInventory,
        craftSlot: {
          status: 'crafting',
          recipeId,
          startTime: now,
          readyTime: now + recipe.craftTime * 1000,
          resultQuality: null,
        },
      }
    })
  }, [setState])

  const checkCraftReady = useCallback(() => {
    setStateRaw(prev => {
      const cs = prev.craftSlot
      if (cs.status !== 'crafting' || cs.readyTime === null || cs.readyTime > Date.now()) return prev
      const recipeId = cs.recipeId!
      const craftCount = (prev.recipeProgress[recipeId]?.craftCount ?? 0) + 1
      const quality = getQualityFromCount(craftCount)
      const next = {
        ...prev,
        craftSlot: { ...cs, status: 'ready' as const, resultQuality: quality },
        recipeProgress: {
          ...prev.recipeProgress,
          [recipeId]: { craftCount, currentQuality: quality },
        },
      }
      saveState(next)
      return next
    })
  }, [])

  const collectCraft = useCallback(() => {
    setState(prev => {
      const cs = prev.craftSlot
      if (cs.status !== 'ready' || !cs.recipeId) return prev
      return {
        ...prev,
        craftSlot: { status: 'idle', recipeId: null, startTime: null, readyTime: null, resultQuality: null },
        craftedDrinks: {
          ...prev.craftedDrinks,
          [cs.recipeId]: (prev.craftedDrinks[cs.recipeId] ?? 0) + 1,
        },
      }
    })
  }, [setState])

  // ─── Orders ─────────────────────────────────────────────────────────────────
  const addOrder = useCallback((order: Order) => {
    setState(prev => {
      if (prev.activeOrders.length >= 3) return prev
      return { ...prev, activeOrders: [...prev.activeOrders, order] }
    })
  }, [setState])

  const fulfillOrder = useCallback((orderId: string) => {
    setState(prev => {
      const order = prev.activeOrders.find(o => o.id === orderId)
      if (!order || order.status !== 'pending') return prev
      if ((prev.craftedDrinks[order.recipeId] ?? 0) < 1) return prev

      const newDrinks = { ...prev.craftedDrinks, [order.recipeId]: prev.craftedDrinks[order.recipeId] - 1 }
      const newOrders = prev.activeOrders.filter(o => o.id !== orderId)

      // Level up check
      const newExp = prev.player.exp + order.expReward
      let { level, exp } = { level: prev.player.level, exp: newExp }
      const levelDef = LEVELS.find(l => l.level === level + 1)
      let unlockedRecipes = [...prev.unlockedRecipes]
      let unlockedIngredients = [...prev.unlockedIngredients]
      let workbenchSlots = prev.workbenchSlots

      if (levelDef && exp >= levelDef.expTotal) {
        level += 1
        for (const u of levelDef.unlocks) {
          if (u.type === 'recipe' && u.id && !unlockedRecipes.includes(u.id)) {
            unlockedRecipes = [...unlockedRecipes, u.id]
          }
          if (u.type === 'ingredient' && u.id && !unlockedIngredients.includes(u.id)) {
            unlockedIngredients = [...unlockedIngredients, u.id]
          }
        }
        // Expand workbench slots if needed
        const expectedCount = getSlotCountForLevel(level)
        if (workbenchSlots.length < expectedCount) {
          const extras = Array.from({ length: expectedCount - workbenchSlots.length }, (_, i) => ({
            slotIndex: workbenchSlots.length + i,
            status: 'empty' as const,
            ingredientId: null,
            startTime: null,
            readyTime: null,
          }))
          workbenchSlots = [...workbenchSlots, ...extras]
        }
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          level,
          exp: newExp,
          gold: prev.player.gold + order.goldReward,
        },
        craftedDrinks: newDrinks,
        activeOrders: newOrders,
        unlockedRecipes,
        unlockedIngredients,
        workbenchSlots,
        ordersCompleted: prev.ordersCompleted + 1,
        goldEarned: prev.goldEarned + order.goldReward,
      }
    })
  }, [setState])

  const removeExpiredOrders = useCallback(() => {
    setStateRaw(prev => {
      const now = Date.now()
      const filtered = prev.activeOrders.filter(o => o.expiresAt > now)
      if (filtered.length === prev.activeOrders.length) return prev
      const next = { ...prev, activeOrders: filtered }
      saveState(next)
      return next
    })
  }, [])

  // ─── Daily bonus ─────────────────────────────────────────────────────────────
  const claimDailyBonus = useCallback(() => {
    setState(prev => {
      const today = new Date().toISOString().slice(0, 10)
      if (prev.player.dailyBonusClaimed && prev.player.lastLoginDate === today) return prev
      return {
        ...prev,
        player: {
          ...prev.player,
          stamina: Math.min(prev.player.maxStamina * 2, prev.player.stamina + 30),
          gold: prev.player.gold + 20,
          lastLoginDate: today,
          dailyBonusClaimed: true,
        },
      }
    })
  }, [setState])

  return {
    state,
    tickStamina,
    startProducing,
    harvestSlot,
    checkWorkbenchReady,
    startCrafting,
    checkCraftReady,
    collectCraft,
    addOrder,
    fulfillOrder,
    removeExpiredOrders,
    claimDailyBonus,
  }
}
