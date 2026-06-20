import { isBatter } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { useGame } from '../store/gameStore'
import { FIELD_POSITIONS, POSITION_LABEL, type FieldPosition } from '../types/game'

const POS_LABEL: Record<FieldPosition, string> = {
  C: '1번·포수', '1B': '2번·1루', '2B': '3번·2루', '3B': '4번·3루',
  SS: '5번·유격', LF: '6번·좌익', CF: '7번·중견', RF: '8번·우익', DH: '9번·지명',
}

export function LineupPage() {
  const { userTeam, state, setLineup } = useGame()
  if (!userTeam || !state) return null

  const batters = userTeam.players.filter(isBatter)

  const handleChange = (pos: FieldPosition, playerId: string) => {
    setLineup({ ...state.lineup, [pos]: playerId })
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">라인업</h1>
        <p className="text-sm text-[var(--text-muted)]">타순과 포지션을 배치하세요. 경기 시뮬에 반영됩니다.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {FIELD_POSITIONS.map((pos) => {
          const playerId = state.lineup[pos]
          const player = userTeam.players.find((p) => p.id === playerId)
          return (
            <div key={pos} className="bm-card p-4">
              <div className="mb-2 text-xs font-semibold text-[var(--accent)]">{POS_LABEL[pos]}</div>
              <select
                className="bm-input"
                value={playerId}
                onChange={(e) => handleChange(pos, e.target.value)}
              >
                {batters.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({POSITION_LABEL[p.role]})
                  </option>
                ))}
              </select>
              {player && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <PlayerNameButton playerId={player.id} name={player.name} className="text-sm" />
                  <OvrBadge player={player} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bm-card p-4">
        <h2 className="mb-3 font-semibold text-[var(--text-h)]">현재 타순 미리보기</h2>
        <ol className="space-y-1">
          {FIELD_POSITIONS.map((pos, i) => {
            const p = userTeam.players.find((pl) => pl.id === state.lineup[pos])
            return (
              <li key={pos} className="flex items-center gap-3 text-sm">
                <span className="w-6 text-[var(--text-muted)]">{i + 1}</span>
                <PlayerNameButton playerId={p!.id} name={p?.name ?? '-'} />
                <span className="text-[var(--text-muted)]">{pos}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
