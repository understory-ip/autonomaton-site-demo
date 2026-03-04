/**
 * Grove Autonomaton Pattern Playground
 *
 * A browser-based demo proving 9 architectural claims through user interaction.
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Header (Mode Toggle, Model Config, Andon Cord)             │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Pipeline Visualization (Hero Element)                       │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Dashboard (Metrics)                                         │
 * ├──────────────────────────────┬──────────────────────────────┤
 * │ Interaction Pane             │ Config Editor / Skills       │
 * │                              │                              │
 * ├──────────────────────────────┴──────────────────────────────┤
 * │ Telemetry Stream                                            │
 * └─────────────────────────────────────────────────────────────┘
 */

import { useAppState } from './state/context'

export default function App() {
  const { mode, metrics, pipeline, tutorial } = useAppState()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Grove Autonomaton
            </h1>
            <p className="text-sm text-slate-400">Pattern Playground</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode indicator */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Mode:</span>
              <span className={mode === 'demo' ? 'text-blue-400' : 'text-green-400'}>
                {mode === 'demo' ? 'Demo' : 'Interactive'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Pipeline Visualization (Hero) */}
      <section className="border-b border-slate-700 px-6 py-4 bg-slate-800/50">
        <div className="flex items-center justify-center gap-2">
          {(['telemetry', 'recognition', 'compilation', 'approval', 'execution'] as const).map(
            (stage, idx) => (
              <div key={stage} className="flex items-center">
                <div
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${pipeline.stages[stage] === 'idle' ? 'bg-slate-700 text-slate-400' : ''}
                    ${pipeline.stages[stage] === 'active' ? 'bg-blue-600 text-white stage-active' : ''}
                    ${pipeline.stages[stage] === 'complete' ? 'bg-green-600 text-white' : ''}
                    ${pipeline.stages[stage] === 'error' ? 'bg-red-600 text-white' : ''}
                  `}
                >
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </div>
                {idx < 4 && (
                  <div className="w-8 h-0.5 bg-slate-600 mx-1" />
                )}
              </div>
            )
          )}
        </div>
      </section>

      {/* Dashboard */}
      <section className="border-b border-slate-700 px-6 py-3 bg-slate-800/30">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div>
            <span className="text-slate-400">Total Cost: </span>
            <span className="font-mono text-white">${metrics.totalCost.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-slate-400">Interactions: </span>
            <span className="font-mono text-white">{metrics.interactionCount}</span>
          </div>
          <div>
            <span className="text-slate-400">Avg Tier: </span>
            <span className="font-mono text-white">
              {metrics.tierHistory.length > 0
                ? (metrics.tierHistory.reduce((a, b) => a + b, 0) / metrics.tierHistory.length).toFixed(1)
                : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-400">% Local: </span>
            <span className="font-mono text-white">
              {metrics.interactionCount > 0
                ? Math.round((metrics.localCount / metrics.interactionCount) * 100)
                : 0}%
            </span>
          </div>
          <div>
            <span className="text-slate-400">Skills: </span>
            <span className="font-mono text-tier-0">{metrics.skillsFired}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Interaction Pane */}
        <div className="flex-1 border-r border-slate-700 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="text-center text-slate-500 py-12">
              <p className="text-lg mb-2">Welcome to the Pattern Playground</p>
              <p className="text-sm">
                {tutorial.active
                  ? 'Follow the tutorial to experience the Autonomaton pattern.'
                  : 'Type a request below to begin.'}
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your request..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right: Config Editor */}
        <div className="w-96 flex flex-col">
          <div className="flex border-b border-slate-700">
            <button className="flex-1 px-4 py-2 text-sm font-medium text-blue-400 border-b-2 border-blue-400">
              routing.config
            </button>
            <button className="flex-1 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-300">
              zones.schema
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <pre className="config-editor text-xs leading-relaxed">
{`intents:
  capture_idea:
    tier: 1
    zone: green
  summarize_notes:
    tier: 1
    zone: green
  draft_email:
    tier: 2
    zone: yellow
  deploy_change:
    tier: 3
    zone: red`}
            </pre>
          </div>
        </div>
      </main>

      {/* Telemetry Stream */}
      <section className="h-48 border-t border-slate-700 bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
          <span className="text-sm font-medium text-slate-400">Telemetry Stream</span>
          <button className="text-xs text-blue-400 hover:text-blue-300">
            Export Audit Log
          </button>
        </div>
        <div className="p-4 font-mono text-xs text-slate-500 overflow-y-auto h-32">
          <p>// Telemetry entries will appear here...</p>
          <p>// Each interaction generates a structured audit record</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 px-6 py-3 text-center text-xs text-slate-500">
        The Grove Autonomaton Pattern • CC BY 4.0 • thegrovefoundation.org
      </footer>
    </div>
  )
}
