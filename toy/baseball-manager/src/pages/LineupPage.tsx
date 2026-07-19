import { useEffect, useState } from 'react'
import { firstTeamPlayers } from '../engine/roster'
import { availableBatters, formatHandedness } from '../engine/rosterAvailability'
import { overallRating } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { SortableHeader, sortRows, useTableSort } from '../components/SortableTable'
import { useGame } from '../store/gameStore'
import { FIELD_POSITIONS, POSITION_LABEL, type FieldPosition, type Player } from '../types/game'

const POS_LABEL: Record<FieldPosition, string> = {
  C: '1번·포수', '1B': '2번·1루', '2B': '3번·2루', '3B': '4번·3루',
  SS: '5번·유격', LF: '6번·좌익', CF: '7번·중견', RF: '8번·우익', DH: '9번·지명',
}

export function LineupPage() {
  const { userTeam, state, setLineup } = useGame()
  const [selectingPosition, setSelectingPosition] = useState<FieldPosition | null>(null)
  if (!userTeam || !state) return null

  const batters = availableBatters(firstTeamPlayers(userTeam))

  const handleChange = (pos: FieldPosition, playerId: string) => {
    const next = { ...state.lineup }
    const currentPlayerId = next[pos]
    const occupiedPosition = FIELD_POSITIONS.find(
      (otherPosition) => otherPosition !== pos && next[otherPosition] === playerId,
    )
    next[pos] = playerId
    if (occupiedPosition) next[occupiedPosition] = currentPlayerId
    setLineup(next)
    setSelectingPosition(null)
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">라인업</h1>
        <p className="text-sm text-[var(--text-muted)]">
          타순과 포지션을 배치하세요. 부상 선수는 자동으로 제외됩니다.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {FIELD_POSITIONS.map((pos) => {
          const playerId = state.lineup[pos]
          const player = userTeam.players.find((p) => p.id === playerId)
          return (
            <div key={pos} className="bm-card p-4">
              <div className="mb-2 text-xs font-semibold text-[var(--accent)]">{POS_LABEL[pos]}</div>
              <button
                type="button"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-left transition hover:border-[var(--accent)]"
                onClick={() => setSelectingPosition(pos)}
                aria-label={`${POS_LABEL[pos]} 타자 선택`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[var(--text-h)]">{player?.name ?? '타자 선택'}</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {player ? `${POSITION_LABEL[player.role]} · ${formatHandedness(player)}` : '클릭해서 후보 보기'}
                    </div>
                  </div>
                  {player ? <OvrBadge player={player} /> : null}
                </div>
                <div className="mt-2 text-right text-xs font-semibold text-[var(--accent)]">타자 변경</div>
              </button>
            </div>
          )
        })}
      </div>

      <div className="bm-card p-4">
        <h2 className="mb-3 font-semibold text-[var(--text-h)]">현재 타순 미리보기</h2>
        <ol className="space-y-1">
          {FIELD_POSITIONS.map((pos, i) => {
            const p = firstTeamPlayers(userTeam).find((pl) => pl.id === state.lineup[pos])
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

      {selectingPosition ? (
        <LineupBatterModal
          position={selectingPosition}
          batters={batters}
          lineup={state.lineup}
          onSelect={(playerId) => handleChange(selectingPosition, playerId)}
          onClose={() => setSelectingPosition(null)}
        />
      ) : null}
    </div>
  )
}

type BatterSortKey = 'name' | 'position' | 'hand' | 'ovr' | 'contact' | 'power' | 'eye' | 'speed' | 'fielding'

function LineupBatterModal({
  position,
  batters,
  lineup,
  onSelect,
  onClose,
}: {
  position: FieldPosition
  batters: Player[]
  lineup: Record<FieldPosition, string>
  onSelect: (playerId: string) => void
  onClose: () => void
}) {
  const tableSort = useTableSort<BatterSortKey>({ key: 'ovr', direction: 'desc' })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const rows = sortRows(batters, {
    name: (player) => player.name,
    position: (player) => POSITION_LABEL[player.role],
    hand: (player) => formatHandedness(player),
    ovr: (player) => overallRating(player),
    contact: (player) => player.contact,
    power: (player) => player.power,
    eye: (player) => player.eye,
    speed: (player) => player.speed,
    fielding: (player) => player.fielding,
  }, tableSort.sort)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4" onClick={onClose} role="presentation">
      <div
        className="bm-animate-in flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lineup-batter-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 id="lineup-batter-modal-title" className="text-xl font-bold text-[var(--text-h)]">
              {POS_LABEL[position]} 타자 선택
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              후보 {batters.length}명 · 열 제목을 누르면 능력치별로 정렬됩니다.
            </p>
          </div>
          <button type="button" className="bm-btn bm-btn-ghost px-3" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="overflow-auto">
          <table className="bm-table whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-[var(--panel)]">
              <tr>
                <SortableHeader column="name" sort={tableSort.sort} onSort={tableSort.requestSort}>선수</SortableHeader>
                <SortableHeader column="position" sort={tableSort.sort} onSort={tableSort.requestSort}>Pos</SortableHeader>
                <SortableHeader column="hand" sort={tableSort.sort} onSort={tableSort.requestSort}>타/투</SortableHeader>
                <SortableHeader column="ovr" sort={tableSort.sort} onSort={tableSort.requestSort}>OVR</SortableHeader>
                <SortableHeader column="contact" sort={tableSort.sort} onSort={tableSort.requestSort}>컨택</SortableHeader>
                <SortableHeader column="power" sort={tableSort.sort} onSort={tableSort.requestSort}>파워</SortableHeader>
                <SortableHeader column="eye" sort={tableSort.sort} onSort={tableSort.requestSort}>선구</SortableHeader>
                <SortableHeader column="speed" sort={tableSort.sort} onSort={tableSort.requestSort}>주루</SortableHeader>
                <SortableHeader column="fielding" sort={tableSort.sort} onSort={tableSort.requestSort}>수비</SortableHeader>
                <th>현재 배치</th>
                <th aria-label="선택" />
              </tr>
            </thead>
            <tbody>
              {rows.map((player) => {
                const assignedPosition = FIELD_POSITIONS.find((pos) => lineup[pos] === player.id)
                const selected = lineup[position] === player.id
                return (
                  <tr key={player.id} className={selected ? 'bg-[var(--accent-dim)]' : ''}>
                    <td className="font-semibold">{player.name}</td>
                    <td>{POSITION_LABEL[player.role]}</td>
                    <td className="text-xs text-[var(--text-muted)]">{formatHandedness(player)}</td>
                    <td><OvrBadge player={player} /></td>
                    <td className="tabular-nums">{player.contact}</td>
                    <td className="tabular-nums">{player.power}</td>
                    <td className="tabular-nums">{player.eye}</td>
                    <td className="tabular-nums">{player.speed}</td>
                    <td className="tabular-nums">{player.fielding}</td>
                    <td className="text-xs text-[var(--text-muted)]">
                      {assignedPosition ? POS_LABEL[assignedPosition] : '벤치'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`bm-btn py-1 text-xs ${selected ? 'bm-btn-ghost' : 'bm-btn-primary'}`}
                        onClick={() => onSelect(player.id)}
                        disabled={selected}
                      >
                        {selected ? '선택됨' : assignedPosition ? '교체' : '선택'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
