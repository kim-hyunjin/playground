import { useState } from 'react'
import { calcOps, calcWoba, calcFip, calcWhip } from '../engine/sabermetrics'
import { firstTeamPlayers, countByLevel, FIRST_TEAM_MAX } from '../engine/roster'
import { isBatter, isPitcher, overallRating } from '../engine/generator'
import { formatHandedness } from '../engine/rosterAvailability'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { InjuryBadge } from '../components/RosterBadges'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'
import type { Player } from '../types/game'

export function SquadPage() {
  const { userTeam, state, openPlayer, focusedPlayerId, demotePlayer } = useGame()
  const [filter, setFilter] = useState<'all' | 'batter' | 'pitcher'>('all')
  const [message, setMessage] = useState('')

  if (!userTeam || !state) return null

  const players = firstTeamPlayers(userTeam)
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

  const handleDemote = (playerId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const ok = demotePlayer(playerId)
    setMessage(ok ? '2군으로 보냈습니다.' : '2군으로 보낼 수 없습니다.')
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">1군 스쿼드</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {countByLevel(userTeam, 'first')}/{FIRST_TEAM_MAX}명 · 선수 이름을 클릭하면 상세 정보를 볼 수 있습니다
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
              <th>타/투</th>
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
                  <div className="flex flex-wrap items-center gap-1">
                    <PlayerNameButton playerId={p.id} name={p.name} />
                    <InjuryBadge player={p} compact />
                  </div>
                </td>
                <td>{POSITION_LABEL[p.role]}</td>
                <td className="font-mono text-xs text-[var(--text-muted)]">{formatHandedness(p)}</td>
                <td><OvrBadge player={p} /></td>
                <td className="font-mono text-[var(--accent)]">{keyStat(p)}</td>
                <td className="font-mono text-[var(--text-muted)]">{keyStat2(p)}</td>
                <td>
                  <button
                    type="button"
                    className="bm-btn bm-btn-ghost text-xs"
                    onClick={(e) => handleDemote(p.id, e)}
                  >
                    2군
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
