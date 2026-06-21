import type { TeamRosterFile } from '../../../types'
import { ds2026 } from './ds'
import { hh2026 } from './hh'
import { kia2026 } from './kia'
import { kt2026 } from './kt'
import { lg2026 } from './lg'
import { lt2026 } from './lt'
import { nc2026 } from './nc'
import { ss2026 } from './ss'
import { ssg2026 } from './ssg'
import { wo2026 } from './wo'

/** 2026 KBO 10팀 실명 로스터 (1군 26 + 2군 partial) */
export const ROSTERS_2026: TeamRosterFile[] = [
  kia2026,
  nc2026,
  ssg2026,
  wo2026,
  kt2026,
  ds2026,
  lg2026,
  lt2026,
  hh2026,
  ss2026,
]
