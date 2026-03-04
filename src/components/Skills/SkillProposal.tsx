/**
 * SkillProposal — Pattern Detection Notification
 *
 * This proves Claim #5: The Skill Flywheel.
 * After 3 repetitions of a pattern, propose upgrading to Tier 0.
 *
 * When approved:
 * - Future matches skip cloud inference entirely
 * - Cost drops to $0.00
 * - Sovereignty becomes 100% local
 */

import { useSkillProposal, useAppDispatch } from '../../state/context'

export function SkillProposal() {
  const proposal = useSkillProposal()
  const dispatch = useAppDispatch()

  if (!proposal.active) return null

  return (
    <div className="fixed bottom-24 right-8 w-80 bg-slate-900 border border-tier-0 rounded-lg shadow-lg shadow-tier-0/20 p-4 animate-slide-up">
      <div className="flex items-center gap-2 text-tier-0 font-medium mb-2">
        <span>⚡</span>
        <span>Pattern Detected!</span>
      </div>

      <p className="text-sm text-slate-300 mb-3">
        I've seen <strong className="text-white">{proposal.intent}</strong> {proposal.count} times.
        Want to turn this into a cached skill?
      </p>

      <div className="text-xs bg-slate-800 rounded p-2 mb-3">
        <div className="text-slate-400 mb-1">Proposed skill:</div>
        <div className="text-slate-200 font-mono">{proposal.pattern}</div>
      </div>

      <div className="text-xs text-slate-500 mb-3">
        <span className="text-green-400">↓</span> Tier 2 → Tier 0{' '}
        <span className="text-slate-600">|</span>{' '}
        <span className="text-green-400">$0.01 → $0.00</span>{' '}
        <span className="text-slate-600">|</span>{' '}
        <span className="text-green-400">☁️ → 🏠</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'APPROVE_SKILL' })}
          className="flex-1 bg-tier-0 hover:bg-tier-0/80 text-slate-900 font-medium py-2 rounded text-sm transition-colors"
        >
          Create Skill
        </button>
        <button
          onClick={() => dispatch({ type: 'REJECT_SKILL' })}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm transition-colors"
        >
          Not Now
        </button>
      </div>
    </div>
  )
}
