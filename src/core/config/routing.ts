/**
 * Core Routing Configuration — Generic Defaults
 *
 * This provides a minimal routing config for the base autonomaton.
 * Recipes override this with their domain-specific intents.
 */

import type { RoutingConfig } from '../state/types'

/**
 * Default routing config — minimal skeleton
 * Recipes provide their own intents via routing-overrides.yaml
 */
export const defaultRoutingConfig: RoutingConfig = {
  // Skill flywheel configuration
  skillPromotion: {
    afterNApprovals: 5,        // 5 approvals before skill promotion
    promotableTiers: [1, 2],   // Tiers eligible for promotion to Tier 0
  },

  intents: {
    // =========================================================================
    // TIER 0 — Cached Skills (Local, Instant, Free)
    // =========================================================================
    execute_skill: {
      tier: 0,
      zone: 'green',
      description: 'Execute cached skill pattern',
      keywords: [],  // Programmatic only
    },

    log_telemetry: {
      tier: 0,
      zone: 'green',
      description: 'Write telemetry entry to audit ledger',
      keywords: [],  // Programmatic only
    },

    // =========================================================================
    // TIER 1 — Fast Classification
    // =========================================================================
    quick_classify: {
      tier: 1,
      zone: 'green',
      description: 'Quick classification of input',
      keywords: ['classify', 'categorize', 'tag'],
    },

    // =========================================================================
    // TIER 2 — Standard Analysis
    // =========================================================================
    analyze: {
      tier: 2,
      zone: 'yellow',
      description: 'Standard analysis request',
      keywords: ['analyze', 'review', 'examine'],
    },

    // =========================================================================
    // TIER 3 — Deep Analysis
    // =========================================================================
    deep_analysis: {
      tier: 3,
      zone: 'yellow',
      description: 'Deep analysis requiring apex model',
      keywords: ['deep', 'strategic', 'comprehensive'],
    },

    // =========================================================================
    // FALLBACK
    // =========================================================================
    ad_hoc_query: {
      tier: 2,
      zone: 'yellow',
      description: 'Unmapped query',
      keywords: [],  // Fallback for unmatched input
    },
  },
}

/**
 * Serialize config to YAML-like string for display
 */
export function serializeRoutingConfig(config: RoutingConfig): string {
  let yaml = '# ROUTING CONFIGURATION\n'
  yaml += '# Recipes override this with domain-specific intents.\n\n'

  if (config.skillPromotion) {
    yaml += '# SKILL FLYWHEEL\n'
    yaml += `skill_promotion:\n`
    yaml += `  after_n_approvals: ${config.skillPromotion.afterNApprovals}\n`
    yaml += `  promotable_tiers: [${config.skillPromotion.promotableTiers.join(', ')}]\n\n`
  }

  yaml += 'intents:\n'

  for (const [name, intent] of Object.entries(config.intents)) {
    yaml += `  ${name}:\n`
    yaml += `    tier: ${intent.tier}\n`
    yaml += `    zone: ${intent.zone}\n`
    yaml += `    description: "${intent.description}"\n`
  }

  return yaml
}

/**
 * Parse YAML-like string back to config object
 * Simple parser for demo — not a full YAML implementation
 */
export function parseRoutingConfig(yaml: string, baseConfig?: RoutingConfig): RoutingConfig | { error: string } {
  try {
    const config: RoutingConfig = {
      intents: {},
      skillPromotion: baseConfig?.skillPromotion,
    }
    const lines = yaml.split('\n')
    let currentIntent: string | null = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed === 'intents:' || trimmed.startsWith('#')) continue

      // Intent name: exactly 2-space indent, word characters only, ends with colon
      const intentMatch = line.match(/^  (\w+):$/)
      if (intentMatch) {
        currentIntent = intentMatch[1]
        config.intents[currentIntent] = {
          tier: 1,
          zone: 'green',
          description: '',
          keywords: baseConfig?.intents[currentIntent]?.keywords || [],
        }
        continue
      }

      // Property: exactly 4-space indent, "key: value" format
      if (currentIntent) {
        const propMatch = line.match(/^    (\w+): (.+)$/)
        if (propMatch) {
          const [, key, value] = propMatch
          const intent = config.intents[currentIntent]

          if (key === 'tier') {
            const tier = parseInt(value)
            if (tier >= 0 && tier <= 3) intent.tier = tier as 0 | 1 | 2 | 3
          } else if (key === 'zone') {
            if (['green', 'yellow', 'red'].includes(value)) {
              intent.zone = value as 'green' | 'yellow' | 'red'
            }
          } else if (key === 'description') {
            intent.description = value.replace(/^"|"$/g, '')
          }
        }
      }
    }

    return config
  } catch (e) {
    return { error: `Parse error: ${e}` }
  }
}
