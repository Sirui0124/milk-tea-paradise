import { useEffect, useState } from 'react'
import type { AppNotification } from '@/types/game'
import styles from './Toast.module.css'

interface Props {
  notification: AppNotification | null
  onDismiss: () => void
}

export function Toast({ notification, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!notification) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 2000)
    return () => clearTimeout(t)
  }, [notification, onDismiss])

  if (!notification) return null

  return (
    <div className={`${styles.toast} ${styles[notification.type]} ${visible ? styles.visible : ''}`}>
      {notification.message}
    </div>
  )
}
