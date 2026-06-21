import type { Player } from '../types/game'

export function CallUpBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/15 font-medium text-amber-400 ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      콜업 후보
    </span>
  )
}

export function RosterLevelBadge({
  level,
  compact = false,
}: {
  level: 'first' | 'farm'
  compact?: boolean
}) {
  const label = level === 'first' ? '1군' : '2군'
  const colors =
    level === 'first'
      ? 'border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--accent)]'
      : 'border-[var(--border)] bg-[var(--panel)] text-[var(--text-muted)]'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colors} ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {label}
    </span>
  )
}

export function InjuryBadge({
  player,
  compact = false,
}: {
  player: Pick<Player, 'injuryDays' | 'injuryType'>
  compact?: boolean
}) {
  if (!player.injuryDays || player.injuryDays <= 0) return null
  return (
    <span
      className={`inline-flex items-center rounded-full border border-red-500/40 bg-red-500/15 font-medium text-red-300 ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
      title={player.injuryType ?? '부상'}
    >
      부상 {player.injuryDays}일
    </span>
  )
}

export function ContractBadge({
  years,
  compact = false,
}: {
  years?: number
  compact?: boolean
}) {
  const y = years ?? 1
  if (y <= 0) {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-orange-500/40 bg-orange-500/15 font-medium text-orange-300 ${
          compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
        }`}
      >
        FA 임박
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--panel)] font-medium text-[var(--text-muted)] ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {y}년
    </span>
  )
}

export function PlayerMetaBadges({
  player,
  showCallUp = false,
  compact = false,
}: {
  player: Player
  showCallUp?: boolean
  compact?: boolean
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <RosterLevelBadge level={player.rosterLevel} compact={compact} />
      <InjuryBadge player={player} compact={compact} />
      <ContractBadge years={player.contractYears} compact={compact} />
      {showCallUp ? <CallUpBadge compact={compact} /> : null}
    </span>
  )
}
