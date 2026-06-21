import { useState } from 'react'
import { calcOps, calcWoba, calcFip, calcWhip } from '../engine/sabermetrics'
import { farmPlayers, countByLevel, FIRST_TEAM_MAX } from '../engine/roster'
import { isBatter, isPitcher, overallRating } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'
import type { Player } from '../types/game'

export function FarmSquadPage() {
  const { userTeam, state, openPlayer, focusedPlayerId, promotePlayer } = useGame()
  const [filter, setFilter] = useState<'all' | 'batter' | 'pitcher'>('all')
  const [message, setMessage] = useState('')

  if (!userTeam || !state) return null

  const players = farmPlayers(userTeam)
    .filter((p) => filter === 'all' || (filter === 'batter' ? isBatter(p) : isPitcher(p)))
    .sort((a, b) => overallRating(b) - overallRating(a))

  function keyStat(p: Player): string {
    const stats = p.farmSeasonStats
    if (isPitcher(p) && stats.type === 'pitcher' && stats.outs > 0) {
      return calcFip(stats).toFixed(2)
    }
    if (!isPitcher(p) && stats.type === 'batter' && stats.pa > 0) {
      return calcWoba(stats).toFixed(3)
    }
    return '-'
  }

  function keyStat2(p: Player): string {
    const stats = p.farmSeasonStats
    if (isPitcher(p) && stats.type === 'pitcher' && stats.outs > 0) {
      return calcWhip(stats).toFixed(2)
    }
    if (!isPitcher(p) && stats.type === 'batter' && stats.pa > 0) {
      return calcOps(stats).toFixed(3)
    }
    return '-'
  }

  const statCol1 = filter === 'pitcher' ? 'FIP' : filter === 'batter' ? 'wOBA' : 'wOBA/FIP'
  const statCol2 = filter === 'pitcher' ? 'WHIP' : filter === 'batter' ? 'OPS' : 'OPS/WHIP'
  const firstCount = countByLevel(userTeam, 'first')

  const handlePromote = (playerId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (firstCount >= FIRST_TEAM_MAX) {
      setMessage('1군 등록 정원(26명)이 가득 찼습니다. 선수를 2군으로 보내세요.')
      return
    }
    const ok = promotePlayer(playerId)
    setMessage(ok ? '1군으로 승격했습니다.' : '승격할 수 없습니다.')
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">2군 스쿼드</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {players.length}명 · 1군 {firstCount}/{FIRST_TEAM_MAX} · 2군 시즌 기록
          </p>
          {message && <p className="mt-1 text-xs text-[var(--accent)]">{message}</p>}
        </div>
        <div className="flex gap-2">
          {(['all', 'batter', 'pitcher'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`bm-btn text-xs ${filter === f ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '전체' : f === 'batter' ? '타자' : '투수'}
            </button>
          ))}
        </div>
      </div>

      <div className="bm-card overflow-hidden">
        <table className="bm-table">
          <thead>
            <tr>
              <th>선수</th>
              <th>Pos</th>
              <th>나이</th>
              <th>OVR</th>
              <th>{statCol1}</th>
              <th>{statCol2}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr
                key={p.id}
                className={`cursor-pointer ${focusedPlayerId === p.id ? 'bg-[var(--accent-dim)]' : ''}`}
                onClick={() => openPlayer(p.id)}
              >
                <td>
                  <PlayerNameButton playerId={p.id} name={p.name} />
                </td>
                <td>{POSITION_LABEL[p.role]}</td>
                <td className="text-[var(--text-muted)]">{p.age}</td>
                <td><OvrBadge player={p} /></td>
                <td className="font-mono text-[var(--accent)]">{keyStat(p)}</td>
                <td className="font-mono text-[var(--text-muted)]">{keyStat2(p)}</td>
                <td>
                  <button
                    type="button"
                    className="bm-btn bm-btn-ghost text-xs"
                    onClick={(e) => handlePromote(p.id, e)}
                  >
                    1군 승격
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