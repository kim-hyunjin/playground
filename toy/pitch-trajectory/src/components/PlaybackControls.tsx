const PRESETS = [0.25, 0.5, 1, 2] as const

export interface PlaybackControlsProps {
  speedMultiplier: number
  selectedCount: number
  onReset: () => void
  onSpeedChange: (value: number) => void
}

export default function PlaybackControls({
  speedMultiplier,
  selectedCount,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  const disabled = selectedCount === 0

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-[var(--text-h)]">재생 설정</h2>
        <button
          type="button"
          className="pt-btn pt-btn-secondary"
          disabled={disabled}
          onClick={onReset}
        >
          리셋
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <label htmlFor="speed-slider">재생 속도</label>
          <span className="font-medium text-[var(--text-h)]">
            {speedMultiplier}×
            {speedMultiplier === 1 ? ' (실제 속도)' : ''}
          </span>
        </div>
        <input
          id="speed-slider"
          type="range"
          min={0.25}
          max={2}
          step={0.25}
          value={speedMultiplier}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`pt-chip ${speedMultiplier === preset ? 'pt-chip-active' : ''}`}
              onClick={() => onSpeedChange(preset)}
            >
              {preset}×{preset === 1 ? ' 실제' : preset === 0.25 ? ' 슬로모' : ''}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          재생/일시정지는 우측 하단 버튼을 사용하세요. 1×는 실제 mph 기준 (95mph ≈
          0.40초, 릴리스→플레이트 55ft).
        </p>
      </div>
    </div>
  )
}
