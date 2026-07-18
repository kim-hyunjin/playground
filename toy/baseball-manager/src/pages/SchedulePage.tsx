import { useMemo, useState } from 'react'
import { DAY_LABELS, GAME_DAYS } from '../types/game'
import {
  gamesForWeek,
  resultForGame,
  userGamesForWeek,
  userResults,
} from '../engine/schedule'
import { useGame } from '../store/gameStore'
import { MatchReplayPanel } from '../components/MatchReplayPanel'

export function SchedulePage() {
  const { state, userTeam, setView } = useGame()
  const [tab, setTab] = useState<'week' | 'history'>('week')
  const [weekView, setWeekView] = useState<number | null>(null)
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)

  const displayWeek = weekView ?? state?.currentWeek ?? 1

  const weekGames = useMemo(() => {
    if (!state || !userTeam) return []
    return userGamesForWeek(state.schedule, userTeam.id, displayWeek)
  }, [state, userTeam, displayWeek])

  const history = useMemo(() => {
    if (!state || !userTeam) return []
    return userResults(state.results, userTeam.id)
  }, [state, userTeam])

  const selectedResult = useMemo(() => {
    if (!state || !selectedGameId) return null
    return resultForGame(state.results, selectedGameId) ?? null
  }, [state, selectedGameId])

  if (!state || !userTeam) return null

  const teamName = (id: string) => state.teams.find((t) => t.id === id)?.name ?? '?'
  const opponentName = (g: { homeId: string; awayId: string }) =>
    g.homeId === userTeam.id ? teamName(g.awayId) : teamName(g.homeId)

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">일정 · 경기 기록</h1>
          <p className="text-sm text-[var(--text-muted)]">
            화·수·목 / 금·토·일 시리즈 · 주 6경기
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`bm-btn text-xs ${tab === 'week' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setTab('week')}
          >
            주간 일정
          </button>
          <button
            type="button"
            className={`bm-btn text-xs ${tab === 'history' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setTab('history')}
          >
            경기 기록 ({history.length})
          </button>
        </div>
      </div>

      {tab === 'week' ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="bm-btn bm-btn-ghost text-xs"
              disabled={displayWeek <= 1}
              onClick={() => setWeekView(displayWeek - 1)}
            >
              ← 이전 주
            </button>
            <span className="font-semibold text-[var(--text-h)]">{displayWeek}주차</span>
            <button
              type="button"
              className="bm-btn bm-btn-ghost text-xs"
              disabled={displayWeek >= state.totalWeeks}
              onClick={() => setWeekView(displayWeek + 1)}
            >
              다음 주 →
            </button>
            {displayWeek !== state.currentWeek ? (
              <button
                type="button"
                className="bm-btn bm-btn-ghost text-xs"
                onClick={() => setWeekView(state.currentWeek)}
              >
                현재 주로
              </button>
            ) : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {weekGames.map((g) => {
              const isHome = g.homeId === userTeam.id
              const played = g.played
              const dayIdx = (d: typeof g.day) => GAME_DAYS.indexOf(d)
              const isCurrent =
                displayWeek === state.currentWeek &&
                !played &&
                !weekGames.some((x) => !x.played && dayIdx(x.day) < dayIdx(g.day))
              const result = played ? resultForGame(state.results, g.id) : null
              const userScore = result
                ? (isHome ? result.homeScore : result.awayScore)
                : null
              const oppScore = result
                ? (isHome ? result.awayScore : result.homeScore)
                : null
              const won = result
                ? (userScore ?? 0) > (oppScore ?? 0)
                : null

              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    if (played && result) {
                      setSelectedGameId(g.id)
                      setTab('history')
                    } else if (isCurrent) {
                      setView('match')
                    }
                  }}
                  className={`rounded-lg border p-4 text-left transition ${
                    isCurrent
                      ? 'border-[var(--accent)] bg-[var(--accent-dim)]'
                      : played
                        ? 'border-[var(--border)] hover:border-[var(--text-muted)]'
                        : 'border-[var(--border)] opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-[var(--accent)]">
                      {DAY_LABELS[g.day]}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {isHome ? '홈' : '원정'}
                      {isCurrent ? ' · 다음 경기' : null}
                    </span>
                  </div>
                  <div className="mt-2 font-medium text-[var(--text-h)]">
                    vs {opponentName(g)}
                  </div>
                  {played && result ? (
                    <div
                      className={`mt-2 text-sm font-mono ${
                        won ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                      }`}
                    >
                      {userScore} : {oppScore} {won ? '승' : '패'}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-[var(--text-muted)]">예정</div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="bm-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-[var(--text-muted)]">
              {displayWeek}주차 리그 전체 일정
            </h2>
            <div className="max-h-64 overflow-y-auto">
              <table className="bm-table text-sm">
                <thead>
                  <tr>
                    <th>요일</th>
                    <th>홈</th>
                    <th>원정</th>
                    <th>결과</th>
                  </tr>
                </thead>
                <tbody>
                  {gamesForWeek(state.schedule, displayWeek).map((g) => (
                    <tr
                      key={g.id}
                      className={
                        g.homeId === userTeam.id || g.awayId === userTeam.id
                          ? 'bg-[var(--accent-dim)]/40'
                          : ''
                      }
                    >
                      <td>{DAY_LABELS[g.day]}</td>
                      <td>{teamName(g.homeId)}</td>
                      <td>{teamName(g.awayId)}</td>
                      <td className="font-mono text-xs">
                        {g.played
                          ? `${g.awayScore ?? '-'} : ${g.homeScore ?? '-'}`
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {selectedResult ? (
            <div className="space-y-4">
              <button
                type="button"
                className="bm-btn bm-btn-ghost text-xs"
                onClick={() => setSelectedGameId(null)}
              >
                ← 목록으로
              </button>
              <MatchReplayPanel result={selectedResult} teams={state.teams} userTeamId={userTeam.id} />
            </div>
          ) : (
            <div className="bm-card overflow-x-auto">
              {history.length === 0 ? (
                <p className="p-6 text-center text-[var(--text-muted)]">아직 경기 기록이 없습니다.</p>
              ) : (
                <table className="bm-table">
                  <thead>
                    <tr>
                      <th>주차</th>
                      <th>요일</th>
                      <th>상대</th>
                      <th>스코어</th>
                      <th>결과</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((r) => {
                      const isHome = r.homeId === userTeam.id
                      const oppId = isHome ? r.awayId : r.homeId
                      const us = isHome ? r.homeScore : r.awayScore
                      const them = isHome ? r.awayScore : r.homeScore
                      const won = us > them
                      return (
                        <tr key={r.gameId}>
                          <td>{r.week}주</td>
                          <td>{r.day ? DAY_LABELS[r.day] : '-'}</td>
                          <td>
                            {isHome ? 'vs ' : '@ '}
                            {teamName(oppId)}
                          </td>
                          <td className="font-mono">
                            {us} : {them}
                          </td>
                          <td className={won ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>
                            {won ? '승' : '패'}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="bm-btn bm-btn-ghost text-xs"
                              onClick={() => setSelectedGameId(r.gameId)}
                            >
                              상세
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
