import { overallRating } from '../engine/generator'
import { isPlayerAvailable } from '../engine/injury'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { useGame } from '../store/gameStore'
import { DEFAULT_BULLPEN_STRATEGY } from '../types/game'

export function RotationPage() {
  const { userTeam, state, swapRotation, setBullpenStrategy } = useGame()
  if (!userTeam || !state) return null

  const starters = state.rotation
    .map((id) => userTeam.players.find((p) => p.id === id))
    .filter(Boolean)
  const strategy = state.bullpenStrategy ?? DEFAULT_BULLPEN_STRATEGY

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">선발 로테이션</h1>
        <p className="text-sm text-[var(--text-muted)]">
          다음 경기 선발:{' '}
          {starters[state.rotationIndex % starters.length] ? (
            <PlayerNameButton
              playerId={starters[state.rotationIndex % starters.length]!.id}
              name={starters[state.rotationIndex % starters.length]!.name}
            />
          ) : (
            '-'
          )}
        </p>
      </div>

      <div className="space-y-2">
        {starters.map((p, i) => (
          <div
            key={p!.id}
            className={`bm-card flex items-center gap-4 p-4 ${!isPlayerAvailable(p!) ? 'opacity-60' : ''}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--panel-2)] text-lg font-bold text-[var(--accent)]">
              {i + 1}
            </div>
            <div className="flex-1">
              <PlayerNameButton playerId={p!.id} name={p!.name} className="text-base font-semibold" />
              <div className="text-xs text-[var(--text-muted)]">
                구속 {p!.velocity} · 제구 {p!.control} · 구위 {p!.movement} · OVR {overallRating(p!)}
                {!isPlayerAvailable(p!) && p!.injuryType ? (
                  <span className="ml-2 text-[var(--danger)]">부상 ({p!.injuryType}, {p!.injuryDays}일)</span>
                ) : null}
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

      <section className="bm-card space-y-4 p-4">
        <div>
          <h2 className="font-semibold text-[var(--text-h)]">자동 불펜 운용</h2>
          <p className="text-xs text-[var(--text-muted)]">사용자 경기와 자동 진행에 적용되는 기본 교체 조건입니다.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm">선발 투구 한계
            <input className="bm-input mt-1" type="number" min="60" max="120" value={strategy.starterPitchLimit} onChange={(e) => setBullpenStrategy({ ...strategy, starterPitchLimit: Number(e.target.value) })} />
          </label>
          <label className="text-sm">셋업 등판 이닝
            <input className="bm-input mt-1" type="number" min="6" max="9" value={strategy.setupInning} onChange={(e) => setBullpenStrategy({ ...strategy, setupInning: Number(e.target.value) })} />
          </label>
          <label className="text-sm">마무리 등판 이닝
            <input className="bm-input mt-1" type="number" min="7" max="9" value={strategy.closerInning} onChange={(e) => setBullpenStrategy({ ...strategy, closerInning: Number(e.target.value) })} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={strategy.useLeftyMatchups} onChange={(e) => setBullpenStrategy({ ...strategy, useLeftyMatchups: e.target.checked })} />
          좌타자 상대 좌완 매치업 우선
        </label>
      </section>
    </div>
  )
}
