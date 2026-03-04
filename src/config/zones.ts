/**
 * Zone Schema — Sovereignty Guardrails
 *
 * The three zones define the governance model:
 * - GREEN: System executes autonomously
 * - YELLOW: System proposes, human approves
 * - RED: Human-only, system surfaces information
 *
 * This is what makes the Autonomaton pattern different from "AI that does things."
 * The zones are the guardrails. The human stays in control.
 */

import type { ZonesSchema } from '../state/types'

export const defaultZonesSchema: ZonesSchema = {
  zones: {
    green: {
      meaning: 'Autonomous Routine',
      allows: [
        'execute_confirmed_skills',
        'write_telemetry',
        'update_pattern_counts',
      ],
      description: 'System executes without asking. Confirmed patterns, low-risk operations.',
    },

    yellow: {
      meaning: 'Supervised Proposals',
      allows: [
        'propose_new_skill',
        'propose_rule_change',
        'draft_content',
        'analyze_data',
      ],
      description: 'System proposes, human approves. Medium-risk operations.',
    },

    red: {
      meaning: 'Human-Only',
      allows: [
        'surface_information_only',
      ],
      description: 'System surfaces info and waits. Architecture decisions, security changes, destructive operations.',
    },
  },
}

/**
 * Serialize zones schema to YAML-like string for display
 */
export function serializeZonesSchema(schema: ZonesSchema): string {
  let yaml = 'zones:\n'

  for (const [name, zone] of Object.entries(schema.zones)) {
    yaml += `  ${name}:\n`
    yaml += `    meaning: "${zone.meaning}"\n`
    yaml += `    description: "${zone.description}"\n`
    yaml += `    allows:\n`
    for (const action of zone.allows) {
      yaml += `      - ${action}\n`
    }
  }

  return yaml
}

/**
 * Get zone color class for consistent styling
 */
export function getZoneColorClass(zone: 'green' | 'yellow' | 'red'): string {
  return `zone-${zone}`
}

/**
 * Get zone description for UI display
 */
export function getZoneLabel(zone: 'green' | 'yellow' | 'red'): string {
  const labels = {
    green: 'Autonomous',
    yellow: 'Supervised',
    red: 'Human-Only',
  }
  return labels[zone]
}
