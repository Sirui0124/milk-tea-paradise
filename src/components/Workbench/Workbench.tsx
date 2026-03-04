import { useState } from 'react'
import type { WorkbenchSlot, IngredientId, GameState } from '@/types/game'
import { INGREDIENTS, INGREDIENTS_MAP } from '@/data/ingredients'
import { Modal } from '../common/Modal'
import styles from './Workbench.module.css'

interface Props {
  slots: WorkbenchSlot[]
  inventory: GameState['inventory']
  stamina: number
  unlockedIngredients: IngredientId[]
  onStartProducing: (slotIndex: number, ingredientId: IngredientId) => void
  onHarvest: (slotIndex: number) => void
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void
}

function timeLeft(readyTime: number | null): string {
  if (!readyTime) return ''
  const diff = Math.max(0, readyTime - Date.now())
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m${s % 60}s`
}

export function Workbench({ slots, inventory, stamina, unlockedIngredients, onStartProducing, onHarvest, onNotify }: Props) {
  const [pickingSlot, setPickingSlot] = useState<number | null>(null)

  const availableIngredients = INGREDIENTS.filter(i => unlockedIngredients.includes(i.id))

  function handleSlotClick(slot: WorkbenchSlot) {
    if (slot.status === 'ready') {
      onHarvest(slot.slotIndex)
      const name = INGREDIENTS_MAP[slot.ingredientId!]?.name ?? '食材'
      onNotify(`收获了 ${name}！`, 'success')
      return
    }
    if (slot.status === 'producing') return  // busy, show timer
    setPickingSlot(slot.slotIndex)
  }

  function handlePick(ingredientId: IngredientId) {
    if (pickingSlot === null) return
    const def = INGREDIENTS_MAP[ingredientId]
    if (stamina < def.staminaCost) {
      onNotify('体力不足！', 'error')
      setPickingSlot(null)
      return
    }
    onStartProducing(pickingSlot, ingredientId)
    onNotify(`开始制作 ${def.name}`, 'info')
    setPickingSlot(null)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>🌱 工作台</span>
        <span className={styles.hint}>点击空格种植食材</span>
      </div>
      <div className={styles.grid}>
        {slots.map(slot => (
          <button
            key={slot.slotIndex}
            className={`${styles.slot} ${styles[slot.status]}`}
            onClick={() => handleSlotClick(slot)}
          >
            {slot.status === 'empty' && <span className={styles.plus}>+</span>}
            {slot.status === 'producing' && (
              <>
                <span className={styles.emoji}>{INGREDIENTS_MAP[slot.ingredientId!]?.emoji}</span>
                <span className={styles.timer}>{timeLeft(slot.readyTime)}</span>
              </>
            )}
            {slot.status === 'ready' && (
              <>
                <span className={styles.emoji}>{INGREDIENTS_MAP[slot.ingredientId!]?.emoji}</span>
                <span className={styles.readyBadge}>收获!</span>
              </>
            )}
          </button>
        ))}
      </div>

      <div className={styles.inventorySection}>
        <div className={styles.invTitle}>食材库存</div>
        <div className={styles.invGrid}>
          {availableIngredients.map(ing => (
            <div key={ing.id} className={styles.invItem}>
              <span className={styles.invEmoji}>{ing.emoji}</span>
              <span className={styles.invCount}>{inventory[ing.id] ?? 0}</span>
              <span className={styles.invName}>{ing.name}</span>
            </div>
          ))}
        </div>
      </div>

      {pickingSlot !== null && (
        <Modal title="选择要种植的食材" onClose={() => setPickingSlot(null)}>
          <div className={styles.pickGrid}>
            {availableIngredients.map(ing => (
              <button
                key={ing.id}
                className={styles.pickItem}
                onClick={() => handlePick(ing.id)}
              >
                <span className={styles.pickEmoji}>{ing.emoji}</span>
                <span className={styles.pickName}>{ing.name}</span>
                <span className={styles.pickTime}>
                  {ing.productionTime < 60
                    ? `${ing.productionTime}s`
                    : `${Math.floor(ing.productionTime / 60)}m`}
                </span>
                <span className={styles.pickCost}>⚡{ing.staminaCost}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
