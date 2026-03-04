import { useEffect, useRef } from 'react'

interface TimerCallbacks {
  onTick: () => void           // every second
  onOrderTick: () => void      // every second for order expiry
  onOrderGenerate: () => void  // every 90 seconds
}

export function useTimers(callbacks: TimerCallbacks) {
  const cbRef = useRef(callbacks)
  cbRef.current = callbacks

  useEffect(() => {
    let orderGenCounter = 0

    const id = setInterval(() => {
      cbRef.current.onTick()
      cbRef.current.onOrderTick()
      orderGenCounter++
      if (orderGenCounter >= 90) {
        orderGenCounter = 0
        cbRef.current.onOrderGenerate()
      }
    }, 1000)

    return () => clearInterval(id)
  }, [])
}
