/**
 * Model Configuration — Provider Options
 *
 * Lists available providers and models for tier configuration.
 */

export const PROVIDERS = ['anthropic', 'openai', 'google', 'local_memory'] as const
export type Provider = (typeof PROVIDERS)[number]

export const MODELS: Record<Provider, string[]> = {
  anthropic: [
    'claude-opus-4-20250514',
    'claude-sonnet-4-20250514',
    'claude-3-haiku-20240307',
  ],
  openai: [
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
  ],
  google: [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
  ],
  local_memory: [
    'cached_skill',
  ],
}

/**
 * Serialize model config to YAML-like string for display
 */
export function serializeModelsConfig(state: {
  modelConfig: {
    tier0: { provider: string; model: string; apiKey: string | null }
    tier1: { provider: string; model: string; apiKey: string | null }
    tier2: { provider: string; model: string; apiKey: string | null }
    tier3: { provider: string; model: string; apiKey: string | null }
  }
}): string {
  const { modelConfig } = state

  const maskKey = (key: string | null): string => {
    if (!key) return 'NOT_SET'
    if (key.length <= 8) return '••••••••'
    return key.slice(0, 7) + '••••' + key.slice(-4)
  }

  return `# MODEL CONFIGURATION
# Configure provider and model for each tier.
# API keys are stored locally in browser.

tiers:
  tier0:
    provider: ${modelConfig.tier0.provider}
    model: ${modelConfig.tier0.model}
    api_key: ${maskKey(modelConfig.tier0.apiKey)}

  tier1:
    provider: ${modelConfig.tier1.provider}
    model: ${modelConfig.tier1.model}
    api_key: ${maskKey(modelConfig.tier1.apiKey)}

  tier2:
    provider: ${modelConfig.tier2.provider}
    model: ${modelConfig.tier2.model}
    api_key: ${maskKey(modelConfig.tier2.apiKey)}

  tier3:
    provider: ${modelConfig.tier3.provider}
    model: ${modelConfig.tier3.model}
    api_key: ${maskKey(modelConfig.tier3.apiKey)}
`
}

/**
 * Parse model config from YAML-like string
 * Preserves masked API keys (doesn't overwrite with mask)
 */
export function parseModelsConfig(
  yaml: string,
  currentConfig: {
    tier0: { provider: string; model: string; apiKey: string | null }
    tier1: { provider: string; model: string; apiKey: string | null }
    tier2: { provider: string; model: string; apiKey: string | null }
    tier3: { provider: string; model: string; apiKey: string | null }
  }
): { modelConfig: typeof currentConfig } | { error: string } {
  try {
    const result = { ...currentConfig }
    const lines = yaml.split('\n')
    let currentTier: keyof typeof result | null = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      // Tier header
      const tierMatch = line.match(/^\s{2}(tier[0-3]):$/)
      if (tierMatch) {
        currentTier = tierMatch[1] as keyof typeof result
        continue
      }

      // Property
      if (currentTier) {
        const propMatch = line.match(/^\s{4}(\w+): (.+)$/)
        if (propMatch) {
          const [, key, value] = propMatch
          const tier = result[currentTier]

          if (key === 'provider') {
            tier.provider = value
          } else if (key === 'model') {
            tier.model = value
          } else if (key === 'api_key') {
            // Don't overwrite with masked value
            if (!value.includes('••••') && value !== 'NOT_SET') {
              tier.apiKey = value
            }
          }
        }
      }
    }

    return { modelConfig: result }
  } catch (e) {
    return { error: `Parse error: ${e}` }
  }
}
