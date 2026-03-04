import type { Order, GameState } from '@/types/game'
import { RECIPES_MAP } from '@/data/recipes'
import styles from './Orders.module.css'

interface Props {
  orders: Order[]
  craftedDrinks: GameState['craftedDrinks']
  onFulfill: (orderId: string) => void
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void
}

function formatTimeLeft(expiresAt: number): { text: string; urgent: boolean } {
  const diff = Math.max(0, expiresAt - Date.now())
  const s = Math.floor(diff / 1000)
  const urgent = s < 60
  if (s < 60) return { text: `${s}s`, urgent }
  return { text: `${Math.floor(s / 60)}m${s % 60}s`, urgent }
}

export function Orders({ orders, craftedDrinks, onFulfill, onNotify }: Props) {
  function handleFulfill(order: Order) {
    const hasDrink = (craftedDrinks[order.recipeId] ?? 0) >= 1
    if (!hasDrink) {
      const recipe = RECIPES_MAP[order.recipeId]
      onNotify(`需要先制作 ${recipe?.name}！`, 'error')
      return
    }
    onFulfill(order.id)
    onNotify(`完成订单！获得 🪙${order.goldReward}`, 'success')
  }

  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛎️</div>
        <div className={styles.emptyText}>还没有顾客，稍等片刻...</div>
        <div className={styles.emptyHint}>每90秒会出现新顾客</div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>🛎️ 顾客订单</span>
        <span className={styles.hint}>{orders.length}/3</span>
      </div>
      <div className={styles.list}>
        {orders.map(order => {
          const recipe = RECIPES_MAP[order.recipeId]
          const { text: timeText, urgent } = formatTimeLeft(order.expiresAt)
          const hasDrink = (craftedDrinks[order.recipeId] ?? 0) >= 1

          return (
            <div key={order.id} className={`${styles.card} ${urgent ? styles.urgent : ''}`}>
              <div className={styles.cardTop}>
                <span className={styles.orderEmoji}>{recipe?.emoji ?? '🧋'}</span>
                <div className={styles.orderInfo}>
                  <span className={styles.orderName}>{recipe?.name ?? '未知饮品'}</span>
                  <span className={styles.orderReward}>🪙{order.goldReward} · ⭐{order.expReward}exp</span>
                </div>
                <div className={`${styles.timer} ${urgent ? styles.timerUrgent : ''}`}>
                  {timeText}
                </div>
              </div>
              <button
                className={`${styles.fulfillBtn} ${hasDrink ? styles.canFulfill : ''}`}
                onClick={() => handleFulfill(order)}
              >
                {hasDrink ? '✓ 完成订单' : '需要制作'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

