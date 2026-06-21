import kia from './kia.json' with { type: 'json' }
import nc from './nc.json' with { type: 'json' }
import ssg from './ssg.json' with { type: 'json' }
import wo from './wo.json' with { type: 'json' }
import kt from './kt.json' with { type: 'json' }
import ds from './ds.json' with { type: 'json' }
import lg from './lg.json' with { type: 'json' }
import lt from './lt.json' with { type: 'json' }
import hh from './hh.json' with { type: 'json' }
import ss from './ss.json' with { type: 'json' }
import type { TeamRosterFile } from '../../../types'

/** KBO sync 자동 생성 — npm run kbo:sync-roster */
export const ROSTERS_KBO: TeamRosterFile[] = [
  kia as TeamRosterFile,
  nc as TeamRosterFile,
  ssg as TeamRosterFile,
  wo as TeamRosterFile,
  kt as TeamRosterFile,
  ds as TeamRosterFile,
  lg as TeamRosterFile,
  lt as TeamRosterFile,
  hh as TeamRosterFile,
  ss as TeamRosterFile,
]
