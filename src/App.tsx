import { useState, useCallback } from 'react'
import type { NavTab, MainTab, AppNotification } from './types/game'
import { loadState } from './utils/storage'
import { createInitialState, applyOfflineRecovery } from './store/gameStore'
import { generateOrder } from './utils/orderGen'
import { useGameState } from './hooks/useGameState'
import { useTimers } from './hooks/useTimers'
import { StatusBar } from './components/StatusBar/StatusBar'
import { Navigation } from './components/Navigation/Navigation'
import { Workbench } from './components/Workbench/Workbench'
import { CraftStation } from './components/CraftStation/CraftStation'
import { Orders } from './components/Orders/Orders'
import { RecipeBook } from './components/RecipeBook/RecipeBook'
import { DailyBonus } from './components/DailyBonus/DailyBonus'
import { Toast } from './components/common/Toast'
import styles from './App.module.css'

function loadOrCreate() {
  const saved = loadState()
  if (saved) return applyOfflineRecovery(saved)
  return createInitialState()
}

function needsDailyBonus(state: ReturnType<typeof loadOrCreate>): boolean {
  const today = new Date().toISOString().slice(0, 10)
  return state.player.lastLoginDate !== today || !state.player.dailyBonusClaimed
}

export default function App() {
  const initialState = loadOrCreate()

  const {
    state,
    tickStamina,
    startProducing,
    harvestSlot,
    checkWorkbenchReady,
    startCrafting,
    checkCraftReady,
    collectCraft,
    addOrder,
    fulfillOrder,
    removeExpiredOrders,
    claimDailyBonus,
  } = useGameState(initialState)

  const [navTab, setNavTab] = useState<NavTab>('main')
  const [mainTab, setMainTab] = useState<MainTab>('workbench')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [showDailyBonus, setShowDailyBonus] = useState(needsDailyBonus(initialState))
  const [notification, setNotification] = useState<AppNotification | null>(null)

  const notify = useCallback((message: string, type: AppNotification['type']) => {
    setNotification({ message, type, id: Date.now() })
  }, [])

  const dismissNotification = useCallback(() => setNotification(null), [])

  const handleOrderGenerate = useCallback(() => {
    if (state.activeOrders.length >= 3) return
    if (state.unlockedRecipes.length === 0) return
    const order = generateOrder(state.unlockedRecipes, state.recipeProgress)
    addOrder(order)
  }, [state.activeOrders.length, state.unlockedRecipes, state.recipeProgress, addOrder])

  useTimers({
    onTick: () => {
      tickStamina()
      checkWorkbenchReady()
      checkCraftReady()
    },
    onOrderTick: removeExpiredOrders,
    onOrderGenerate: handleOrderGenerate,
  })

  function handleClaimBonus() {
    claimDailyBonus()
    setShowDailyBonus(false)
    notify('每日奖励已领取！⚡30 + 🪙20', 'success')
  }

  return (
    <div className={styles.app}>
      <StatusBar player={state.player} />

      <main className={styles.main}>
        {navTab === 'main' && (
          <>
            <div className={styles.mainTabs}>
              {(['workbench', 'craft', 'orders'] as MainTab[]).map(tab => (
                <button
                  key={tab}
                  className={`${styles.mainTab} ${mainTab === tab ? styles.mainTabActive : ''}`}
                  onClick={() => setMainTab(tab)}
                >
                  {tab === 'workbench' ? '🌱 工作台' : tab === 'craft' ? '☕ 制作' : '🛎️ 订单'}
                  {tab === 'orders' && state.activeOrders.length > 0 && (
                    <span className={styles.badge}>{state.activeOrders.length}</span>
                  )}
                </button>
              ))}
            </div>
            <div className={styles.content}>
              {mainTab === 'workbench' && (
                <Workbench
                  slots={state.workbenchSlots}
                  inventory={state.inventory}
                  stamina={state.player.stamina}
                  unlockedIngredients={state.unlockedIngredients}
                  onStartProducing={startProducing}
                  onHarvest={harvestSlot}
                  onNotify={notify}
                />
              )}
              {mainTab === 'craft' && (
                <CraftStation
                  craftSlot={state.craftSlot}
                  inventory={state.inventory}
                  craftedDrinks={state.craftedDrinks}
                  unlockedRecipes={state.unlockedRecipes}
                  recipeProgress={state.recipeProgress}
                  selectedRecipeId={selectedRecipeId}
                  onSelectRecipe={setSelectedRecipeId}
                  onStartCraft={startCrafting}
                  onCollect={collectCraft}
                  onNotify={notify}
                />
              )}
              {mainTab === 'orders' && (
                <Orders
                  orders={state.activeOrders}
                  craftedDrinks={state.craftedDrinks}
                  onFulfill={fulfillOrder}
                  onNotify={notify}
                />
              )}
            </div>
          </>
        )}

        {navTab === 'recipe' && (
          <div className={styles.content}>
            <RecipeBook
              unlockedRecipes={state.unlockedRecipes}
              recipeProgress={state.recipeProgress}
              playerLevel={state.player.level}
            />
          </div>
        )}

        {navTab === 'shop' && (
          <div className={styles.content}>
            <div className={styles.placeholder}>
              <div>🛍️</div>
              <div>商店即将开放</div>
              <div>（后续版本）</div>
            </div>
          </div>
        )}

        {navTab === 'collection' && (
          <div className={styles.content}>
            <div className={styles.statsCard}>
              <div className={styles.statsTitle}>🏆 我的成就</div>
              <div className={styles.statRow}><span>完成订单</span><span>{state.ordersCompleted}</span></div>
              <div className={styles.statRow}><span>总收入</span><span>🪙{state.goldEarned}</span></div>
              <div className={styles.statRow}><span>解锁配方</span><span>{state.unlockedRecipes.length}/8</span></div>
              <div className={styles.statRow}><span>等级</span><span>Lv.{state.player.level}</span></div>
            </div>
          </div>
        )}

        {navTab === 'settings' && (
          <div className={styles.content}>
            <div className={styles.settingsCard}>
              <div className={styles.statsTitle}>⚙️ 设置</div>
              <button
                className={styles.dangerBtn}
                onClick={() => {
                  if (confirm('确定要重置存档吗？这将清除所有游戏进度！')) {
                    localStorage.clear()
                    window.location.reload()
                  }
                }}
              >
                重置存档
              </button>
            </div>
          </div>
        )}
      </main>

      <Navigation active={navTab} onChange={setNavTab} />

      {showDailyBonus && <DailyBonus onClaim={handleClaimBonus} />}
      <Toast notification={notification} onDismiss={dismissNotification} />
    </div>
  )
}
