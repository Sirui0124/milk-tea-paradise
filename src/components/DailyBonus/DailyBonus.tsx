import styles from './DailyBonus.module.css'

interface Props {
  onClaim: () => void
}

export function DailyBonus({ onClaim }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.icon}>🎁</div>
        <div className={styles.title}>每日登录奖励</div>
        <div className={styles.rewards}>
          <div className={styles.reward}><span>⚡</span><span>+30 体力</span></div>
          <div className={styles.reward}><span>🪙</span><span>+20 金币</span></div>
        </div>
        <button className={styles.btn} onClick={onClaim}>领取奖励！</button>
      </div>
    </div>
  )
}
