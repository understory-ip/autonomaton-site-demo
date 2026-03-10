/**
 * Core Services — Public API
 *
 * Export all core services for use by recipes and the main app.
 */

// Cognitive Adapter — Model Independence
export {
  executeCognitiveRequest,
  executeResearchRequest,
  streamCognitiveRequest,
  type CognitiveResult,
  type ResearchResult,
} from './CognitiveAdapter'

// Cognitive Router — Intent Classification
export {
  classifyIntent,
  shouldProposeSkill,
  categorizeDelta,
  generatePatternDescription,
  type RoutingDecision,
} from './cognitive-router'

// Pipeline Orchestrator — Interaction Lifecycle
export {
  processInteraction,
  completeExecution,
  continueAfterApproval,
  rejectInteraction,
  registerResponseGenerator,
  resetResponseGenerator,
  type ResponseGenerator,
} from './pipeline-orchestrator'
