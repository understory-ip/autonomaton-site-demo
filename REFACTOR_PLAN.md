# Signal Watch → Base Autonomaton + Recipe Refactor

## Architecture Overview

```
/src/
├── core/                    # BASE AUTONOMATON (Foundry output)
│   ├── services/            # Pipeline, routing, cognitive adapter
│   ├── state/               # Reducer, types, context (with extension points)
│   ├── config/              # Generic config schemas
│   ├── components/          # UI shell, pipeline viz, telemetry, config editor
│   └── utils/               # Provenance, hashing
│
├── recipes/
│   └── signal-watch/        # RECIPE (domain-specific layer)
│       ├── recipe.yaml      # Manifest
│       ├── config/          # Watchlist, voice presets, routing overrides
│       ├── prompts/         # Recognition, compilation, analysis prompts
│       ├── components/      # SubjectCard, RatchetChart, BriefingCard
│       ├── theme/           # Grove palette, typography
│       └── seed/            # Sample data for first run
│
└── main.tsx                 # Bootstrap: load recipe, mount app
```

---

## FILE-BY-FILE MAPPING

### Legend
- **CORE** = Move to `/src/core/`
- **RECIPE** = Move to `/recipes/signal-watch/`
- **SPLIT** = Extract core logic vs domain-specific content
- **DELETE** = Remove (unused or redundant)

---

## SERVICES (`/src/services/`)

| Current File | Destination | Notes |
|-------------|-------------|-------|
| `CognitiveAdapter.ts` | **CORE** `/src/core/services/CognitiveAdapter.ts` | 100% generic - provider factory (Anthropic, OpenAI, Google) |
| `pipeline-orchestrator.ts` | **CORE** `/src/core/services/pipeline-orchestrator.ts` | 100% generic - 5-stage pipeline, Jidoka halts |
| `cognitive-router.ts` | **SPLIT** | **CORE**: `classifyIntent()`, `shouldProposeSkill()` logic. **RECIPE**: `generatePatternDescription()` patterns, `getAdjustmentPatternKey()`, `getBriefMeOnPatternKey()` |
| `foundry-compiler.ts` | **CORE** `/src/core/services/foundry-compiler.ts` | PRD generator is architectural (Foundry feature) |
| `index.ts` | **SPLIT** | Re-exports need adjustment |

---

## STATE (`/src/state/`)

| Current File | Destination | Notes |
|-------------|-------------|-------|
| `types.ts` | **SPLIT** | See breakdown below |
| `reducer.ts` | **SPLIT** | See breakdown below |
| `context.tsx` | **CORE** `/src/core/state/context.tsx` | With extension point for recipe state |

### `types.ts` Breakdown

**CORE TYPES** → `/src/core/state/types.ts`:
```typescript
// Pipeline
PipelineStage, StageState, PipelineState, HaltReason

// Zones (generic)
Zone, ZoneDefinition, ZonesSchema

// Tiers
Tier, TierConfig

// Routing (generic)
IntentConfig, RoutingConfig, SkillPromotionConfig

// Skills
Skill, SkillProposal

// Interactions (generic)
Interaction, InteractionStatus

// Telemetry (generic)
TelemetryEntry

// Modes
Mode, CurrentView

// Model Config
ModelConfig

// Tutorial
TutorialState, TutorialStep

// Foundry
FoundryState

// Failure Simulation
FailureType

// Metrics (generic)
CostHistoryEntry, TierHistoryEntry, Metrics

// Base App State
BaseAppState (without domain extensions)

// Base Actions
BaseAppAction
```

**RECIPE TYPES** → `/recipes/signal-watch/types.ts`:
```typescript
// Signal Watch specific
SignalLevel
SourceType, SourceConfig, RawSignal, ClassifiedSignal
SubjectTier, SubjectType, WatchlistSubject, Watchlist, WatchlistSubjectMatch
ScoreAdjustment, ScoreHistoryEntry, ZoneThresholds
BriefingType, Briefing, BriefingHighlight, BriefingRecommendation
ProposedSubject, ResearchSection, ResearchSource
DomainConfig (from prompts/domain.template)

// Extended App State
SignalWatchState extends BaseAppState

// Extended Actions
SignalWatchAction extends BaseAppAction
```

### `reducer.ts` Breakdown

**CORE REDUCER** → `/src/core/state/reducer.ts`:
- Pipeline actions (SET_PIPELINE_STAGE, ADVANCE_PIPELINE, RESET_PIPELINE, HALT_PIPELINE)
- Mode actions (SET_MODE, SET_MODEL_CONFIG)
- Config actions (UPDATE_ROUTING_CONFIG, UPDATE_ZONES_SCHEMA, TRIGGER_CONFIG_RIPPLE)
- Interaction actions (SUBMIT_INPUT, APPROVE_INTERACTION, REJECT_INTERACTION, etc.)
- Skill actions (INCREMENT_PATTERN, PROPOSE_SKILL, APPROVE_SKILL, FIRE_SKILL)
- Telemetry actions (ADD_TELEMETRY, SELECT_TELEMETRY)
- Tutorial actions
- Metrics actions
- Deck/View actions
- Foundry actions

