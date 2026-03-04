import type { RecipeDef } from '@/types/game'

export const RECIPES: RecipeDef[] = [
  {
    id: 'R001', name: '经典珍珠奶茶', emoji: '🧋',
    ingredients: ['M001', 'T003'],
    basePrice: 12, craftTime: 2, unlockLevel: 1,
    description: '最经典的台式珍珠奶茶，永远的神',
  },
  {
    id: 'R002', name: '椰香奶茶', emoji: '🥥',
    ingredients: ['M002', 'T003'],
    basePrice: 14, craftTime: 2, unlockLevel: 1,
    description: '清爽椰香与醇厚奶茶的完美邂逅',
  },
  {
    id: 'R003', name: '红豆奶茶', emoji: '🫘',
    ingredients: ['M003', 'T003'],
    basePrice: 13, craftTime: 2, unlockLevel: 1,
    description: '软糯红豆与奶茶温柔拥抱',
  },
  {
    id: 'R004', name: '布丁奶茶', emoji: '🍮',
    ingredients: ['M004', 'T003'],
    basePrice: 15, craftTime: 2, unlockLevel: 2,
    description: '焦糖布丁滑入奶茶，甜蜜加倍',
  },
  {
    id: 'R005', name: '芋圆仙草奶茶', emoji: '💜',
    ingredients: ['M006', 'M007', 'T005'],
    basePrice: 18, craftTime: 2, unlockLevel: 3,
    description: '芋圆弹牙、仙草清凉、鲜奶香甜',
  },
  {
    id: 'R006', name: '奶盖茶', emoji: '🎪',
    ingredients: ['M005', 'T004'],
    basePrice: 20, craftTime: 2, unlockLevel: 3,
    description: '乌龙茶香与奶盖咸甜的绝妙碰撞',
  },
  {
    id: 'R007', name: '西米露奶茶', emoji: '🫧',
    ingredients: ['M008', 'T006'],
    basePrice: 16, craftTime: 2, unlockLevel: 4,
    description: '晶莹西米漂浮在椰奶之上',
  },
  {
    id: 'R008', name: '芝士抹茶', emoji: '🍵',
    ingredients: ['M009', 'T002'],
    basePrice: 22, craftTime: 2, unlockLevel: 5,
    description: '浓郁芝士遇上清苦抹茶，层次丰富',
  },
]

export const RECIPES_MAP = Object.fromEntries(
  RECIPES.map(r => [r.id, r])
) as Record<string, RecipeDef>
