/**
 * ModelConfigPanel — API Key Configuration
 *
 * Appears when Interactive mode is selected.
 * Dropdown-based per-tier configuration with "Apply to all" option.
 * API keys are stored in memory only (never persisted).
 */

import { useState } from 'react'
import { useAppState, useAppDispatch } from '../../state/context'

const TIER_OPTIONS = [
  { value: 1 as const, label: 'T1: Cheap', model: 'claude-3-haiku' },
  { value: 2 as const, label: 'T2: Premium', model: 'claude-sonnet-4' },
  { value: 3 as const, label: 'T3: Apex', model: 'claude-opus-4' },
]

const PROVIDER_OPTIONS = [
  { value: 'anthropic', label: 'Anthropic' },
  // Future: { value: 'openai', label: 'OpenAI' },
]

export function ModelConfigPanel() {
  const { mode, modelConfig } = useAppState()
  const dispatch = useAppDispatch()
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1)
  const [applyToAll, setApplyToAll] = useState(true)

  if (mode !== 'interactive') return null

  const currentConfig = modelConfig[`tier${selectedTier}` as keyof typeof modelConfig]

  const handleKeyChange = (apiKey: string) => {
    if (applyToAll) {
      dispatch({ type: 'SET_ALL_MODEL_CONFIGS', config: { apiKey } })
    } else {
      dispatch({ type: 'SET_MODEL_CONFIG', tier: selectedTier, config: { apiKey } })
    }
  }

  const handleProviderChange = (provider: string) => {
    if (applyToAll) {
      dispatch({ type: 'SET_ALL_MODEL_CONFIGS', config: { provider } })
    } else {
      dispatch({ type: 'SET_MODEL_CONFIG', tier: selectedTier, config: { provider } })
    }
  }

  // Status: which tiers have keys set
  const t1Set = !!modelConfig.tier1.apiKey
  const t2Set = !!modelConfig.tier2.apiKey
  const t3Set = !!modelConfig.tier3.apiKey

  return (
    <div className="border-b border-slate-700 bg-slate-800/50 px-6 py-3">
      <div className="flex items-center gap-6 text-sm">
        {/* Tier Selector */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-xs">Tier:</label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(Number(e.target.value) as 1 | 2 | 3)}
            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
          >
            {TIER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.model})
              </option>
            ))}
          </select>
        </div>

        {/* Apply to All */}
        <label className="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={applyToAll}
            onChange={(e) => setApplyToAll(e.target.checked)}
            className="rounded border-slate-600"
          />
          Apply to all
        </label>

        {/* Provider Selector */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-xs">Provider:</label>
          <select
            value={currentConfig.provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
          >
            {PROVIDER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* API Key Input */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-xs">Key:</label>
          <input
            type="password"
            placeholder="sk-ant-..."
            value={currentConfig.apiKey || ''}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs w-40 text-white placeholder-slate-500"
          />
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 text-xs ml-auto">
          <span className={t1Set ? 'text-green-400' : 'text-slate-500'}>
            T1 {t1Set ? '✓' : '○'}
          </span>
          <span className={t2Set ? 'text-green-400' : 'text-slate-500'}>
            T2 {t2Set ? '✓' : '○'}
          </span>
          <span className={t3Set ? 'text-green-400' : 'text-slate-500'}>
            T3 {t3Set ? '✓' : '○'}
          </span>
        </div>
      </div>
    </div>
  )
}
