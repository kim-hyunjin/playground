import { useMemo, useState } from 'react'
import { formatSalary, isPitcher, overallRating } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'

export function TransfersPage() {
  const { state, userTeam, buyPlayer } = useGame()
  const [roleFilter, setRoleFilter] = useState<'all' | 'batter' | 'pitcher'>('all')
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
      .sort((a, b) => overallRating(b) - overallRating(a))
    return players.slice(0, 30)
  }, [state, userTeam, roleFilter])

  if (!state || !userTeam) return null

  const handleBuy = (playerId: string, fromTeamId: string, salary: number) => {
    const player = state.teams.flatMap((t) => t.players).find((p) => p.id === playerId)
    if (!player) return
    if (userTeam.budget < salary) {
      setMessage('예산이 부족합니다.')
      return
    }
    if (userTeam.players.length >= 28) {
      setMessage('로스터가 가득 찼습니다. 선수를 방출하세요.')
      return
    }
    const ok = buyPlayer(player, fromTeamId)
    setMessage(ok ? `${player.name} 영입 완료!` : '영입에 실패했습니다.')
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">이적시장</h1>
          <p className="text-sm text-[var(--text-muted)]">
            잔여 예산: {formatSalary(userTeam.budget)} · 로스터 {userTeam.players.length}/28
          </p>
        </div>
        <div className="flex gap-2">
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
              <th>포지션</th>
              <th>OVR</th>
              <th>연봉</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {market.map((p) => (
              <tr key={p.id}>
                <td className="font-medium">{p.name}</td>
                <td className="text-[var(--text-muted)]">
                  {p.fromTeam.city} {p.fromTeam.name}
                </td>
                <td>{POSITION_LABEL[p.role]}</td>
                <td><OvrBadge player={p} /></td>
                <td>{formatSalary(p.salary)}</td>
                <td>
                  <button
                    type="button"
                    className="bm-btn bm-btn-primary py-1 text-xs"
                    disabled={userTeam.budget < p.salary}
                    onClick={() => handleBuy(p.id, p.fromTeam.id, p.salary)}
                  >
                    영입
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
