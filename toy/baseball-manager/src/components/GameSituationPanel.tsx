import type { GameSituation, Team } from '../types/game'
import { findPlayerInLeague } from '../engine/playerLookup'

interface Props {
  situation?: GameSituation
  teams: Team[]
}

function Base({ occupied, label, className }: { occupied: boolean; label: string; className: string }) {
  return (
    <div
      aria-label={`${label} ${occupied ? '주자 있음' : '비어 있음'}`}
      className={`absolute h-7 w-7 rotate-45 border-2 ${className} ${
        occupied ? 'border-amber-300 bg-amber-300' : 'border-slate-500 bg-slate-800'
      }`}
    />
  )
}

export function GameSituationPanel({ situation, teams }: Props) {
  if (!situation) {
    return (
      <div className="bm-card p-4 text-center text-sm text-[var(--text-muted)]">
        이전 버전에서 저장된 경기라 주자·아웃 정보가 없습니다.
      </div>
    )
  }

  const runnerName = (id?: string) => id ? findPlayerInLeague(teams, id)?.player.name ?? id : '-'

  return (
    <div className="bm-card grid gap-4 p-4 sm:grid-cols-[160px_1fr] sm:items-center">
      <div className="relative mx-auto h-32 w-40" aria-label="주자 상황">
        <Base occupied={Boolean(situation.runners.secondId)} label="2루" className="left-[66px] top-2" />
        <Base occupied={Boolean(situation.runners.thirdId)} label="3루" className="left-[28px] top-[50px]" />
        <Base occupied={Boolean(situation.runners.firstId)} label="1루" className="right-[28px] top-[50px]" />
        <div className="absolute bottom-1 left-[72px] h-5 w-5 rotate-45 border-2 border-white bg-white/20" aria-label="홈" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <strong className="text-[var(--text-h)]">
            {situation.inning}회 {situation.half === 'top' ? '초' : '말'}
          </strong>
          <div className="flex items-center gap-1" aria-label={`${situation.outs}아웃`}>
            <span className="mr-1 text-xs font-semibold text-[var(--text-muted)]">OUT</span>
            {[0, 1, 2].map((out) => (
              <span key={out} className={`h-3 w-3 rounded-full ${out < situation.outs ? 'bg-red-500' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-[var(--text-muted)]">
          <span>1루 <b className="text-[var(--text)]">{runnerName(situation.runners.firstId)}</b></span>
          <span>2루 <b className="text-[var(--text)]">{runnerName(situation.runners.secondId)}</b></span>
          <span>3루 <b className="text-[var(--text)]">{runnerName(situation.runners.thirdId)}</b></span>
        </div>
      </div>
    </div>
  )
}
