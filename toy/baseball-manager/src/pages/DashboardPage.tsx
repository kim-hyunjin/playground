import { formatSalary, isPitcher, overallRating, teamPayroll } from '../engine/generator'
import { teamCoachPayroll } from '../engine/coachGenerator'
import { countByLevel, firstTeamPlayers } from '../engine/roster'
import { sortedStandings, sortedFarmStandings } from '../engine/schedule'
import { MiniStat } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { isDraftComplete, draftProgressLabel } from '../engine/draft'
import { isSeasonComplete, isStoveLeague, stoveWeekLabel } from '../engine/stoveLeague'
import { useGame } from '../store/gameStore'

export function DashboardPage() {
  const {
    state,
    userTeam,
    upcomingGame,
    enterStoveLeague,
    setView,
    advanceWeek,
    playUserGame,
    acceptCallUp,
    dismissCallUp,
  } = useGame()
  if (!state || !userTeam) return null

  const opponent = upcomingGame
    ? state.teams.find(
        (t) => t.id === (upcomingGame.homeId === userTeam.id ? upcomingGame.awayId : upcomingGame.homeId),
      )
    : null

  const standings = sortedStandings(state.teams)
  const farmStandings = sortedFarmStandings(state.teams)
  const rank = standings.findIndex((t) => t.id === userTeam.id) + 1
  const farmRank = farmStandings.findIndex((t) => t.id === userTeam.id) + 1
  const seasonComplete = isSeasonComplete(state)
  const inStove = isStoveLeague(state)

  if (inStove) {
    return (
      <div className="bm-animate-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">스토브리그</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {state.seasonYear} 시즌 종료 · {stoveWeekLabel(state)} · FA {state.freeAgents.length}명
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat label="1군 승" value={userTeam.wins} />
          <MiniStat label="1군 패" value={userTeam.losses} />
          <MiniStat label="2군 승" value={userTeam.farmWins} />
          <MiniStat label="예산" value={formatSalary(userTeam.budget)} />
        </div>

        <div className="bm-card p-5">
          <h2 className="mb-3 font-semibold text-[var(--text-h)]">오프시즌</h2>
          <p className="mb-4 text-sm text-[var(--text-muted)]">
            {isDraftComplete(state.draft)
              ? '드래프트가 끝났습니다. FA 영입으로 팀을 보강하세요.'
              : `${draftProgressLabel(state.draft)} — 신인 드래프트를 먼저 진행하세요.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {!isDraftComplete(state.draft) && (
              <button type="button" className="bm-btn bm-btn-primary" onClick={() => setView('draft')}>
                드래프트 진행
              </button>
            )}
            <button type="button" className="bm-btn bm-btn-ghost" onClick={() => setView('stove')}>
              FA 영입
            </button>
          </div>
        </div>
      </div>
    )
  }

  const seasonOver = seasonComplete

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">대시보드</h1>
        <p className="text-sm text-[var(--text-muted)]">
          {state.seasonYear} 시즌 · {state.currentWeek}주차 · 1군 {userTeam.wins}승 {userTeam.losses}패 ({rank}위) · 2군 {userTeam.farmWins}승 {userTeam.farmLosses}패 ({farmRank}위)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="승" value={userTeam.wins} />
        <MiniStat label="패" value={userTeam.losses} />
        <MiniStat label="득점" value={userTeam.runsScored} />
        <MiniStat label="예산" value={formatSalary(userTeam.budget)} />
      </div>

      {state.callUpSuggestions.length > 0 && (
        <div className="bm-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-[var(--text-h)]">2군 감독 콜업 제안</h2>
            <button type="button" className="bm-btn bm-btn-ghost text-xs" onClick={() => setView('coaches')}>
              코치진 보기
            </button>
          </div>
          <ul className="space-y-3">
            {state.callUpSuggestions.map((s) => {
              const player = userTeam.players.find((p) => p.id === s.playerId)
              return (
                <li
                  key={s.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4"
                >
                  <p className="text-sm text-[var(--text-h)]">{s.reason}</p>
                  {player && (
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      <PlayerNameButton playerId={player.id} name={player.name} />
                      {' · '}
                      OVR {overallRating(player)} · 2군
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="bm-btn bm-btn-primary text-xs"
                      onClick={() => acceptCallUp(s.id)}
                    >
                      콜업 승인
                    </button>
                    <button
                      type="button"
                      className="bm-btn bm-btn-ghost text-xs"
                      onClick={() => dismissCallUp(s.id)}
                    >
                      보류
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bm-card p-5">
          <h2 className="mb-3 font-semibold text-[var(--text-h)]">다음 경기</h2>
          {seasonOver ? (
            <div className="space-y-3">
              <p className="text-[var(--text-muted)]">정규시즌이 종료되었습니다.</p>
              <button type="button" className="bm-btn bm-btn-primary" onClick={enterStoveLeague}>
                스토브리그 진입
              </button>
            </div>
          ) : upcomingGame && opponent ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">
                  {upcomingGame.homeId === userTeam.id ? '홈' : '원정'} · {upcomingGame.week}주차
                </span>
                <span className="font-bold text-[var(--text-h)]">
                  vs {opponent.city} {opponent.name}
                </span>
              </div>
              <div className="flex gap-2">
                <button type="button" className="bm-btn bm-btn-primary flex-1" onClick={() => { playUserGame(); setView('match') }}>
                  경기 시작
                </button>
                <button type="button" className="bm-btn bm-btn-ghost" onClick={() => setView('lineup')}>
                  라인업
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[var(--text-muted)]">이번 주 경기가 없습니다.</p>
              <button
                type="button"
                className="bm-btn bm-btn-primary"
                disabled={state.currentWeek >= state.totalWeeks}
                onClick={advanceWeek}
              >
                다음 주 진행
              </button>
            </div>
          )}
        </div>

        <div className="bm-card p-5">
          <h2 className="mb-3 font-semibold text-[var(--text-h)]">팀 현황</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">총 연봉 (선수)</dt>
              <dd className="text-[var(--text-h)]">{formatSalary(teamPayroll(userTeam))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">코치 연봉</dt>
              <dd className="text-[var(--text-h)]">{formatSalary(teamCoachPayroll(userTeam))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">1군 등록</dt>
              <dd className="text-[var(--text-h)]">{countByLevel(userTeam, 'first')}명</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">2군 등록</dt>
              <dd className="text-[var(--text-h)]">{countByLevel(userTeam, 'farm')}명</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">팀 OVR (타선)</dt>
              <dd className="text-[var(--text-h)]">
                {Math.round(
                  firstTeamPlayers(userTeam).filter((p) => !isPitcher(p)).slice(0, 9)
                    .reduce((s, p) => s + overallRating(p), 0) / 9,
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bm-card p-5">
        <h2 className="mb-3 font-semibold text-[var(--text-h)]">리그 순위 (상위 5)</h2>
        <table className="bm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>팀</th>
              <th>승</th>
              <th>패</th>
              <th>승률</th>
            </tr>
          </thead>
          <tbody>
            {standings.slice(0, 5).map((t, i) => (
              <tr key={t.id} className={t.id === userTeam.id ? 'bg-[var(--accent-dim)]' : ''}>
                <td>{i + 1}</td>
                <td style={{ color: t.id === userTeam.id ? userTeam.color : undefined }}>
                  {t.city} {t.name}
                </td>
                <td>{t.wins}</td>
                <td>{t.losses}</td>
                <td>{(t.wins / Math.max(1, t.wins + t.losses)).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
