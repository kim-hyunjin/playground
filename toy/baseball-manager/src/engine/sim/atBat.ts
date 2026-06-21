import type { AtBatOutcome, Player } from '../../types/game'
import { LEAGUE_STRENGTH, type SimContext } from './context'
import { AT_BAT_TUNING as T } from './atBatConstants'
import { batterSideForMatchup, inferBats, inferThrows, platoonMultiplier } from './handedness'
import { pickContactOutcome, type AtBatSituation } from './atBatSituation'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function effectiveBatterSkills(batter: Player, ctx: SimContext) {
  const fatigue = batter.fatigue
  const mult = LEAGUE_STRENGTH[ctx.leagueLevel].batterMult
  const contact = batter.contact * mult * (1 - fatigue / 200)
  const power = batter.power * mult * (1 - fatigue / 200)
  const eye = batter.eye * mult
  return { contact, power, eye }
}

function effectivePitcherSkills(pitcher: Player, ctx: SimContext) {
  const mult = LEAGUE_STRENGTH[ctx.leagueLevel].pitcherMult
  return {
    velocity: pitcher.velocity * mult,
    control: pitcher.control * mult,
    movement: pitcher.movement * mult,
  }
}

export function resolveAtBat(
  batter: Player,
  pitcher: Player,
  ctx: SimContext,
  rand = Math.random,
  situation?: AtBatSituation,
  defenseFielding = 50,
): AtBatOutcome {
  const { contact, power, eye } = effectiveBatterSkills(batter, ctx)
  const pitch = effectivePitcherSkills(pitcher, ctx)
  const pitchSkill = (pitch.velocity + pitch.control + pitch.movement) / 3

  const batterSide = batterSideForMatchup(inferBats(batter), inferThrows(pitcher))
  const platoon = platoonMultiplier(batterSide, inferThrows(pitcher))
  const adjContact = contact * platoon.contact
  const adjPower = power * platoon.power

  const kRate = clamp((pitchSkill - adjContact * 0.55) / T.kDivisor, T.kMin, T.kMax)
  const bbRate = clamp((eye - pitch.control * 0.5) / T.bbDivisor, T.bbMin, T.bbMax)

  const r = rand()
  if (r < kRate) return 'strikeout'
  if (r < kRate + bbRate) return 'walk'

  const contactRoll = rand() * 100
  const contactThreshold = clamp(
    T.contactBase - (adjContact - pitchSkill) * T.contactSkillScale,
    T.contactThresholdMin,
    T.contactThresholdMax,
  )

  if (contactRoll > contactThreshold) {
    if (situation) {
      return pickContactOutcome(true, batter.speed, defenseFielding, situation, rand)
    }
    return 'out'
  }

  const { hrFactor, runFactor } = ctx.park
  const powerRoll = rand() * 100
  const hrThreshold = clamp(
    T.hrBase - adjPower * T.hrPowerScale * hrFactor,
    T.hrMin,
    T.hrMax,
  )
  if (powerRoll > hrThreshold) return 'homerun'

  const extraBase = rand() * 100
  const runBoost = (runFactor - 1) * 8
  if (extraBase > T.tripleGate - adjPower * T.triplePowerScale - runBoost) return 'triple'
  if (extraBase > T.doubleGate - adjPower * T.doublePowerScale - runBoost) return 'double'
  return 'single'
}

/** 수비 팀 평균 fielding (비투수) */
export function teamDefenseFielding(team: Player[]): number {
  const fielders = team.filter((p) => p.role !== 'SP' && p.role !== 'RP')
  if (fielders.length === 0) return 50
  return fielders.reduce((s, p) => s + p.fielding, 0) / fielders.length
}
