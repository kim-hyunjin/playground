import type { GameSituation, PlayLog, Team } from '../types/game'
import { findPlayerInLeague } from '../engine/playerLookup'
import { PlayerNameButton } from './PlayerNameButton'

interface Props {
  situation?: GameSituation
  teams: Team[]
  currentLog?: PlayLog
  balls?: number
  strikes?: number
  userSide?: 'offense' | 'defense'
}

export function GameSituationPanel({ situation, teams, currentLog, balls = 0, strikes = 0, userSide }: Props) {
  if (!situation) {
    return <div className="bm-card p-4 text-sm text-[var(--text-muted)]">저장된 경기 상황 정보가 없습니다.</div>
  }

  const playerName = (id?: string) => id ? findPlayerInLeague(teams, id)?.player.name ?? id : '없음'
  const playerButton = (id?: string) => id
    ? <PlayerNameButton playerId={id} name={playerName(id)} className="font-semibold" />
    : <span className="text-[var(--text-muted)]">없음</span>
  const ballCount = Math.max(0, Math.min(3, Math.trunc(balls)))
  const strikeCount = Math.max(0, Math.min(2, Math.trunc(strikes)))

  return (
    <section className="bm-card space-y-4 p-4" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-[var(--text-h)]">현재 경기 상황</h2>
            {userSide ? (
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                  userSide === 'offense'
                    ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]'
                    : 'border-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] text-[var(--warning)]'
                }`}
              >
                {userSide === 'offense' ? '공격 중' : '수비 중'}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {situation.inning}회 {situation.half === 'top' ? '초' : '말'} · {situation.outs}아웃
          </p>
        </div>
        <div className="text-right text-sm tabular-nums">
          <div>원정 {situation.awayScore}</div>
          <div>홈 {situation.homeScore}</div>
        </div>
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-3">
        {([
          ['1루', situation.runners.firstId],
          ['2루', situation.runners.secondId],
          ['3루', situation.runners.thirdId],
        ] as const).map(([base, id]) => (
          <div key={base} className={`rounded border px-3 py-2 ${id ? 'border-amber-500/50 bg-amber-500/10' : 'border-[var(--border)] bg-[var(--panel-2)]'}`}>
            <span className="text-xs text-[var(--text-muted)]">{base}</span>
            <div>{playerButton(id)}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded bg-[var(--panel-2)] px-3 py-2"><span className="text-[var(--text-muted)]">타자</span> {playerButton(situation.batterId)}</div>
        <div className="rounded bg-[var(--panel-2)] px-3 py-2"><span className="text-[var(--text-muted)]">투수</span> {playerButton(situation.pitcherId)}</div>
        <div className="flex min-w-0 items-center justify-around gap-1 rounded bg-[var(--panel-2)] px-1.5 py-2" aria-label={`볼 카운트 ${ballCount}볼 ${strikeCount}스트라이크 ${situation.outs}아웃`}>
          <CountLights label="B" count={ballCount} max={3} color="success" />
          <CountLights label="S" count={strikeCount} max={2} color="warning" />
          <CountLights label="O" count={Math.min(situation.outs, 2)} max={2} color="danger" />
        </div>
      </div>

      {currentLog ? <p className="border-t border-[var(--border)] pt-3 text-sm"><span className="text-[var(--text-muted)]">직전 결과 · </span><b className="text-[var(--text-h)]">{currentLog.text}</b></p> : null}
    </section>
  )
}

function CountLights({ label, count, max, color }: { label: string; count: number; max: number; color: 'success' | 'warning' | 'danger' }) {
  const activeClass = color === 'success'
    ? 'border-[var(--success)] bg-[var(--success)] shadow-[0_0_6px_var(--success)]'
    : color === 'warning'
      ? 'border-yellow-400 bg-yellow-400 shadow-[0_0_6px_#facc15]'
      : 'border-[var(--danger)] bg-[var(--danger)] shadow-[0_0_6px_var(--danger)]'
  return (
    <span className="flex shrink-0 items-center gap-0.5" aria-hidden="true">
      <b className="text-[10px] text-[var(--text-muted)]">{label}</b>
      {Array.from({ length: max }, (_, index) => (
        <span key={index} className={`h-2 w-2 rounded-full border ${index < count ? activeClass : 'border-[var(--border)] bg-[var(--panel)]'}`} />
      ))}
    </span>
  )
}
