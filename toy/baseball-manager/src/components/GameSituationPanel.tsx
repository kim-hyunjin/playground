import type { GameSituation, PlayLog, Team } from '../types/game'
import { findPlayerInLeague } from '../engine/playerLookup'

interface Props {
  situation?: GameSituation
  teams: Team[]
  currentLog?: PlayLog
}

export function GameSituationPanel({ situation, teams, currentLog }: Props) {
  if (!situation) {
    return <div className="bm-card p-4 text-sm text-[var(--text-muted)]">저장된 경기 상황 정보가 없습니다.</div>
  }

  const playerName = (id?: string) => id ? findPlayerInLeague(teams, id)?.player.name ?? id : '없음'
  const batter = playerName(situation.batterId)
  const pitcher = playerName(situation.pitcherId)

  return (
    <section className="bm-card space-y-4 p-4" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[var(--text-h)]">현재 경기 상황</h2>
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
            <div className={id ? 'font-semibold text-amber-300' : 'text-[var(--text-muted)]'}>{playerName(id)}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded bg-[var(--panel-2)] px-3 py-2"><span className="text-[var(--text-muted)]">타자</span> <b className="text-[var(--text-h)]">{batter}</b></div>
        <div className="rounded bg-[var(--panel-2)] px-3 py-2"><span className="text-[var(--text-muted)]">투수</span> <b className="text-[var(--text-h)]">{pitcher}</b></div>
      </div>

      {currentLog ? <p className="border-t border-[var(--border)] pt-3 text-sm"><span className="text-[var(--text-muted)]">직전 결과 · </span><b className="text-[var(--text-h)]">{currentLog.text}</b></p> : null}
    </section>
  )
}
