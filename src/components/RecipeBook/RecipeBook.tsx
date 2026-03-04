import type { RecipeId, GameState } from '@/types/game'
import { RECIPES } from '@/data/recipes'
import { INGREDIENTS_MAP } from '@/data/ingredients'
import { QUALITY_LABELS, QUALITY_COLORS } from '@/utils/qualityCalc'
import styles from './RecipeBook.module.css'

interface Props {
  unlockedRecipes: RecipeId[]
  recipeProgress: GameState['recipeProgress']
  playerLevel: number
}

export function RecipeBook({ unlockedRecipes, recipeProgress, playerLevel }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>📖 配方图鉴</span>
        <span className={styles.progress}>{unlockedRecipes.length}/{RECIPES.length}</span>
      </div>
      <div className={styles.list}>
        {RECIPES.map(recipe => {
          const unlocked = unlockedRecipes.includes(recipe.id)
          const progress = recipeProgress[recipe.id]

          return (
            <div key={recipe.id} className={`${styles.card} ${unlocked ? '' : styles.locked}`}>
              <span className={styles.emoji}>{unlocked ? recipe.emoji : '🔒'}</span>
              <div className={styles.info}>
                {unlocked ? (
                  <>
                    <span className={styles.name}>{recipe.name}</span>
                    <span className={styles.ingredients}>
                      {recipe.ingredients.map(id => INGREDIENTS_MAP[id]?.name).join(' + ')}
                    </span>
                    {progress ? (
                      <span
                        className={styles.quality}
                        style={{ color: QUALITY_COLORS[progress.currentQuality] }}
                      >
                        {QUALITY_LABELS[progress.currentQuality]} · 已制作{progress.craftCount}次
                      </span>
                    ) : (
                      <span className={styles.hint}>尚未制作</span>
                    )}
                  </>
                ) : (
                  <>
                    <span className={styles.name}>???</span>
                    <span className={styles.hint}>Lv.{recipe.unlockLevel} 解锁</span>
                    {playerLevel < recipe.unlockLevel && (
                      <span className={styles.hint}>当前等级不足</span>
                    )}
                  </>
                )}
              </div>
              <div className={styles.price}>
                {unlocked && <span>🪙{recipe.basePrice}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
