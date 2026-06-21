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
