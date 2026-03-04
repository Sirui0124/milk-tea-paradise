import type { LevelDef } from '@/types/game'

export const LEVELS: LevelDef[] = [
  { level: 1, expRequired: 0, expTotal: 0, unlocks: [
    { type: 'recipe', id: 'R001', label: '经典珍珠奶茶' },
    { type: 'recipe', id: 'R002', label: '椰香奶茶' },
    { type: 'recipe', id: 'R003', label: '红豆奶茶' },
  ]},
  { level: 2, expRequired: 100, expTotal: 100, unlocks: [
    { type: 'recipe', id: 'R004', label: '布丁奶茶' },
    { type: 'ingredient', id: 'M004', label: '解锁食材：布丁' },
    { type: 'ingredient', id: 'T004', label: '解锁食材：乌龙茶' },
    { type: 'ingredient', id: 'M007', label: '解锁食材：仙草' },
    { type: 'ingredient', id: 'T005', label: '解锁食材：鲜奶' },
  ]},
  { level: 3, expRequired: 200, expTotal: 300, unlocks: [
    { type: 'recipe', id: 'R005', label: '芋圆仙草奶茶' },
    { type: 'recipe', id: 'R006', label: '奶盖茶' },
    { type: 'ingredient', id: 'M005', label: '解锁食材：奶盖' },
    { type: 'ingredient', id: 'M006', label: '解锁食材：芋圆' },
    { type: 'ingredient', id: 'T006', label: '解锁食材：椰奶' },
    { type: 'workbench_slots', count: 6, label: '工作台扩展到6格' },
  ]},
  { level: 4, expRequired: 350, expTotal: 650, unlocks: [
    { type: 'recipe', id: 'R007', label: '西米露奶茶' },
    { type: 'ingredient', id: 'M008', label: '解锁食材：西米' },
    { type: 'workbench_slots', count: 8, label: '工作台扩展到8格' },
  ]},
  { level: 5, expRequired: 500, expTotal: 1150, unlocks: [
    { type: 'recipe', id: 'R008', label: '芝士抹茶' },
    { type: 'ingredient', id: 'M009', label: '解锁食材：芝士' },
    { type: 'workbench_slots', count: 10, label: '工作台扩展到10格' },
  ]},
  { level: 6, expRequired: 700, expTotal: 1850, unlocks: [
    { type: 'workbench_slots', count: 12, label: '工作台扩展到12格' },
  ]},
  { level: 7, expRequired: 900, expTotal: 2750, unlocks: [] },
  { level: 8, expRequired: 1100, expTotal: 3850, unlocks: [
    { type: 'workbench_slots', count: 14, label: '工作台扩展到14格' },
  ]},
  { level: 9, expRequired: 1300, expTotal: 5150, unlocks: [] },
  { level: 10, expRequired: 1500, expTotal: 6650, unlocks: [
    { type: 'workbench_slots', count: 16, label: '工作台扩展到16格（最大）' },
    { type: 'feature', label: '解锁：同时制作2杯' },
  ]},
  { level: 11, expRequired: 1800, expTotal: 8450, unlocks: [] },
  { level: 12, expRequired: 2100, expTotal: 10550, unlocks: [] },
  { level: 13, expRequired: 2400, expTotal: 12950, unlocks: [] },
  { level: 14, expRequired: 2700, expTotal: 15650, unlocks: [] },
  { level: 15, expRequired: 3000, expTotal: 18650, unlocks: [] },
  { level: 16, expRequired: 3500, expTotal: 22150, unlocks: [] },
  { level: 17, expRequired: 4000, expTotal: 26150, unlocks: [] },
  { level: 18, expRequired: 4500, expTotal: 30650, unlocks: [] },
  { level: 19, expRequired: 5000, expTotal: 35650, unlocks: [] },
  { level: 20, expRequired: 6000, expTotal: 41650, unlocks: [
    { type: 'feature', label: '满级！解锁隐藏配方' },
  ]},
]

export function getSlotCountForLevel(level: number): number {
  if (level >= 10) return 16
  if (level >= 8) return 14
  if (level >= 6) return 12
  if (level >= 5) return 10
  if (level >= 4) return 8
  if (level >= 3) return 6
  return 4
}
