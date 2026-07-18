import { useGame } from '../store/gameStore'
import { DEFAULT_MANAGER_COMMAND, type OffensiveCommand, type PitchingCommand } from '../types/game'
import { useState } from 'react'

const OFFENSE: Array<[OffensiveCommand, string]> = [
  ['normal', '일반'], ['bunt', '번트'], ['steal', '도루'], ['aggressive', '적극 타격'], ['patient', '신중 타격'],
]
const PITCHING: Array<[PitchingCommand, string]> = [
  ['normal', '일반'], ['intentionalWalk', '고의사구'], ['challenge', '정면 승부'], ['nibble', '유인구'],
]

export function ManagerTacticsPanel() {
  const { state, activeGameSession, setManagerCommand, applyCurrentGameCommand } = useGame()
  const [message, setMessage] = useState('')
  if (!state) return null
  const active = activeGameSession && activeGameSession.status !== 'complete'
  const command = activeGameSession?.commandChanges?.at(-1)?.command ?? state.managerCommand ?? DEFAULT_MANAGER_COMMAND
  const latestSituation = activeGameSession?.resolvedResult.logs[activeGameSession.cursor]?.situationBefore
    ?? activeGameSession?.resolvedResult.logs[Math.max(0, activeGameSession.cursor - 1)]?.situationAfter
    ?? activeGameSession?.resolvedResult.logs[0]?.situationBefore
  const userBatting = active && latestSituation
    ? (latestSituation.half === 'top' ? activeGameSession.resolvedResult.awayId : activeGameSession.resolvedResult.homeId) === state.userTeamId
    : true
  const select = (next: typeof command) => {
    setManagerCommand(next)
    if (active) {
      setMessage(applyCurrentGameCommand(next))
    }
  }
  return (
    <div className="bm-card space-y-2 p-3">
      <div>
        <h2 className="font-semibold text-[var(--text-h)]">경기 작전</h2>
        <p className="text-xs text-[var(--text-muted)]">{active ? '선택 즉시 다음 미진행 타석부터 적용됩니다.' : '경기 시작 시 적용할 기본 작전입니다.'}</p>
      </div>
      {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
      {(!active || userBatting) ? <div>
        <span className="mb-1.5 block text-xs font-semibold">공격</span>
        <div className="grid grid-cols-2 gap-2">
          {OFFENSE.map(([value, label]) => <button key={value} type="button" className={`bm-btn w-full justify-center py-1.5 text-xs ${command.offense === value ? 'bm-btn-primary' : 'bm-btn-ghost'}`} onClick={() => select({ ...command, offense: value })}>{label}</button>)}
        </div>
      </div> : null}
      {(!active || !userBatting) ? <div>
        <span className="mb-1.5 block text-xs font-semibold">투구</span>
        <div className="grid grid-cols-2 gap-2">
          {PITCHING.map(([value, label]) => <button key={value} type="button" className={`bm-btn w-full justify-center py-1.5 text-xs ${command.pitching === value ? 'bm-btn-primary' : 'bm-btn-ghost'}`} onClick={() => select({ ...command, pitching: value })}>{label}</button>)}
        </div>
      </div> : null}
    </div>
  )
}
