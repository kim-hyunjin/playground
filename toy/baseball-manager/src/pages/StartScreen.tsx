import { useMemo, useState } from 'react'
import { DATA_SEASON, previewTeamStarLines } from '../data/rosterLoader'
import { TEAM_DEFS } from '../engine/generator'
import type { TeamAbbr } from '../data/types'
import { useGame } from '../store/gameStore'

export function StartScreen() {
  const { startNewGame, loadGame } = useGame()
  const [selected, setSelected] = useState(0)
  const [name, setName] = useState('감독')
  const selectedAbbr = TEAM_DEFS[selected]!.abbr as TeamAbbr
  const starPreview = useMemo(
    () => previewTeamStarLines(selectedAbbr, 4),
    [selectedAbbr],
  )

  const handleStart = () => {
    if (name.trim()) startNewGame(selected, name.trim())
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6">
      <div className="bm-animate-in w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-h)]">
            ⚾ Baseball Manager
          </h1>
          <p className="mt-2 text-[var(--text-muted)]">
            팀을 이끌고 라인업을 짜고, 18주 시즌을 정복하세요
          </p>
          <span className="mt-2 inline-block rounded-full bg-[var(--accent-dim)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            {DATA_SEASON} KBO 실명 로스터
          </span>
        </div>

        <div className="bm-card space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
              감독 이름
            </label>
            <input
              className="bm-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-[var(--text-muted)]">
              구단 선택
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TEAM_DEFS.map((team, i) => (
                <button
                  key={team.abbr}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={`rounded-lg border p-3 text-left transition ${
                    selected === i
                      ? 'border-[var(--accent)] bg-[var(--accent-dim)]'
                      : 'border-[var(--border)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="font-bold" style={{ color: team.color }}>
                    {team.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{team.city}</div>
                  <div className="text-xs text-[var(--text-muted)]">{team.stadium}</div>
                </button>
              ))}
            </div>
            {starPreview.length > 0 ? (
              <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
                <div className="mb-2 text-xs font-medium text-[var(--text-muted)]">
                  {TEAM_DEFS[selected]!.name} 핵심 선수
                </div>
                <ul className="space-y-1 text-sm">
                  {starPreview.map((p) => (
                    <li key={p.id} className="flex justify-between gap-2">
                      <span>
                        {p.name}{' '}
                        <span className="text-[var(--text-muted)]">{p.role}</span>
                      </span>
                      <span className="font-mono text-[var(--accent)]">OVR {p.ovr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="flex gap-3">
            <button type="button" className="bm-btn bm-btn-primary flex-1" onClick={handleStart}>
              시즌 시작
            </button>
            <button type="button" className="bm-btn bm-btn-ghost" onClick={() => loadGame()}>
              이어하기
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          10개 구단 · 18주 정규시즌 · {DATA_SEASON} KBO 실명 로스터 기반
        </p>
        <p className="mt-1 text-center text-[10px] text-[var(--text-muted)]">
          비공식 팬메이드 프로젝트 · 실제 KBO와 무관 · 데이터는 추정치 포함
        </p>
      </div>
    </div>
  )
}
