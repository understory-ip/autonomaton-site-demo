/**
 * Zone Engine — Config-Driven Governance
 *
 * This module ENFORCES zones. It does NOT define thresholds.
 * Thresholds come from recipe configuration.
 *
 * The zone engine:
 * - Takes threshold config as INPUT
 * - Determines zone based on delta and config
 * - Serializes schema for config editor display
 * - Provides zone utilities (color, label)
 */

import type { Zone, ZonesSchema } from '../state/types'

/**
 * Default zone schema — minimal skeleton for base autonomaton
 * Recipes override this with their own zone configuration
 */
export const defaultZonesSchema: ZonesSchema = {
  zones: {
    green: {
      meaning: 'Routine',
      flywheel_eligible: true,
      thresholds: {
        maxDelta: 0.05,  // Default: < 5% delta
      },
      allows: ['log_telemetry', 'execute_skills'],
      forbids: [],
      description: 'Routine operations. System executes autonomously.',
    },
    yellow: {
      meaning: 'Approval Required',
      flywheel_eligible: true,
      thresholds: {
        minDelta: 0.05,
        maxDelta: 0.15,
      },
      allows: ['draft_analysis', 'request_review'],
      requiresApproval: ['apply_changes'],
      description: 'Significant action. System proposes, human approves.',
    },
    red: {
      meaning: 'Human Decision',
      flywheel_eligible: false,
      thresholds: {
        minDelta: 0.15,
      },
      allows: ['surface_options'],
      requiresHumanDecision: true,
      forbids: ['auto_execute'],
      description: 'Critical decision. Human judgment required.',
    },
  },
}

/**
 * Determine zone based on delta and configured thresholds
 *
 * @param delta - The magnitude of change (absolute value used)
 * @param schema - Zone schema with thresholds (from recipe config)
 * @param additionalTriggers - Optional triggers (e.g., { critical: true })
 */
export function determineZone(
  delta: number,
  schema: ZonesSchema,
  additionalTriggers?: { critical?: boolean; tierCrossing?: boolean }
): Zone {
  const absDelta = Math.abs(delta)
  const { green, yellow, red } = schema.zones

  // RED zone triggers (any one of these)
  if (additionalTriggers?.critical) return 'red'
  if (additionalTriggers?.tierCrossing) return 'red'
  if (red.thresholds?.minDelta !== undefined && absDelta >= red.thresholds.minDelta) {
    return 'red'
  }

  // YELLOW zone triggers
  if (yellow.thresholds?.minDelta !== undefined && absDelta >= yellow.thresholds.minDelta) {
    if (yellow.thresholds?.maxDelta === undefined || absDelta < yellow.thresholds.maxDelta) {
      return 'yellow'
    }
  }

  // GREEN zone (default)
  if (green.thresholds?.maxDelta !== undefined && absDelta < green.thresholds.maxDelta) {
    return 'green'
  }

  // Fallback: if delta is small, green; otherwise yellow
  return absDelta < 0.05 ? 'green' : 'yellow'
}

/**
 * Check if an action is allowed in a zone
 */
export function isActionAllowed(action: string, zone: Zone, schema: ZonesSchema): boolean {
  const zoneDef = schema.zones[zone]
  if (zoneDef.forbids?.includes(action)) return false
  if (zoneDef.allows.includes(action)) return true
  return false
}

/**
 * Check if an action requires approval in a zone
 */
export function requiresApproval(action: string, zone: Zone, schema: ZonesSchema): boolean {
  const zoneDef = schema.zones[zone]
  if (zoneDef.requiresHumanDecision) return true
  return zoneDef.requiresApproval?.includes(action) ?? false
}

/**
 * Check if zone allows flywheel skill promotion
 */
export function isFlywheelEligible(zone: Zone, schema: ZonesSchema): boolean {
  return schema.zones[zone].flywheel_eligible
}

/**
 * Serialize zones schema to YAML-like string for display
 */
export function serializeZonesSchema(schema: ZonesSchema): string {
  let yaml = `# ZONE GOVERNANCE SCHEMA
#
# Zone thresholds are CONFIG-DRIVEN.
# Edit zone-thresholds.yaml in your recipe to customize.
#
# Key Rules:
#   - GREEN zone operations can become skills (flywheel eligible)
#   - YELLOW zone operations require human approval
#   - RED zone operations NEVER become skills (governance lock)

zones:
`

  for (const [name, zone] of Object.entries(schema.zones)) {
    yaml += `  ${name}:\n`
    yaml += `    meaning: "${zone.meaning}"\n`
    yaml += `    flywheel_eligible: ${zone.flywheel_eligible}\n`
    yaml += `    description: "${zone.description}"\n`
    if (zone.thresholds) {
      yaml += `    thresholds:\n`
      for (const [key, value] of Object.entries(zone.thresholds)) {
        yaml += `      ${key}: ${value}\n`
      }
    }
    yaml += `    allows:\n`
    for (const action of zone.allows) {
      yaml += `      - ${action}\n`
    }
    if (zone.forbids && zone.forbids.length > 0) {
      yaml += `    forbids:\n`
      for (const action of zone.forbids) {
        yaml += `      - ${action}\n`
      }
    }
    if (zone.requiresApproval && zone.requiresApproval.length > 0) {
      yaml += `    requires_approval:\n`
      for (const action of zone.requiresApproval) {
        yaml += `      - ${action}\n`
      }
    }
  }

  return yaml
}

/**
 * Get zone color class for consistent styling
 */
export function getZoneColorClass(zone: Zone): string {
  return `zone-${zone}`
}

/**
 * Get zone label for UI display
 */
export function getZoneLabel(zone: Zone): string {
  const labels: Record<Zone, string> = {
    green: 'Routine',
    yellow: 'Review',
    red: 'Decision',
  }
  return labels[zone]
}

/**
 * Get zone threshold description for UI
 */
export function getZoneThresholdLabel(zone: Zone, schema: ZonesSchema): string {
  const thresholds = schema.zones[zone].thresholds
  if (!thresholds) return ''

  const min = thresholds.minDelta
  const max = thresholds.maxDelta

  if (max !== undefined && min === undefined) {
    return `< ${(max * 100).toFixed(0)}%`
  }
  if (min !== undefined && max !== undefined) {
    return `${(min * 100).toFixed(0)}% – ${(max * 100).toFixed(0)}%`
  }
  if (min !== undefined && max === undefined) {
    return `>= ${(min * 100).toFixed(0)}%`
  }
  return ''
}
