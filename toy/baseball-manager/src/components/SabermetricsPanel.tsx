import type { Player } from '../types/game'
import {
  batterSabermetrics,
  leagueBattingRates,
  leaguePitchingRates,
  pitcherSabermetrics,
} from '../engine/sabermetrics'
import { isPitcher } from '../engine/generator'
import { useGame } from '../store/gameStore'

function StatCell({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-[var(--panel-2)] p-3 text-center">
      <div className={`text-lg font-bold ${highlight ? 'text-[var(--accent)]' : 'text-[var(--text-h)]'}`}>
        {value}
      </div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  )
}

function CountingRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between border-b border-[var(--border)] py-1.5 text-sm last:border-0">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-medium text-[var(--text-h)]">{value}</span>
    </div>
  )
}

export function SabermetricsPanel({ player }: { player: Player }) {
  const { state } = useGame()
  if (!state) return null

  const lgBat = leagueBattingRates(state.teams)
  const lgPit = leaguePitchingRates(state.teams)

  if (!isPitcher(player) && player.seasonStats.type === 'batter') {
    const raw = player.seasonStats
    const s = batterSabermetrics(raw, lgBat)

    if (raw.pa === 0) {
      return (
        <div className="bm-card p-4 text-sm text-[var(--text-muted)]">
          아직 시즌 기록이 없습니다. 경기를 진행하면 세이버매트릭스 스탯이 집계됩니다.
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="bm-card p-4">
          <h3 className="mb-3 font-semibold text-[var(--text-h)]">세이버매트릭스 — 타격</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            <StatCell label="wOBA" value={s.woba} highlight />
            <StatCell label="wRC+" value={s.wrcPlus} highlight />
            <StatCell label="OPS" value={s.ops} />
            <StatCell label="OBP" value={s.obp} />
            <StatCell label="SLG" value={s.slg} />
            <StatCell label="AVG" value={s.avg} />
            <StatCell label="ISO" value={s.iso} />
            <StatCell label="BABIP" value={s.babip} />
            <StatCell label="K%" value={`${s.kPct}%`} />
            <StatCell label="BB%" value={`${s.bbPct}%`} />
          </div>
        </div>

        <div className="bm-card p-4">
          <h3 className="mb-2 font-semibold text-[var(--text-h)]">시즌 누적 기록</h3>
          <CountingRow label="경기" value={raw.games} />
          <CountingRow label="타석 (PA)" value={raw.pa} />
          <CountingRow label="타수 (AB)" value={raw.ab} />
          <CountingRow label="안타 (H)" value={raw.hits} />
          <CountingRow label="1B / 2B / 3B / HR" value={`${raw.singles} / ${raw.doubles} / ${raw.triples} / ${raw.hr}`} />
          <CountingRow label="볼넷 (BB)" value={raw.bb} />
          <CountingRow label="삼진 (K)" value={raw.k} />
          <CountingRow label="타점 (RBI)" value={raw.rbi} />
          <CountingRow label="득점 (R)" value={raw.runs} />
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          wOBA·wRC+는 FanGraphs 가중 출루율 기준. wRC+ 100 = 리그 평균.
        </p>
      </div>
    )
  }

  if (isPitcher(player) && player.seasonStats.type === 'pitcher') {
    const raw = player.seasonStats
    const s = pitcherSabermetrics(raw, lgPit)

    if (raw.outs === 0) {
      return (
        <div className="bm-card p-4 text-sm text-[var(--text-muted)]">
          아직 시즌 기록이 없습니다. 경기를 진행하면 세이버매트릭스 스탯이 집계됩니다.
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="bm-card p-4">
          <h3 className="mb-3 font-semibold text-[var(--text-h)]">세이버매트릭스 — 투구</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            <StatCell label="FIP" value={s.fip} highlight />
            <StatCell label="xFIP" value={s.xfip} highlight />
            <StatCell label="ERA" value={s.era} />
            <StatCell label="WHIP" value={s.whip} />
            <StatCell label="IP" value={s.ip} />
            <StatCell label="K/9" value={s.k9} />
            <StatCell label="BB/9" value={s.bb9} />
            <StatCell label="HR/9" value={s.hr9} />
            <StatCell label="K%" value={`${s.kPct}%`} />
            <StatCell label="BB%" value={`${s.bbPct}%`} />
          </div>
        </div>

        <div className="bm-card p-4">
          <h3 className="mb-2 font-semibold text-[var(--text-h)]">시즌 누적 기록</h3>
          <CountingRow label="경기 / 선발" value={`${raw.games} / ${raw.gs}`} />
          <CountingRow label="승 / 패" value={`${raw.wins} / ${raw.losses}`} />
          <CountingRow label="이닝 (IP)" value={s.ip} />
          <CountingRow label="피안타 (H)" value={raw.h} />
          <CountingRow label="실점 / 자책" value={`${raw.r} / ${raw.er}`} />
          <CountingRow label="볼넷 (BB)" value={raw.bb} />
          <CountingRow label="삼진 (K)" value={raw.k} />
          <CountingRow label="피홈런 (HR)" value={raw.hr} />
          <CountingRow label="상대 타자 (BF)" value={raw.bf} />
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          FIP·xFIP는 수비 무관 투수 성적 지표. xFIP는 리그 평균 HR/9를 적용합니다.
        </p>
      </div>
    )
  }

  return null
}

export function SabermetricsBadge({ player }: { player: Player }) {
  const { state } = useGame()
  if (!state) return null

  if (!isPitcher(player) && player.seasonStats.type === 'batter' && player.seasonStats.pa > 0) {
    const s = batterSabermetrics(player.seasonStats, leagueBattingRates(state.teams))
    return <span className="text-xs text-[var(--text-muted)]">wOBA {s.woba} · OPS {s.ops}</span>
  }

  if (isPitcher(player) && player.seasonStats.type === 'pitcher' && player.seasonStats.outs > 0) {
    const s = pitcherSabermetrics(player.seasonStats, leaguePitchingRates(state.teams))
    return <span className="text-xs text-[var(--text-muted)]">FIP {s.fip} · WHIP {s.whip}</span>
  }

  return <span className="text-xs text-[var(--text-muted)]">기록 없음</span>
}
