import { overallRating } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { useGame } from '../store/gameStore'

export function RotationPage() {
  const { userTeam, state, swapRotation } = useGame()
  if (!userTeam || !state) return null

  const starters = state.rotation
    .map((id) => userTeam.players.find((p) => p.id === id))
    .filter(Boolean)

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">선발 로테이션</h1>
        <p className="text-sm text-[var(--text-muted)]">
          다음 경기 선발: {starters[state.rotationIndex % starters.length]?.name ?? '-'}
        </p>
      </div>

      <div className="space-y-2">
        {starters.map((p, i) => (
          <div key={p!.id} className="bm-card flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--panel-2)] text-lg font-bold text-[var(--accent)]">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[var(--text-h)]">{p!.name}</div>
              <div className="text-xs text-[var(--text-muted)]">
                구속 {p!.velocity} · 제구 {p!.control} · 구위 {p!.movement} · OVR {overallRating(p!)}
              </div>
            </div>
            <OvrBadge player={p!} />
            <div className="flex flex-col gap-1">
              <button
                type="button"
                className="bm-btn bm-btn-ghost px-2 py-1 text-xs"
                disabled={i === 0}
                onClick={() => swapRotation(i, i - 1)}
              >
                ▲
              </button>
              <button
                type="button"
                className="bm-btn bm-btn-ghost px-2 py-1 text-xs"
                disabled={i === starters.length - 1}
                onClick={() => swapRotation(i, i + 1)}
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        ▲▼ 버튼으로 로테이션 순서를 변경할 수 있습니다. 경기마다 다음 선발이 자동으로 선택됩니다.
      </p>
    </div>
  )
}
