import { useState } from 'react'
import { isPitcher, overallRating } from '../engine/generator'
import { isPlayerAvailable } from '../engine/injury'
import { firstTeamPlayers } from '../engine/roster'
import { formatHandedness } from '../engine/rosterAvailability'
import { inferPitchingStyle, inferThrows } from '../engine/sim/handedness'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { SortableHeader, sortRows, useTableSort } from '../components/SortableTable'
import { useGame } from '../store/gameStore'
import { DEFAULT_BULLPEN_STRATEGY, type Player } from '../types/game'

export function RotationPage() {
  const { userTeam, state, swapRotation, setPitcherRole, setBullpenStrategy } = useGame()
  const [roleMessage, setRoleMessage] = useState('')
  const roleSort = useTableSort<RoleSortKey>({ key: 'ovr', direction: 'desc' })
  if (!userTeam || !state) return null

  const starters = state.rotation
    .map((id) => userTeam.players.find((p) => p.id === id))
    .filter(Boolean)
  const strategy = state.bullpenStrategy ?? DEFAULT_BULLPEN_STRATEGY
  const pitchers = sortRows(firstTeamPlayers(userTeam).filter(isPitcher), {
    name: (player) => player.name,
    role: (player) => player.role,
    hand: (player) => pitchingHandLabel(player),
    ovr: (player) => overallRating(player),
    velocity: (player) => player.velocity,
    control: (player) => player.control,
    movement: (player) => player.movement,
    stamina: (player) => player.stamina,
    fatigue: (player) => player.fatigue,
  }, roleSort.sort)

  const handleRoleChange = (player: Player, role: 'SP' | 'RP') => {
    const starterCount = firstTeamPlayers(userTeam).filter((candidate) => candidate.role === 'SP').length
    if (role === 'RP' && starterCount <= 4) {
      setRoleMessage('선발 로테이션에는 최소 4명의 선발투수가 필요합니다.')
      return
    }
    if (role === 'SP' && starterCount >= 5) {
      setRoleMessage('선발은 최대 5명입니다. 기존 선발을 불펜으로 전환한 뒤 지정하세요.')
      return
    }
    setPitcherRole(player.id, role)
    setRoleMessage(`${player.name} 선수를 ${role === 'SP' ? '선발' : '불펜'} 보직으로 변경했습니다.`)
  }

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
        ▲▼ 버튼으로 등판 순서만 조정할 수 있습니다. 선발 명단은 아래 투수 보직 관리에서 구성합니다.
      </p>

      <section className="bm-card overflow-hidden">
        <div className="border-b border-[var(--border)] p-4">
          <h2 className="font-semibold text-[var(--text-h)]">투수 보직 관리</h2>
          <p className="text-xs text-[var(--text-muted)]">
            선발은 로테이션 후보가 되고, 불펜은 경기 중 교체 투수로 운용됩니다.
          </p>
          {roleMessage ? <p className="mt-1 text-xs text-[var(--accent)]">{roleMessage}</p> : null}
        </div>
        <div className="overflow-x-auto">
          <table className="bm-table whitespace-nowrap">
            <thead>
              <tr>
                <SortableHeader column="name" sort={roleSort.sort} onSort={roleSort.requestSort}>투수</SortableHeader>
                <SortableHeader column="role" sort={roleSort.sort} onSort={roleSort.requestSort}>보직</SortableHeader>
                <SortableHeader column="hand" sort={roleSort.sort} onSort={roleSort.requestSort}>투구 유형</SortableHeader>
                <SortableHeader column="ovr" sort={roleSort.sort} onSort={roleSort.requestSort}>OVR</SortableHeader>
                <SortableHeader column="velocity" sort={roleSort.sort} onSort={roleSort.requestSort}>구속</SortableHeader>
                <SortableHeader column="control" sort={roleSort.sort} onSort={roleSort.requestSort}>제구</SortableHeader>
                <SortableHeader column="movement" sort={roleSort.sort} onSort={roleSort.requestSort}>구위</SortableHeader>
                <SortableHeader column="stamina" sort={roleSort.sort} onSort={roleSort.requestSort}>체력</SortableHeader>
                <SortableHeader column="fatigue" sort={roleSort.sort} onSort={roleSort.requestSort}>피로</SortableHeader>
                <th aria-label="보직 변경" />
              </tr>
            </thead>
            <tbody>
              {pitchers.map((player) => {
                const rotationSlot = state.rotation.indexOf(player.id)
                return (
                  <tr key={player.id}>
                    <td><PlayerNameButton playerId={player.id} name={player.name} /></td>
                    <td>
                      <span className={`bm-badge ${player.role === 'SP' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-300'}`}>
                        {player.role === 'SP' ? '선발' : '불펜'}{rotationSlot >= 0 ? ` ${rotationSlot + 1}` : ''}
                      </span>
                    </td>
                    <td className="text-xs text-[var(--text-muted)]">
                      {pitchingHandLabel(player)}
                      <span className="ml-1 opacity-70">({formatHandedness(player)})</span>
                    </td>
                    <td><OvrBadge player={player} /></td>
                    <td>{player.velocity}</td>
                    <td>{player.control}</td>
                    <td>{player.movement}</td>
                    <td>{player.stamina}</td>
                    <td>{player.fatigue}</td>
                    <td>
                      <button
                        type="button"
                        className="bm-btn bm-btn-ghost py-1 text-xs"
                        onClick={() => handleRoleChange(player, player.role === 'SP' ? 'RP' : 'SP')}
                        disabled={player.role === 'RP' && pitchers.filter((candidate) => candidate.role === 'SP').length >= 5}
                        title={player.role === 'RP' && pitchers.filter((candidate) => candidate.role === 'SP').length >= 5 ? '기존 선발을 불펜으로 전환한 뒤 지정하세요.' : undefined}
                      >
                        {player.role === 'SP' ? '불펜 전환' : '선발 전환'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

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

type StarterSortKey = 'name' | 'hand' | 'ovr' | 'velocity' | 'control' | 'movement' | 'stamina' | 'fatigue'
type RoleSortKey = StarterSortKey | 'role'

function pitchingHandLabel(player: Player): string {
  const throws = inferThrows(player)
  const side = throws === 'L' ? '좌' : throws === 'R' ? '우' : '양'
  const style = inferPitchingStyle(player)
  if (style === 'underhand') return `${side}언`
  if (style === 'sidearm') return `${side}사`
  if (style === 'threeQuarter') return `${side}완(스리쿼터)`
  return `${side}완(오버핸드)`
}