**RECIPE REDUCER** → `/recipes/signal-watch/reducer.ts`:
- SET_WATCHLIST, ADD_SIGNAL, ADD_SCORE_ADJUSTMENT
- APPROVE_SCORE_ADJUSTMENT, REJECT_SCORE_ADJUSTMENT
- SET_CURRENT_BRIEFING, UPDATE_SUBJECT_SCORE
- UPDATE_VOICE_PRESET (Signal Watch voice presets)

**EXTENSION POINT**: Core reducer calls `recipeReducer(state, action)` for unhandled actions.

---

## CONFIG (`/src/config/`)

| Current File | Destination | Notes |
|-------------|-------------|-------|
| `tiers.ts` | **CORE** `/src/core/config/tiers.ts` | Generic tier costs/latency |
| `zones.ts` | **SPLIT** | **CORE**: Zone engine (`determineZone()`). **RECIPE**: Specific thresholds (0.05, 0.15), allowed actions |
| `routing.ts` | **RECIPE** `/recipes/signal-watch/config/routing.ts` | Signal Watch intents (ad_hoc_scan, brief_me_on, etc.) |
| `models.ts` | **CORE** `/src/core/config/models.ts` | Provider/model lists |
| `voice-presets.ts` | **RECIPE** `/recipes/signal-watch/config/voice-presets.ts` | Strategic Analyst, Executive Brief, Operator Log |
| `defaults.ts` | **RECIPE** `/recipes/signal-watch/seed/watchlist.ts` | AI competitors watchlist |
| `responses.ts` | **RECIPE** `/recipes/signal-watch/config/demo-responses.ts` | Simulated responses |
| `skills.ts` | **CORE** `/src/core/config/skills.ts` | Generic skill serialization |
| `hero-prompts.ts` | **RECIPE** `/recipes/signal-watch/config/hero-prompts.ts` | Onboarding prompts |
| `prompts.schema.ts` | **CORE** `/src/core/config/prompts.schema.ts` | Generic prompt schema |
| `index.ts` | **SPLIT** | Re-exports need adjustment |

### `/src/config/prompts/`

| Current File | Destination | Notes |
|-------------|-------------|-------|
| `scan.template.ts` | **RECIPE** `/recipes/signal-watch/prompts/scan.template.ts` | Ad-hoc scan prompt |
| `subject.template.ts` | **RECIPE** `/recipes/signal-watch/prompts/subject.template.ts` | Subject research prompt |
| `domain.template.ts` | **RECIPE** `/recipes/signal-watch/prompts/domain.template.ts` | Domain configuration prompt |

### `/src/config/demo/`

| Current File | Destination | Notes |
|-------------|-------------|-------|
| `briefings.ts` | **RECIPE** `/recipes/signal-watch/seed/briefings.ts` | Sample briefings |
| `signals.ts` | **RECIPE** `/recipes/signal-watch/seed/signals.ts` | Sample signals |
| `watchlist.ts` | **RECIPE** `/recipes/signal-watch/seed/watchlist.ts` | Sample subjects |

---

## COMPONENTS

### CORE COMPONENTS → `/src/core/components/`

