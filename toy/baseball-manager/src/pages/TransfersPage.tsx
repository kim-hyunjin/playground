import { useMemo, useState } from 'react'
import { countByLevel, FIRST_TEAM_MAX, FARM_TEAM_MAX, rosterLevelOf } from '../engine/roster'
import { formatSalary, isPitcher, overallRating } from '../engine/generator'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { RosterLevelBadge } from '../components/RosterBadges'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'

type Tab = 'buy' | 'trade'

function toggleId(ids: string[], id: string, max: number): string[] {
  if (ids.includes(id)) return ids.filter((x) => x !== id)
  if (ids.length >= max) return ids
  return [...ids, id]
}

export function TransfersPage() {
  const { state, userTeam, buyPlayer, tradePlayers } = useGame()
  const [tab, setTab] = useState<Tab>('buy')
  const [roleFilter, setRoleFilter] = useState<'all' | 'batter' | 'pitcher'>('all')
  const [levelFilter, setLevelFilter] = useState<'all' | 'first' | 'farm'>('all')
  const [message, setMessage] = useState('')
  const [tradeTeamId, setTradeTeamId] = useState('')
  const [outgoingIds, setOutgoingIds] = useState<string[]>([])
  const [incomingIds, setIncomingIds] = useState<string[]>([])

  const cpuTeams = useMemo(() => {
    if (!state || !userTeam) return []
    return state.teams.filter((t) => t.id !== userTeam.id)
  }, [state, userTeam])

  const tradePartner = useMemo(
    () => cpuTeams.find((t) => t.id === tradeTeamId) ?? null,
    [cpuTeams, tradeTeamId],
  )

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

  if (state.phase !== 'regular') {
    return (
      <div className="bm-animate-in space-y-4">
        <h1 className="text-2xl font-bold text-[var(--text-h)]">이적·트레이드</h1>
        <p className="text-[var(--text-muted)]">
          정규시즌 중에만 영입·트레이드가 가능합니다. FA 영입은 스토브리그 메뉴를 이용하세요.
        </p>
      </div>
    )
  }

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

  const handleTrade = () => {
    if (!tradeTeamId) {
      setMessage('트레이드 상대 팀을 선택하세요.')
      return
    }
    const result = tradePlayers({
      toTeamId: tradeTeamId,
      outgoingIds,
      incomingIds,
    })
    setMessage(result.message)
    if (result.ok) {
      setOutgoingIds([])
      setIncomingIds([])
    }
  }

  const ourTradePool = userTeam.players
    .filter((p) => roleFilter === 'all' || (roleFilter === 'pitcher' ? isPitcher(p) : !isPitcher(p)))
    .sort((a, b) => overallRating(b) - overallRating(a))

  const theirTradePool = (tradePartner?.players ?? [])
    .filter((p) => roleFilter === 'all' || (roleFilter === 'pitcher' ? isPitcher(p) : !isPitcher(p)))
    .sort((a, b) => overallRating(b) - overallRating(a))

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">이적·트레이드</h1>
          <p className="text-sm text-[var(--text-muted)]">
            잔여 예산: {formatSalary(userTeam.budget)} · 1군 {firstCount}/{FIRST_TEAM_MAX} · 2군 {farmCount}/{FARM_TEAM_MAX}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`bm-btn text-xs ${tab === 'buy' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setTab('buy')}
          >
            FA 영입
          </button>
          <button
            type="button"
            className={`bm-btn text-xs ${tab === 'trade' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setTab('trade')}
          >
            트레이드
          </button>
        </div>
      </div>

      {tab === 'buy' && (
        <p className="text-xs text-[var(--text-muted)]">
          영입 시 1군 등록 우선 · 1군이 가득 차면 2군 등록
        </p>
      )}

      {tab === 'trade' && (
        <p className="text-xs text-[var(--text-muted)]">
          양 팀 각 1~3명 교환 · 연봉 이전 없음 · CPU는 OVR 차이로 수락 여부 결정
        </p>
      )}

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
        {tab === 'buy' &&
          (
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

      {tab === 'buy' ? (
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
      ) : (
        <div className="space-y-4">
          <div className="bm-card p-4">
            <label className="mb-2 block text-sm font-medium text-[var(--text-h)]">상대 팀</label>
            <select
              className="bm-input w-full max-w-md"
              value={tradeTeamId}
              onChange={(e) => {
                setTradeTeamId(e.target.value)
                setIncomingIds([])
              }}
            >
              <option value="">팀 선택…</option>
              {cpuTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.city} {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="bm-card overflow-x-auto p-4">
              <h2 className="mb-3 font-semibold text-[var(--text-h)]">
                보낼 선수 ({outgoingIds.length}/3)
              </h2>
              <table className="bm-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>선수</th>
                    <th>Pos</th>
                    <th>OVR</th>
                  </tr>
                </thead>
                <tbody>
                  {ourTradePool.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={outgoingIds.includes(p.id)}
                          onChange={() => setOutgoingIds((ids) => toggleId(ids, p.id, 3))}
                        />
                      </td>
                      <td><PlayerNameButton playerId={p.id} name={p.name} /></td>
                      <td>{POSITION_LABEL[p.role]}</td>
                      <td><OvrBadge player={p} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bm-card overflow-x-auto p-4">
              <h2 className="mb-3 font-semibold text-[var(--text-h)]">
                받을 선수 ({incomingIds.length}/3)
                {tradePartner ? ` — ${tradePartner.city} ${tradePartner.name}` : ''}
              </h2>
              {!tradePartner ? (
                <p className="text-sm text-[var(--text-muted)]">상대 팀을 먼저 선택하세요.</p>
              ) : (
                <table className="bm-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>선수</th>
                      <th>Pos</th>
                      <th>OVR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {theirTradePool.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={incomingIds.includes(p.id)}
                            onChange={() => setIncomingIds((ids) => toggleId(ids, p.id, 3))}
                          />
                        </td>
                        <td><PlayerNameButton playerId={p.id} name={p.name} /></td>
                        <td>{POSITION_LABEL[p.role]}</td>
                        <td><OvrBadge player={p} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <button
            type="button"
            className="bm-btn bm-btn-primary"
            disabled={!tradeTeamId || outgoingIds.length === 0 || incomingIds.length === 0}
            onClick={handleTrade}
          >
            트레이드 제안
          </button>
        </div>
      )}
    </div>
  )
}
