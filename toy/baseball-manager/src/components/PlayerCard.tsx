import { formatSalary, isPitcher, overallRating } from '../engine/generator'
import type { Player } from '../types/game'
import { POSITION_LABEL } from '../types/game'

export function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="font-semibold text-[var(--text-h)]">{value}</span>
      </div>
      <div className="bm-stat-bar">
        <div className="bm-stat-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function OvrBadge({ player }: { player: Player }) {
  const ovr = overallRating(player)
  const color =
    ovr >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
    ovr >= 65 ? 'bg-sky-500/20 text-sky-400' :
    'bg-slate-500/20 text-slate-400'

  return <span className={`bm-badge ${color}`}>{ovr}</span>
}

export function PlayerCard({
  player,
  onClick,
  interactive = true,
}: {
  player: Player
  onClick?: () => void
  interactive?: boolean
}) {
  const className = `bm-card w-full p-4 text-left transition ${interactive ? 'hover:border-emerald-500/40' : ''}`

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-[var(--text-h)]">{player.name}</div>
          <div className="text-xs text-[var(--text-muted)]">
            {POSITION_LABEL[player.role]} · {player.age}세 · {formatSalary(player.salary)}
          </div>
        </div>
        <OvrBadge player={player} />
      </div>
      {isPitcher(player) ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <StatBar label="구속" value={player.velocity} />
          <StatBar label="제구" value={player.control} />
          <StatBar label="구위" value={player.movement} />
          <StatBar label="체력" value={player.stamina} />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <StatBar label="contact" value={player.contact} />
          <StatBar label="파워" value={player.power} />
          <StatBar label="선구" value={player.eye} />
          <StatBar label="주루" value={player.speed} />
        </div>
      )}
    </>
  )

  if (!interactive) {
    return <div className={className}>{content}</div>
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}

export function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-[var(--text-h)]">{value}</div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  )
}