| Current File | Destination | Notes |
|-------------|-------------|-------|
| **Navigation** | | |
| `Navigation/NavBar.tsx` | **CORE** | View switching (dashboard, briefings, config, flywheel) |
| `Navigation/index.ts` | **CORE** | |
| **Pipeline** | | |
| `Pipeline/PipelineVisualization.tsx` | **CORE** | 5-stage animation |
| `Pipeline/PipelineStage.tsx` | **CORE** | Individual stage |
| `Pipeline/PipelineConnector.tsx` | **CORE** | Stage connectors |
| `Pipeline/index.ts` | **CORE** | |
| **Telemetry** | | |
| `Telemetry/TelemetryStream.tsx` | **CORE** | Audit log viewer |
| `Telemetry/index.ts` | **CORE** | |
| **CommandBar** | | |
| `CommandBar/CommandBar.tsx` | **CORE** | Command input (routes through pipeline) |
| `CommandBar/index.ts` | **CORE** | |
| **Header** | | |
| `Header/Header.tsx` | **CORE** | API key config, logo slot |
| `Header/index.ts` | **CORE** | |
| **Config** | | |
| `Config/ConfigEditor.tsx` | **CORE** | Generic YAML-like config editor |
| `Config/ConfigPanel.tsx` | **SPLIT** | **CORE**: Tab shell, routing tab. **RECIPE**: Watchlist tab, Voice tab, Thresholds tab content |
| `Config/VoicePresetSelector.tsx` | **RECIPE** | Signal Watch voice presets |
| `Config/index.ts` | **SPLIT** | |
| **Flywheel** | | |
| `Flywheel/FlywheelView.tsx` | **CORE** | Skill proposals, active skills, tier distribution |
| `Flywheel/index.ts` | **CORE** | |
| **Skills** | | |
| `Skills/SkillProposalCard.tsx` | **CORE** | Skill proposal UI |
| `Skills/SkillsList.tsx` | **CORE** | Active skills list |
| `Skills/index.ts` | **CORE** | |
| **Dashboard** | | |
| `Dashboard/TierDistribution.tsx` | **CORE** | Generic tier chart |
| **CostEvaporation** | | |
| `CostEvaporation/CostEvaporation.tsx` | **CORE** | Savings notification |
| `CostEvaporation/index.ts` | **CORE** | |
| **Diagnostic** | | |
| `Diagnostic/DiagnosticCard.tsx` | **CORE** | Jidoka halt display |
| **Foundry** | | |
| `Foundry/FoundryPane.tsx` | **CORE** | PRD generator UI |
| `Foundry/index.ts` | **CORE** | |
| **Deck** | | |
| `Deck/*` | **RECIPE** | Slide deck is Signal Watch marketing |

### RECIPE COMPONENTS → `/recipes/signal-watch/components/`

| Current File | Destination | Notes |
|-------------|-------------|-------|
| **Briefing** | | |
| `Briefing/BriefingInbox.tsx` | **RECIPE** | Briefing feed |
| `Briefing/BriefingEntry.tsx` | **RECIPE** | Single briefing card |
| `Briefing/BriefingDetailPane.tsx` | **RECIPE** | Briefing drill-down |
| `Briefing/RedZoneTakeover.tsx` | **RECIPE** | RED zone full-screen approval |
| `Briefing/index.ts` | **RECIPE** | |
| **Dashboard** | | |
| `Dashboard/Dashboard.tsx` | **RECIPE** | Signal Watch dashboard layout |
| `Dashboard/DashboardView.tsx` | **RECIPE** | Dashboard with subject cards |
| `Dashboard/RatchetChart.tsx` | **RECIPE** | Styled cost chart |
| `Dashboard/SubjectCard.tsx` | **RECIPE** | Competitor score card |
| `Dashboard/index.ts` | **RECIPE** | |
| **Watchlist** | | |
| `Watchlist/WatchlistDashboard.tsx` | **RECIPE** | Subject scorecard panel |
| `Watchlist/SubjectCard.tsx` | **RECIPE** | Watchlist subject card |
| `Watchlist/SubjectDetailPane.tsx` | **RECIPE** | Subject drill-down |
| `Watchlist/index.ts` | **RECIPE** | |
| **SignalFeed** | | |
| `SignalFeed/SignalFeed.tsx` | **RECIPE** | Signal list |
| `SignalFeed/SignalCard.tsx` | **RECIPE** | Signal card |
| `SignalFeed/index.ts` | **RECIPE** | |
| **Interaction** | | |
| `Interaction/InteractionPane.tsx` | **RECIPE** | Chat-style interaction |
| `Interaction/MessageRenderer.tsx` | **RECIPE** | Message formatting |
| `Interaction/index.ts` | **RECIPE** | |

---

## UTILS (`/src/utils/`)

| Current File | Destination | Notes |
|-------------|-------------|-------|
| `provenance.ts` | **CORE** `/src/core/utils/provenance.ts` | SHA256 hashing |
| `blueprint-generator.ts` | **CORE** `/src/core/utils/blueprint-generator.ts` | Foundry helper |
| `index.ts` | **CORE** | |

---

## ROOT FILES

| Current File | Destination | Notes |
|-------------|-------------|-------|
| `main.tsx` | **CORE** `/src/main.tsx` | Bootstrap with recipe loader |
| `App.tsx` | **SPLIT** | **CORE**: `CoreApp.tsx` (shell, pipeline, telemetry). **RECIPE**: `SignalWatchApp.tsx` (orchestration) |
| `index.css` | **SPLIT** | **CORE**: Base dark theme, layout. **RECIPE**: Grove palette, accent colors |
| `vite-env.d.ts` | **CORE** | |

---

## EXTENSION POINTS

The core must expose clean extension points:

### 1. Component Registry
```typescript
// /src/core/registry.ts
interface ComponentRegistry {
  entityCard?: React.ComponentType<EntityCardProps>
  dashboardWidgets?: React.ComponentType[]
  approvalCard?: React.ComponentType<ApprovalProps>
  configTabs?: Array<{ id: string; label: string; component: React.ComponentType }>
}

export function registerRecipe(recipe: RecipeManifest, components: ComponentRegistry): void
```

