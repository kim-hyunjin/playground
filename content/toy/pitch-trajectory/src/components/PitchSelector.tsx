import type { PitchDefinition } from '../data/pitches.ts'

export interface PitchSelectorProps {
  pitches: PitchDefinition[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export default function PitchSelector({
  pitches,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
}: PitchSelectorProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-[var(--text-h)]">구종 선택</h2>
        <div className="flex gap-2 text-sm">
          <button type="button" className="pt-link" onClick={onSelectAll}>
            전체
          </button>
          <button type="button" className="pt-link" onClick={onClearAll}>
            해제
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {pitches.map((pitch) => {
          const selected = selectedIds.has(pitch.id)
          return (
            <label
              key={pitch.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                selected
                  ? 'border-[var(--accent-border)] bg-[var(--accent-bg)]'
                  : 'border-transparent hover:bg-[var(--hover)]'
              }`}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle(pitch.id)}
                className="accent-[var(--accent)]"
              />
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: pitch.color }}
              />
              <span className="flex-1 text-[var(--text-h)]">{pitch.name}</span>
              <span className="text-xs text-[var(--text-muted)]">
                {pitch.params.speedMph} mph
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
