import { developmentProgress, growthRoom, hasGrowthRoom } from '../engine/playerDevelopment'
import { overallRating } from '../engine/generator'
import type { Player } from '../types/game'

export function DevelopmentPanel({ player }: { player: Player }) {
  const prog = developmentProgress(player)
  const canGrow = hasGrowthRoom(player) && player.age <= 28

  return (
    <div className="bm-card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-h)]">육성</h3>
        <span className="text-xs text-[var(--text-muted)]">{prog.phase}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div>
          <div className="font-bold text-[var(--text-h)]">{prog.ovr}</div>
          <div className="text-[var(--text-muted)]">현재 OVR</div>
        </div>
        <div>
          <div className="font-bold text-[var(--success)]">{prog.potential}</div>
          <div className="text-[var(--text-muted)]">잠재력</div>
        </div>
        <div>
          <div className="font-bold text-sky-400">+{prog.room}</div>
          <div className="text-[var(--text-muted)]">성장 여지</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-muted)]">육성 XP</span>
          <span className="text-[var(--text-h)]">
            {prog.xp.toLocaleString()} ({prog.xpToNextTick} XP 후 성장 가속)
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-sky-500 transition-all"
            style={{ width: `${prog.progressPct}%` }}
          />
        </div>
      </div>

      {!canGrow && (
        <p className="text-xs text-[var(--text-muted)]">
          {player.age > 28
            ? '29세 이상 — 능력치 성장이 거의 멈춥니다.'
            : '잠재력에 도달했습니다.'}
        </p>
      )}

      {canGrow && player.rosterLevel === 'farm' && (
        <p className="text-xs text-[var(--text-muted)]">
          2군 출전·코치 육성으로 XP와 능력치가 빠르게 오릅니다.
        </p>
      )}
    </div>
  )
}

export function PotentialBadge({ player, compact = false }: { player: Player; compact?: boolean }) {
  const room = growthRoom(player)
  if (room < 3 || player.age > 28) return null

  const ovr = overallRating(player)
  return (
    <span
      className={`inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 font-medium text-[var(--success)] ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
      title={`잠재력 ${player.potential} (현재 ${ovr})`}
    >
      POT {player.potential}
    </span>
  )
}
