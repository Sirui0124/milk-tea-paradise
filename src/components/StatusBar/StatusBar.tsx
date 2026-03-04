import type { PlayerStats } from '@/types/game'
import { LEVELS } from '@/data/levels'
import styles from './StatusBar.module.css'

interface Props {
  player: PlayerStats
}

export function StatusBar({ player }: Props) {
  const nextLevel = LEVELS.find(l => l.level === player.level + 1)
  const expForCurrent = LEVELS.find(l => l.level === player.level)?.expTotal ?? 0
  const expForNext = nextLevel?.expTotal ?? expForCurrent
  const expProgress = expForNext > expForCurrent
    ? (player.exp - expForCurrent) / (expForNext - expForCurrent)
    : 1
  const staminaPercent = player.stamina / player.maxStamina

  return (
    <div className={styles.bar}>
      <div className={styles.level}>
        <span className={styles.lvLabel}>Lv.</span>
        <span className={styles.lvNum}>{player.level}</span>
        <div className={styles.expBar}>
          <div className={styles.expFill} style={{ width: `${Math.min(100, expProgress * 100)}%` }} />
        </div>
      </div>
      <div className={styles.stamina}>
        <span>⚡</span>
        <div className={styles.staminaBar}>
          <div className={styles.staminaFill} style={{ width: `${Math.min(100, staminaPercent * 100)}%` }} />
        </div>
        <span className={styles.staminaText}>{player.stamina}/{player.maxStamina}</span>
      </div>
      <div className={styles.gold}>
        <span>🪙</span>
        <span className={styles.goldNum}>{player.gold.toLocaleString()}</span>
      </div>
    </div>
  )
}
