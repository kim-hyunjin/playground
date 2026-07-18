import type { GameSituation, PlayLog, Team } from '../types/game'
import { findPlayerInLeague } from '../engine/playerLookup'

interface Props {
  situation?: GameSituation
  teams: Team[]
  currentLog?: PlayLog
  animationsEnabled?: boolean
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

export function GameSituationPanel({ situation, teams, currentLog, animationsEnabled = true }: Props) {
  if (!situation) {
    return (
      <div className="bm-card p-4 text-center text-sm text-[var(--text-muted)]">
        이전 버전에서 저장된 경기라 주자·아웃 정보가 없습니다.
      </div>
    )
  }

  const runnerName = (id?: string) => id ? findPlayerInLeague(teams, id)?.player.name ?? id : '-'
  const visual = currentLog?.visual
  const radians = visual ? (visual.ballAngle - 90) * Math.PI / 180 : 0
  const ballX = visual ? 50 + Math.cos(radians) * visual.distance * 0.42 : 50
  const ballY = visual ? 88 + Math.sin(radians) * visual.distance * 0.7 : 88

  return (
    <div className="bm-card grid gap-4 p-4 sm:grid-cols-[260px_1fr] sm:items-center" aria-live="polite">
      <div className="relative mx-auto h-52 w-64 overflow-hidden rounded-t-[48%] border border-emerald-900 bg-emerald-950/60" aria-label="경기장과 주자 상황">
        <div className="absolute bottom-[-54px] left-[52px] h-40 w-40 rotate-45 border border-amber-800/60 bg-amber-950/50" />
        {['LF', 'CF', 'RF', 'SS', '2B', '3B', '1B'].map((position, index) => (
          <span key={position} className="absolute z-10 text-[9px] text-emerald-300/70" style={{ left: `${[18, 47, 78, 34, 61, 20, 79][index]}%`, top: `${[25, 14, 25, 55, 55, 67, 67][index]}%` }}>{position}</span>
        ))}
        {visual ? <span
          key={`${currentLog?.inning}-${currentLog?.half}-${currentLog?.batterId}-${currentLog?.text}`}
          className={`absolute z-20 h-3 w-3 rounded-full bg-white shadow-[0_0_8px_white] ${animationsEnabled ? 'bm-ball-flight' : ''}`}
          style={{ left: `${ballX}%`, top: `${Math.max(5, ballY)}%`, '--ball-start-x': '50%', '--ball-start-y': '88%' } as React.CSSProperties}
          aria-label={`${visual.trajectory} 타구, 거리 지수 ${Math.round(visual.distance)}`}
        /> : null}
        <div className="absolute bottom-10 left-[112px] z-20"><Base occupied={Boolean(situation.runners.secondId)} label="2루" className="bottom-[82px] left-0" /></div>
        <Base occupied={Boolean(situation.runners.thirdId)} label="3루" className="bottom-[50px] left-[72px]" />
        <Base occupied={Boolean(situation.runners.firstId)} label="1루" className="bottom-[50px] right-[72px]" />
        <div className="absolute bottom-3 left-[120px] z-20 h-5 w-5 rotate-45 border-2 border-white bg-white/20" aria-label="홈" />
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
        {currentLog ? <div className={`rounded px-3 py-2 text-center font-semibold ${currentLog.runsScored > 0 ? 'bg-amber-400/20 text-amber-300' : 'bg-[var(--panel-2)] text-[var(--text-h)]'} ${animationsEnabled ? 'bm-play-result' : ''}`}>{currentLog.text}</div> : null}
      </div>
    </div>
  )
}
