import type { NavTab } from '@/types/game'
import styles from './Navigation.module.css'

interface Props {
  active: NavTab
  onChange: (tab: NavTab) => void
}

const TABS: { id: NavTab; label: string; icon: string }[] = [
  { id: 'main',       label: '主页',   icon: '🏠' },
  { id: 'recipe',     label: '配方',   icon: '📖' },
  { id: 'shop',       label: '商店',   icon: '🛍️' },
  { id: 'collection', label: '图鉴',   icon: '🏆' },
  { id: 'settings',   label: '设置',   icon: '⚙️' },
]

export function Navigation({ active, onChange }: Props) {
  return (
    <nav className={styles.nav}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
