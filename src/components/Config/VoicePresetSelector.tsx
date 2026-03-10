/**
 * VoicePresetSelector — The Demo Moment
 *
 * Select preset → next scan → visibly different output.
 * This proves declarative governance without code changes.
 *
 * Three presets:
 * - Strategic Analyst: Lead with insight, no hedging
 * - Executive Brief: BLUF, 3 bullets max
 * - Operator Log: Terse, facts only, timestamps
 */

import { VOICE_PRESETS, type VoicePresetId } from '../../config/voice-presets'

interface VoicePresetSelectorProps {
  currentPreset: VoicePresetId
  onPresetChange: (preset: VoicePresetId) => void
}

export function VoicePresetSelector({ currentPreset, onPresetChange }: VoicePresetSelectorProps) {
  const presets = Object.values(VOICE_PRESETS)
  const activePreset = VOICE_PRESETS[currentPreset]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-mono text-sm font-medium text-grove-text flex items-center gap-2">
          <span className="text-grove-amber">◈</span>
          Voice Presets
        </h2>
        <p className="font-mono text-xs text-grove-text-dim mt-1">
          Control HOW briefings are written. Select a preset, run a scan, see the difference.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="space-y-3 mb-6">
        {presets.map(preset => (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset.id)}
            className={`
              w-full text-left p-4 border transition-all duration-200
              ${currentPreset === preset.id
                ? 'border-grove-amber bg-grove-amber/10'
                : 'border-grove-border hover:border-grove-border-light bg-grove-bg2 hover:bg-grove-bg3'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Radio indicator */}
              <div className={`
                w-4 h-4 border-2 flex items-center justify-center
                ${currentPreset === preset.id
                  ? 'border-grove-amber'
                  : 'border-grove-border'
                }
              `}>
                {currentPreset === preset.id && (
                  <div className="w-2 h-2 bg-grove-amber" />
                )}
              </div>

              {/* Preset info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`
                    font-mono text-sm font-medium
                    ${currentPreset === preset.id ? 'text-grove-amber' : 'text-grove-text'}
                  `}>
                    {preset.name}
                  </span>
                  {currentPreset === preset.id && (
                    <span className="text-[10px] font-mono text-grove-amber bg-grove-amber/20 px-1.5 py-0.5">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-grove-text-dim mt-0.5">
                  {preset.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Live Preview */}
      <div className="border border-grove-border bg-grove-bg">
        <div className="px-4 py-2 border-b border-grove-border bg-grove-bg2 flex items-center gap-2">
          <span className="text-grove-green text-xs">●</span>
          <span className="font-mono text-[10px] text-grove-text-dim uppercase tracking-wider">
            Live Preview — {activePreset.name}
          </span>
        </div>
        <div className="p-4">
          <p className="font-mono text-sm text-grove-text whitespace-pre-wrap leading-relaxed">
            {activePreset.preview}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 border-t border-grove-border pt-4">
        <h3 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-3">
          Voice Instructions
        </h3>
        <ul className="space-y-2">
          {activePreset.instructions.map((instruction, i) => (
            <li key={i} className="flex gap-2 text-xs font-mono">
              <span className="text-grove-amber shrink-0">{i + 1}.</span>
              <span className="text-grove-text-mid">{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Call to action */}
      <div className="mt-6 p-4 border border-dashed border-grove-border bg-grove-bg2/50 text-center">
        <p className="font-mono text-xs text-grove-text-dim">
          Switch to <span className="text-grove-amber">Inbox</span> and run a scan.
          <br />
          The briefing will reflect this voice preset.
        </p>
      </div>
    </div>
  )
}
