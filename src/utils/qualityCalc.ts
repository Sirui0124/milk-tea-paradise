import type { Quality } from '@/types/game'

export const QUALITY_MULTIPLIER: Record<Quality, number> = {
  N: 1.0,
  R: 1.3,
  SR: 1.7,
  SSR: 2.2,
  UR: 3.0,
}

export const QUALITY_LABELS: Record<Quality, string> = {
  N: '普通',
  R: '精良',
  SR: '优质',
  SSR: '极品',
  UR: '神品',
}

export const QUALITY_COLORS: Record<Quality, string> = {
  N: '#8B7355',
  R: '#4A90D9',
  SR: '#9B59B6',
  SSR: '#F39C12',
  UR: '#E74C3C',
}

export function getQualityFromCount(craftCount: number): Quality {
  if (craftCount >= 50) return 'UR'
  if (craftCount >= 30) return 'SSR'
  if (craftCount >= 15) return 'SR'
  if (craftCount >= 5) return 'R'
  return 'N'
}

export function calcReward(basePrice: number, quality: Quality): number {
  return Math.round(basePrice * QUALITY_MULTIPLIER[quality])
}
