import type { PitchDefinition } from '../data/pitches.ts'
import { flightTimeMs, formatFlightTime } from '../lib/flightTime.ts'

export interface PitchLegendProps {
  pitches: PitchDefinition[]
  progressByPitchId: Record<string, number>
  highlightedId: string | null
  onHighlight: (id: string | null) => void
}

export default function PitchLegend({
  pitches,
  progressByPitchId,
  highlightedId,
  onHighlight,
}: PitchLegendProps) {
  if (pitches.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {pitches.map((pitch) => {
        const progress = progressByPitchId[pitch.id] ?? 0
        const dimmed = highlightedId !== null && highlightedId !== pitch.id
        const flightMs = flightTimeMs(pitch.params.speedMph, 1)

        return (
          <button
            key={pitch.id}
            type="button"
            className={`pt-legend-item ${dimmed ? 'opacity-40' : ''}`}
            onMouseEnter={() => onHighlight(pitch.id)}
            onMouseLeave={() => onHighlight(null)}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: pitch.color }}
            />
            <span>{pitch.name}</span>
            <span className="text-[var(--text-muted)]">
              {pitch.params.speedMph}mph · {formatFlightTime(flightMs)}
              {progress > 0 && progress < 1
                ? ` · ${Math.round(progress * 100)}%`
                : progress >= 1
                  ? ' · 도착'
                  : ''}
            </span>
          </button>
        )
      })}
    </div>
  )
}