### 2. State Extension
```typescript
// /src/core/state/context.tsx
interface RecipeStateExtension {
  initialState: Record<string, unknown>
  reducer: (state: unknown, action: AppAction) => unknown
  selectors: Record<string, (state: AppState) => unknown>
}
```

### 3. Config Loader
```typescript
// /src/core/config/loader.ts
interface RecipeConfig {
  routing?: Partial<RoutingConfig>
  zones?: Partial<ZonesSchema>
  voice?: VoicePresets
  entities?: Entity[]
  prompts?: Record<string, PromptTemplate>
}

export function loadRecipeConfig(recipePath: string): RecipeConfig
```

### 4. Theme Extension
```typescript
// /src/core/theme/provider.tsx
interface RecipeTheme {
  colors?: Record<string, string>
  typography?: Record<string, string>
  overrides?: string  // CSS file path
}
```

---

## RECIPE MANIFEST

`/recipes/signal-watch/recipe.yaml`:

```yaml
name: signal-watch
version: 1.0.0-beta.2
description: "Competitive intelligence monitor with zone governance"
base_version: ">=1.0.0"

# What this recipe provides
provides:
  # Configuration
  entities: config/watchlist.yaml
  voice_presets: config/voice-presets.ts
  zone_config: config/zone-thresholds.yaml
  routing: config/routing.ts

  # Prompts
  prompts:
    recognition: prompts/recognition.md
    compilation: prompts/scan.template.ts
    analysis: prompts/subject.template.ts
    domain: prompts/domain.template.ts

  # Components
  components:
    entity_card: components/SubjectCard.tsx
    dashboard_chart: components/RatchetChart.tsx
    briefing_card: components/BriefingEntry.tsx
    approval_card: components/RedZoneTakeover.tsx
    inbox: components/BriefingInbox.tsx
    detail_pane: components/SubjectDetailPane.tsx

  # Theme
  theme:
    colors: theme/colors.ts
    typography: theme/typography.ts
    overrides: theme/overrides.css

  # Seed data
  seed_data:
    entities: seed/watchlist.ts
    briefings: seed/briefings.ts
    signals: seed/signals.ts

# Activation
setup:
  env:
    ANTHROPIC_API_KEY: "your-key-here"
  command: "npm install && npm run dev"
```

---

## VERIFICATION CHECKLIST

### 1. Base Runs Alone
- [ ] Delete `/recipes/signal-watch/`
- [ ] Run `npm run dev`
- [ ] Pipeline visualization displays
- [ ] Command bar accepts input
- [ ] Telemetry stream shows entries
- [ ] Config editor shows empty/default config
- [ ] Flywheel view shows "no skills"
- [ ] No domain-specific text visible

### 2. Recipe Activates Cleanly
- [ ] Restore `/recipes/signal-watch/`
- [ ] Run `npm run dev`
- [ ] Subjects appear on dashboard
- [ ] Voice presets populate config panel
- [ ] RatchetChart renders
- [ ] Briefings format with strategic voice
- [ ] RED zone takeover fires on critical adjustments
- [ ] No code changes to core required

### 3. Recipe Is Portable
- [ ] Create `/recipes/regulatory-watch/` by copying signal-watch
- [ ] Replace watchlist.yaml with regulatory entities
- [ ] Replace prompts with regulatory analysis
- [ ] Change theme colors
- [ ] Run with different recipe flag
- [ ] Verify completely different domain, same base

---

## VOCABULARY TRANSLATION

| Signal Watch Term | Generic Base Term |
|-------------------|-------------------|
| subject | entity |
| competitor | entity |
| signal | observation |
| briefing | analysis |
| score | dimension_value |
| watchlist | entity_set |
| scoring dimensions | dimensions |
| competitive intelligence | domain_analysis |

---

## IMPLEMENTATION ORDER

1. **Create directory structure** (empty folders)
2. **Extract core services** (CognitiveAdapter, pipeline-orchestrator)
3. **Split types.ts** (core types vs recipe types)
4. **Split reducer.ts** (core actions vs recipe actions)
5. **Create extension points** (registry, config loader)
6. **Extract core components** (Pipeline, Telemetry, CommandBar, Flywheel)
7. **Extract recipe components** (Briefing, Watchlist, Dashboard)
8. **Create recipe.yaml** manifest
9. **Create recipe loader** in main.tsx
10. **Split App.tsx** into CoreApp + SignalWatchApp
11. **Split CSS** into core theme + recipe overrides
12. **Verify all three tests pass**
13. **Commit and tag v1.1.0**
