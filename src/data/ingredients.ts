import type { IngredientDef } from '@/types/game'

export const INGREDIENTS: IngredientDef[] = [
  {
    id: 'M001', name: '珍珠', emoji: '⚫',
    productionTime: 30, staminaCost: 1, unlockLevel: 1,
    description: 'Q弹有嚼劲的黑珍珠，奶茶灵魂所在',
  },
  {
    id: 'M002', name: '椰果', emoji: '🥥',
    productionTime: 45, staminaCost: 1, unlockLevel: 1,
    description: '清脆爽口，椰香四溢',
  },
  {
    id: 'M003', name: '红豆', emoji: '🫘',
    productionTime: 60, staminaCost: 1, unlockLevel: 1,
    description: '软糯甜蜜的红豆沙',
  },
  {
    id: 'M004', name: '布丁', emoji: '🍮',
    productionTime: 90, staminaCost: 2, unlockLevel: 2,
    description: '细腻丝滑的焦糖布丁',
  },
  {
    id: 'M005', name: '奶盖', emoji: '🧁',
    productionTime: 120, staminaCost: 2, unlockLevel: 3,
    description: '绵密细腻的奶盖，咸甜交织',
  },
  {
    id: 'M006', name: '芋圆', emoji: '🟣',
    productionTime: 150, staminaCost: 2, unlockLevel: 3,
    description: '软糯香甜的芋圆，颜值颇高',
  },
  {
    id: 'M007', name: '仙草', emoji: '🟢',
    productionTime: 60, staminaCost: 1, unlockLevel: 2,
    description: '清凉解暑的仙草冻',
  },
  {
    id: 'M008', name: '西米', emoji: '🫧',
    productionTime: 120, staminaCost: 2, unlockLevel: 4,
    description: '晶莹剔透的西米，热带风情',
  },
  {
    id: 'M009', name: '芝士', emoji: '🧀',
    productionTime: 180, staminaCost: 3, unlockLevel: 5,
    description: '浓郁香醇的芝士奶盖',
  },
  {
    id: 'T001', name: '红茶', emoji: '🍵',
    productionTime: 30, staminaCost: 1, unlockLevel: 1,
    description: '醇厚回甘的锡兰红茶',
  },
  {
    id: 'T002', name: '绿茶', emoji: '🍃',
    productionTime: 30, staminaCost: 1, unlockLevel: 1,
    description: '清新淡雅的龙井绿茶',
  },
  {
    id: 'T003', name: '奶茶基底', emoji: '🥛',
    productionTime: 45, staminaCost: 1, unlockLevel: 1,
    description: '香浓顺滑的港式奶茶基底',
  },
  {
    id: 'T004', name: '乌龙茶', emoji: '🫖',
    productionTime: 45, staminaCost: 1, unlockLevel: 2,
    description: '花香馥郁的高山乌龙',
  },
  {
    id: 'T005', name: '鲜奶', emoji: '🍼',
    productionTime: 30, staminaCost: 1, unlockLevel: 2,
    description: '新鲜香浓的全脂鲜奶',
  },
  {
    id: 'T006', name: '椰奶', emoji: '🌴',
    productionTime: 45, staminaCost: 1, unlockLevel: 3,
    description: '天然椰奶，热带风味浓郁',
  },
]

export const INGREDIENTS_MAP = Object.fromEntries(
  INGREDIENTS.map(i => [i.id, i])
) as Record<string, IngredientDef>
