import { useGame } from '../store/gameStore'
import { DEFAULT_MANAGER_COMMAND, type OffensiveCommand, type PitchingCommand } from '../types/game'

const OFFENSE: Array<[OffensiveCommand, string]> = [
  ['normal', '일반'], ['bunt', '번트'], ['steal', '도루'], ['aggressive', '적극 타격'], ['patient', '신중 타격'],
]
const PITCHING: Array<[PitchingCommand, string]> = [
  ['normal', '일반'], ['intentionalWalk', '고의사구'], ['challenge', '정면 승부'], ['nibble', '유인구'],
]

export function ManagerTacticsPanel() {
  const { state, setManagerCommand } = useGame()
  if (!state) return null
  const command = state.managerCommand ?? DEFAULT_MANAGER_COMMAND
  return (
    <div className="bm-card space-y-3 p-4">
      <div>
        <h2 className="font-semibold text-[var(--text-h)]">경기 작전</h2>
        <p className="text-xs text-[var(--text-muted)]">다음 경기의 모든 유효 상황에 적용됩니다.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-16 text-xs font-semibold">공격</span>
        {OFFENSE.map(([value, label]) => <button key={value} type="button" className={`bm-btn py-1 text-xs ${command.offense === value ? 'bm-btn-primary' : 'bm-btn-ghost'}`} onClick={() => setManagerCommand({ ...command, offense: value })}>{label}</button>)}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-16 text-xs font-semibold">투구</span>
        {PITCHING.map(([value, label]) => <button key={value} type="button" className={`bm-btn py-1 text-xs ${command.pitching === value ? 'bm-btn-primary' : 'bm-btn-ghost'}`} onClick={() => setManagerCommand({ ...command, pitching: value })}>{label}</button>)}
      </div>
    </div>
  )
}
