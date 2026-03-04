/**
 * SkillsList — Active Skills Display
 *
 * Shows the skills that have been learned (promoted to Tier 0).
 * Each skill shows: pattern, times fired, cumulative savings.
 */

import { useSkills } from '../../state/context'

export function SkillsList() {
  const skills = useSkills()

  if (skills.length === 0) return null

  return (
    <div className="p-4 border-t border-slate-700">
      <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
        <span>⚡</span>
        <span>Active Skills ({skills.length})</span>
      </div>

      <div className="space-y-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-slate-800/50 border border-tier-0/30 rounded px-3 py-2"
          >
            <div className="text-xs text-tier-0 font-medium">
              {skill.intentMatch}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {skill.timesFired} fires → saved ${skill.cumulativeSavings.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
