import { useMemo, useState } from 'react'
import { calcOps, calcWoba, calcFip, calcWhip } from '../engine/sabermetrics'
import { farmPlayers, countByLevel, FIRST_TEAM_MAX } from '../engine/roster'
import {
  callUpCandidateIds,
  evaluateCallUpCandidate,
  isProspect,
  isRehabCandidate,
} from '../engine/callUpEvaluation'
import { isBatter, isPitcher, overallRating } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { CallUpBadge } from '../components/RosterBadges'
import { PotentialBadge } from '../components/DevelopmentPanel'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'
import type { Player } from '../types/game'

type RoleFilter = 'all' | 'batter' | 'pitcher'
type SquadFilter = 'all' | 'prospect' | 'rehab' | 'callup'

export function FarmSquadPage() {
  const { userTeam, state, openPlayer, focusedPlayerId, promotePlayer } = useGame()
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [squadFilter, setSquadFilter] = useState<SquadFilter>('all')
  const [message, setMessage] = useState('')

  const callUpIds = useMemo(() => {
    if (!userTeam || !state) return new Set<string>()
    return callUpCandidateIds(
      userTeam,
      state.callUpSuggestions.map((s) => s.playerId),
    )
  }, [userTeam, state])

  if (!userTeam || !state) return null

  const players = farmPlayers(userTeam)
    .filter((p) => roleFilter === 'all' || (roleFilter === 'batter' ? isBatter(p) : isPitcher(p)))
    .filter((p) => {
      if (squadFilter === 'prospect') return isProspect(p)
      if (squadFilter === 'rehab') return isRehabCandidate(p)
      if (squadFilter === 'callup') return callUpIds.has(p.id)
      return true
    })
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

  const statCol1 = roleFilter === 'pitcher' ? 'FIP' : roleFilter === 'batter' ? 'wOBA' : 'wOBA/FIP'
  const statCol2 = roleFilter === 'pitcher' ? 'WHIP' : roleFilter === 'batter' ? 'OPS' : 'OPS/WHIP'
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
            {players.length}명 표시 · 1군 {firstCount}/{FIRST_TEAM_MAX} · 2군 시즌 기록
          </p>
          {message && <p className="mt-1 text-xs text-[var(--accent)]">{message}</p>}
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
            ['all', '전체'],
            ['prospect', '유망주(24↓)'],
            ['rehab', '재활(피로↑)'],
            ['callup', '콜업 후보'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`bm-btn text-xs ${squadFilter === id ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setSquadFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bm-card overflow-hidden">
        <table className="bm-table">
          <thead>
            <tr>
              <th>선수</th>
              <th>Pos</th>
              <th>나이</th>
              <th>OVR</th>
              <th>잠재</th>
              <th>{statCol1}</th>
              <th>{statCol2}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-[var(--text-muted)]">
                  조건에 맞는 2군 선수가 없습니다.
                </td>
              </tr>
            ) : (
              players.map((p) => {
                const isCallUp = callUpIds.has(p.id)
                const evalHint = evaluateCallUpCandidate(userTeam, p)
                return (
                  <tr
                    key={p.id}
                    className={`cursor-pointer ${focusedPlayerId === p.id ? 'bg-[var(--accent-dim)]' : ''}`}
                    onClick={() => openPlayer(p.id)}
                  >
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        <PlayerNameButton playerId={p.id} name={p.name} />
                        {isCallUp && <CallUpBadge compact />}
                        <PotentialBadge player={p} compact />
                      </div>
                      {isCallUp && evalHint.reason && (
                        <div className="mt-0.5 text-[10px] text-[var(--warning)]">{evalHint.reason}</div>
                      )}
                    </td>
                    <td>{POSITION_LABEL[p.role]}</td>
                    <td className="text-[var(--text-muted)]">{p.age}</td>
                    <td><OvrBadge player={p} /></td>
                    <td className="font-mono text-[var(--success)]">{p.potential ?? '—'}</td>
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
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
