import type { CraftSlot, GameState, RecipeId } from '@/types/game'
import { RECIPES, RECIPES_MAP } from '@/data/recipes'
import { INGREDIENTS_MAP } from '@/data/ingredients'
import { QUALITY_LABELS, QUALITY_COLORS } from '@/utils/qualityCalc'
import styles from './CraftStation.module.css'

interface Props {
  craftSlot: CraftSlot
  inventory: GameState['inventory']
  craftedDrinks: GameState['craftedDrinks']
  unlockedRecipes: RecipeId[]
  recipeProgress: GameState['recipeProgress']
  selectedRecipeId: RecipeId | null
  onSelectRecipe: (id: RecipeId) => void
  onStartCraft: (id: RecipeId) => void
  onCollect: () => void
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void
}

function timeLeft(readyTime: number | null): string {
  if (!readyTime) return ''
  const diff = Math.max(0, readyTime - Date.now())
  return `${Math.ceil(diff / 1000)}s`
}

export function CraftStation({
  craftSlot, inventory, craftedDrinks, unlockedRecipes,
  recipeProgress, selectedRecipeId, onSelectRecipe,
  onStartCraft, onCollect, onNotify,
}: Props) {
  const unlockedRecipeDefs = RECIPES.filter(r => unlockedRecipes.includes(r.id))
  const selected = selectedRecipeId ? RECIPES_MAP[selectedRecipeId] : null

  function canCraft(recipeId: RecipeId): boolean {
    const recipe = RECIPES_MAP[recipeId]
    if (!recipe) return false
    return recipe.ingredients.every(ing => (inventory[ing] ?? 0) >= 1)
  }

  function handleCraft() {
    if (!selectedRecipeId) return
    if (craftSlot.status !== 'idle') {
      onNotify('制作台正忙！', 'error')
      return
    }
    if (!canCraft(selectedRecipeId)) {
      onNotify('食材不足！', 'error')
      return
    }
    onStartCraft(selectedRecipeId)
    onNotify(`开始制作 ${RECIPES_MAP[selectedRecipeId].name}...`, 'info')
  }

  function handleCollect() {
    if (craftSlot.status !== 'ready') return
    onCollect()
    const name = craftSlot.recipeId ? RECIPES_MAP[craftSlot.recipeId]?.name : '饮品'
    const quality = craftSlot.resultQuality
    onNotify(`${name} 制作完成！品质：${quality ? QUALITY_LABELS[quality] : ''}`, 'success')
  }

  return (
    <div className={styles.wrap}>
      {/* Craft slot */}
      <div className={styles.station}>
        <div className={styles.stationTitle}>☕ 制作台</div>
        {craftSlot.status === 'idle' && (
          <div className={styles.idle}>等待制作中...</div>
        )}
        {craftSlot.status === 'crafting' && craftSlot.recipeId && (
          <div className={styles.crafting}>
            <span className={styles.craftEmoji}>{RECIPES_MAP[craftSlot.recipeId]?.emoji}</span>
            <span className={styles.craftName}>{RECIPES_MAP[craftSlot.recipeId]?.name}</span>
            <div className={styles.craftAnim}>☕✨</div>
            <span className={styles.craftTimer}>{timeLeft(craftSlot.readyTime)}</span>
          </div>
        )}
        {craftSlot.status === 'ready' && craftSlot.recipeId && (
          <button className={styles.readyBtn} onClick={handleCollect}>
            <span className={styles.craftEmoji}>{RECIPES_MAP[craftSlot.recipeId]?.emoji}</span>
            <span>完成！点击收取</span>
            {craftSlot.resultQuality && (
              <span
                className={styles.qualityBadge}
                style={{ color: QUALITY_COLORS[craftSlot.resultQuality] }}
              >
                {QUALITY_LABELS[craftSlot.resultQuality]}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Crafted drinks inventory */}
      {Object.keys(craftedDrinks).some(k => (craftedDrinks[k] ?? 0) > 0) && (
        <div className={styles.drinksSection}>
          <div className={styles.sectionTitle}>成品库存</div>
          <div className={styles.drinksGrid}>
            {unlockedRecipes.filter(r => (craftedDrinks[r] ?? 0) > 0).map(rid => {
              const recipe = RECIPES_MAP[rid]
              return (
                <div key={rid} className={styles.drinkItem}>
                  <span className={styles.drinkEmoji}>{recipe?.emoji}</span>
                  <span className={styles.drinkCount}>{craftedDrinks[rid]}</span>
                  <span className={styles.drinkName}>{recipe?.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recipe list */}
      <div className={styles.recipeList}>
        <div className={styles.sectionTitle}>配方选择</div>
        {unlockedRecipeDefs.map(recipe => {
          const progress = recipeProgress[recipe.id]
          const craftable = canCraft(recipe.id)
          const isSelected = selectedRecipeId === recipe.id

          return (
            <button
              key={recipe.id}
              className={`${styles.recipeCard} ${isSelected ? styles.selected : ''} ${craftable ? styles.craftable : ''}`}
              onClick={() => onSelectRecipe(recipe.id)}
            >
              <span className={styles.recipeEmoji}>{recipe.emoji}</span>
              <div className={styles.recipeInfo}>
                <span className={styles.recipeName}>{recipe.name}</span>
                <span className={styles.recipeDesc}>
                  {recipe.ingredients.map(id => INGREDIENTS_MAP[id]?.name).join(' + ')}
                </span>
                {progress && (
                  <span className={styles.recipeProgress}>
                    已制作 {progress.craftCount} 次 · {QUALITY_LABELS[progress.currentQuality]}
                  </span>
                )}
              </div>
              <div className={styles.recipeRight}>
                <span className={styles.recipePrice}>🪙{recipe.basePrice}</span>
                {craftable && <span className={styles.canMake}>可制作</span>}
              </div>
            </button>
          )
        })}
      </div>

      {/* Craft button */}
      {selected && (
        <div className={styles.craftBtnWrap}>
          <button
            className={`${styles.craftBtn} ${canCraft(selected.id) && craftSlot.status === 'idle' ? styles.active : ''}`}
            onClick={handleCraft}
          >
            制作 {selected.name} {selected.emoji}
          </button>
        </div>
      )}
    </div>
  )
}
