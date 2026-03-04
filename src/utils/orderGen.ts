import type { Order, RecipeId } from '@/types/game'
import { RECIPES_MAP } from '@/data/recipes'
import { calcReward, getQualityFromCount } from './qualityCalc'

const ORDER_DURATION_MS = 3 * 60 * 1000  // 3 minutes

let orderCounter = 0

export function generateOrder(
  unlockedRecipes: RecipeId[],
  recipeProgress: Record<string, { craftCount: number }>,
): Order {
  const recipeId = unlockedRecipes[Math.floor(Math.random() * unlockedRecipes.length)]
  const recipe = RECIPES_MAP[recipeId]
  const craftCount = recipeProgress[recipeId]?.craftCount ?? 0
  const quality = getQualityFromCount(craftCount)
  const goldReward = calcReward(recipe.basePrice, quality)
  const now = Date.now()

  return {
    id: `order_${now}_${++orderCounter}`,
    recipeId,
    quantity: 1,
    goldReward,
    expReward: Math.round(goldReward * 0.8),
    createdAt: now,
    expiresAt: now + ORDER_DURATION_MS,
    status: 'pending',
  }
}
