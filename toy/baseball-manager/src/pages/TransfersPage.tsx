import { useMemo, useState } from 'react'
import { countByLevel, FIRST_TEAM_MAX, FARM_TEAM_MAX, rosterLevelOf } from '../engine/roster'
import { formatSalary, isPitcher, overallRating } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { RosterLevelBadge } from '../components/RosterBadges'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'

export function TransfersPage() {
  const { state, userTeam, buyPlayer } = useGame()
  const [roleFilter, setRoleFilter] = useState<'all' | 'batter' | 'pitcher'>('all')
  const [levelFilter, setLevelFilter] = useState<'all' | 'first' | 'farm'>('all')
  const [message, setMessage] = useState('')

  const market = useMemo(() => {
    if (!state || !userTeam) return []
    const players = state.teams
      .filter((t) => t.id !== userTeam.id)
      .flatMap((t) => t.players.map((p) => ({ ...p, fromTeam: t })))
      .filter((p) =>
        roleFilter === 'all' ||
        (roleFilter === 'pitcher' ? isPitcher(p) : !isPitcher(p)),
      )
      .filter((p) => levelFilter === 'all' || rosterLevelOf(p) === levelFilter)
      .sort((a, b) => overallRating(b) - overallRating(a))
    return players.slice(0, 40)
  }, [state, userTeam, roleFilter, levelFilter])

  if (!state || !userTeam) return null

  const firstCount = countByLevel(userTeam, 'first')
  const farmCount = countByLevel(userTeam, 'farm')
  const firstFull = firstCount >= FIRST_TEAM_MAX
  const farmFull = farmCount >= FARM_TEAM_MAX

  const handleBuy = (playerId: string, fromTeamId: string, salary: number) => {
    const player = state.teams.flatMap((t) => t.players).find((p) => p.id === playerId)
    if (!player) return
    if (userTeam.budget < salary) {
      setMessage('예산이 부족합니다.')
      return
    }
    if (firstFull && farmFull) {
      setMessage('1군·2군 등록 정원이 모두 가득 찼습니다.')
      return
    }

    const ok = buyPlayer(player, fromTeamId)
    if (ok) {
      const dest = firstFull ? '2군' : '1군'
      setMessage(`${player.name} 영입 완료! (${dest} 등록)`)
    } else {
      setMessage('영입에 실패했습니다.')
    }
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">이적시장</h1>
          <p className="text-sm text-[var(--text-muted)]">
            잔여 예산: {formatSalary(userTeam.budget)} · 1군 {firstCount}/{FIRST_TEAM_MAX} · 2군 {farmCount}/{FARM_TEAM_MAX}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            영입 시 1군 등록 우선 · 1군이 가득 차면 2군 등록
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'batter', 'pitcher'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`bm-btn text-xs ${roleFilter === f ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
              onClick={() => setRoleFilter(f)}
            >
              {f === 'all' ? '전체' : f === 'batter' ? '타자' : '투수'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', '등록 전체'],
            ['first', '1군만'],
            ['farm', '2군만'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`bm-btn text-xs ${levelFilter === id ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setLevelFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {message && (
        <div className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-2 text-sm text-[var(--accent)]">
          {message}
        </div>
      )}

      <div className="bm-card overflow-x-auto">
        <table className="bm-table">
          <thead>
            <tr>
              <th>선수</th>
              <th>소속</th>
              <th>등록</th>
              <th>포지션</th>
              <th>OVR</th>
              <th>연봉</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {market.map((p) => {
              const level = rosterLevelOf(p)
              return (
                <tr key={p.id}>
                  <td><PlayerNameButton playerId={p.id} name={p.name} /></td>
                  <td className="text-[var(--text-muted)]">
                    {p.fromTeam.city} {p.fromTeam.name}
                  </td>
                  <td><RosterLevelBadge level={level} compact /></td>
                  <td>{POSITION_LABEL[p.role]}</td>
                  <td><OvrBadge player={p} /></td>
                  <td>{formatSalary(p.salary)}</td>
                  <td>
                    <button
                      type="button"
                      className="bm-btn bm-btn-primary py-1 text-xs"
                      disabled={userTeam.budget < p.salary || (firstFull && farmFull)}
                      onClick={() => handleBuy(p.id, p.fromTeam.id, p.salary)}
                    >
                      영입
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
