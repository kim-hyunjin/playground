import { useState } from 'react'
import { calcOps, calcWoba, calcFip, calcWhip } from '../engine/sabermetrics'
import { isBatter, isPitcher, overallRating } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'
import type { Player } from '../types/game'

export function SquadPage() {
  const { userTeam, state, openPlayer, focusedPlayerId } = useGame()
  const [filter, setFilter] = useState<'all' | 'batter' | 'pitcher'>('all')

  if (!userTeam || !state) return null

  const players = userTeam.players
    .filter((p) => filter === 'all' || (filter === 'batter' ? isBatter(p) : isPitcher(p)))
    .sort((a, b) => overallRating(b) - overallRating(a))

  function keyStat(p: Player): string {
    if (isPitcher(p) && p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0) {
      return calcFip(p.seasonStats).toFixed(2)
    }
    if (!isPitcher(p) && p.seasonStats.type === 'batter' && p.seasonStats.pa > 0) {
      return calcWoba(p.seasonStats).toFixed(3)
    }
    return '-'
  }

  function keyStat2(p: Player): string {
    if (isPitcher(p) && p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0) {
      return calcWhip(p.seasonStats).toFixed(2)
    }
    if (!isPitcher(p) && p.seasonStats.type === 'batter' && p.seasonStats.pa > 0) {
      return calcOps(p.seasonStats).toFixed(3)
    }
    return '-'
  }

  const statCol1 = filter === 'pitcher' ? 'FIP' : filter === 'batter' ? 'wOBA' : 'wOBA/FIP'
  const statCol2 = filter === 'pitcher' ? 'WHIP' : filter === 'batter' ? 'OPS' : 'OPS/WHIP'

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">스쿼드</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {userTeam.players.length}명 · 선수 이름을 클릭하면 상세 정보를 볼 수 있습니다
          </p>
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
              <th>OVR</th>
              <th>{statCol1}</th>
              <th>{statCol2}</th>
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
                <td><OvrBadge player={p} /></td>
                <td className="font-mono text-[var(--accent)]">{keyStat(p)}</td>
                <td className="font-mono text-[var(--text-muted)]">{keyStat2(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
