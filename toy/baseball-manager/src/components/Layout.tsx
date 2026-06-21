import { useGame } from '../store/gameStore'
import type { View } from '../types/game'
import { PlayerDetailModal } from './PlayerDetailModal'

const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'dashboard', label: '대시보드', icon: '📊' },
  { id: 'squad', label: '1군', icon: '👥' },
  { id: 'farm', label: '2군', icon: '🌱' },
  { id: 'stats', label: '스탯', icon: '📈' },
  { id: 'lineup', label: '라인업', icon: '📋' },
  { id: 'rotation', label: '로테이션', icon: '⚾' },
  { id: 'match', label: '경기', icon: '🏟️' },
  { id: 'standings', label: '순위', icon: '🏆' },
  { id: 'transfers', label: '이적시장', icon: '💰' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { view, setView, userTeam, state, resetGame } = useGame()

  if (!state || !userTeam) return null

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--panel)] p-4">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Baseball Manager
          </div>
          <div className="mt-1 text-lg font-bold" style={{ color: userTeam.color }}>
            {userTeam.city} {userTeam.name}
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            {state.managerName} 감독 · {state.currentWeek}/{state.totalWeeks}주차
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`bm-nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" className="bm-btn bm-btn-ghost mt-4 w-full text-xs" onClick={resetGame}>
          새 게임
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-6">{children}</main>
      <PlayerDetailModal />
    </div>
  )
}
