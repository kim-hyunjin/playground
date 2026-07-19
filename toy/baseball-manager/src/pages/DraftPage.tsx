import { useMemo, useState } from 'react'
import {
  draftProgressLabel,
  DRAFT_ROUNDS,
  isDraftComplete,
  isUserOnClock,
  userDraftPicks,
} from '../engine/draft'
import { formatSalary, isPitcher, overallRating } from '../engine/generator'
import { countByLevel, FARM_TEAM_MAX } from '../engine/roster'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'
import { SortableHeader, sortRows, useTableSort } from '../components/SortableTable'

type DraftSortKey = 'name' | 'pos' | 'age' | 'ovr' | 'potential' | 'salary'

export function DraftPage() {
  const {
    state,
    userTeam,
    draftPlayer,
    simulateDraftToUser,
    simulateRemainingDraft,
  } = useGame()
  const [roleFilter, setRoleFilter] = useState<'all' | 'batter' | 'pitcher'>('all')
  const [message, setMessage] = useState('')
  const tableSort = useTableSort<DraftSortKey>({ key: 'ovr', direction: 'desc' })

  const draft = state?.draft
  const onClock = state ? isUserOnClock(state) : false
  const complete = isDraftComplete(draft)

  const prospects = useMemo(() => {
    if (!draft) return []
    return draft.pool
      .filter((p) =>
        roleFilter === 'all' ||
        (roleFilter === 'pitcher' ? isPitcher(p) : !isPitcher(p)),
      )
      .sort((a, b) => overallRating(b) - overallRating(a))
  }, [draft, roleFilter])

  const myPicks = useMemo(() => {
    if (!state) return []
    return userDraftPicks(state)
      .map((pick) => {
        const player = userTeam?.players.find((p) => p.id === pick.playerId)
        return { pick, player }
      })
      .filter((x) => x.player)
  }, [state, userTeam])

  if (!state || !userTeam || state.phase !== 'stove' || !draft) {
    return (
      <div className="bm-animate-in">
        <p className="text-[var(--text-muted)]">드래프트 기간이 아닙니다.</p>
      </div>
    )
  }

  const farmCount = countByLevel(userTeam, 'farm')
  const farmFull = farmCount >= FARM_TEAM_MAX
  const pickerTeam = draft.pickSequence[draft.currentPick]
    ? state.teams.find((t) => t.id === draft.pickSequence[draft.currentPick])
    : null
  const sortedProspects = sortRows(prospects, {
    name: (p) => p.name, pos: (p) => POSITION_LABEL[p.role], age: (p) => p.age,
    ovr: (p) => overallRating(p), potential: (p) => p.potential, salary: (p) => p.salary,
  }, tableSort.sort)

  const handleDraft = (playerId: string) => {
    if (!onClock) {
      setMessage('지금은 우리 팀의 지명 차례가 아닙니다.')
      return
    }
    if (farmFull) {
      setMessage('2군 등록 정원이 가득 차 드래프트 지명이 불가합니다.')
      return
    }

    const prospect = draft.pool.find((p) => p.id === playerId)
    if (prospect && userTeam.budget < prospect.salary) {
      setMessage('지명 계약금을 지불할 예산이 부족합니다.')
      return
    }

    const ok = draftPlayer(playerId)
    if (ok) {
      setMessage(`${prospect?.name ?? '선수'} 지명 완료! 2군 등록`)
    } else {
      setMessage('지명에 실패했습니다.')
    }
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">
            {state.seasonYear} 신인 드래프트
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {complete
              ? `완료 · ${DRAFT_ROUNDS}라운드 ${draft.order.length}팀`
              : draftProgressLabel(draft)}
            {' · '}잔여 유망주 {draft.pool.length}명
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            잔여 예산 {formatSalary(userTeam.budget)} · 2군 {farmCount}/{FARM_TEAM_MAX}
            {' · '}역순 지명 (시즌 최하위 구단부터)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!complete && !onClock && (
            <button
              type="button"
              className="bm-btn bm-btn-ghost text-xs"
              onClick={() => {
                simulateDraftToUser()
                setMessage('다른 구단 지명이 진행되었습니다.')
              }}
            >
              내 차례까지 진행
            </button>
          )}
          {!complete && (
            <button
              type="button"
              className="bm-btn bm-btn-ghost text-xs"
              onClick={() => {
                if (window.confirm('남은 지명을 모두 자동 진행할까요? (우리 팀은 AI가 선택)')) {
                  simulateRemainingDraft()
                  setMessage('드래프트가 완료되었습니다.')
                }
              }}
            >
              남은 지명 자동 진행
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm text-[var(--text-h)]">
          {message}
        </p>
      )}

      {!complete && (
        <div className={`bm-card p-4 text-sm ${onClock ? 'border-[var(--accent)]' : ''}`}>
          {onClock ? (
            <p className="font-medium text-[var(--text-h)]">
              우리 팀 지명 차례입니다. 유망주를 선택하세요.
            </p>
          ) : (
            <p className="text-[var(--text-muted)]">
              현재 지명: {pickerTeam ? pickerTeam.name : '—'}
            </p>
          )}
        </div>
      )}

      {complete && (
        <div className="bm-card p-4 text-sm text-[var(--text-muted)]">
          드래프트가 종료되었습니다. FA 영입 메뉴에서 스토브리그를 이어가세요.
        </div>
      )}

      {myPicks.length > 0 && (
        <div className="bm-card p-5">
          <h2 className="mb-3 font-semibold text-[var(--text-h)]">우리 팀 지명 ({myPicks.length})</h2>
          <ul className="space-y-2 text-sm">
            {myPicks.map(({ pick, player }) => (
              <li key={pick.overall} className="flex flex-wrap items-center gap-2">
                <span className="text-[var(--text-muted)]">
                  {pick.round}R · {pick.overall}번
                </span>
                {player && (
                  <>
                    <PlayerNameButton playerId={player.id} name={player.name} />
                    <span className="text-[var(--text-muted)]">
                      {POSITION_LABEL[player.role]} · OVR {overallRating(player)} · POT {player.potential}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
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
      </div>

      <div className="bm-card overflow-x-auto">
        <table className="bm-table">
          <thead>
            <tr>
              <SortableHeader column="name" sort={tableSort.sort} onSort={tableSort.requestSort}>유망주</SortableHeader>
              <SortableHeader column="pos" sort={tableSort.sort} onSort={tableSort.requestSort}>포지션</SortableHeader>
              <SortableHeader column="age" sort={tableSort.sort} onSort={tableSort.requestSort}>나이</SortableHeader>
              <SortableHeader column="ovr" sort={tableSort.sort} onSort={tableSort.requestSort}>OVR</SortableHeader>
              <SortableHeader column="potential" sort={tableSort.sort} onSort={tableSort.requestSort}>잠재력</SortableHeader>
              <SortableHeader column="salary" sort={tableSort.sort} onSort={tableSort.requestSort}>계약금</SortableHeader>
              <th />
            </tr>
          </thead>
          <tbody>
            {sortedProspects.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-[var(--text-muted)]">
                  남은 유망주가 없습니다.
                </td>
              </tr>
            ) : (
              sortedProspects.slice(0, 40).map((p) => {
                const affordable = userTeam.budget >= p.salary
                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{POSITION_LABEL[p.role]}</td>
                    <td>{p.age}</td>
                    <td>
                      <OvrBadge player={p} />
                    </td>
                    <td>{p.potential}</td>
                    <td>{formatSalary(p.salary)}</td>
                    <td>
                      <button
                        type="button"
                        className="bm-btn bm-btn-primary text-xs"
                        disabled={!onClock || !affordable || farmFull || complete}
                        onClick={() => handleDraft(p.id)}
                      >
                        지명
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
