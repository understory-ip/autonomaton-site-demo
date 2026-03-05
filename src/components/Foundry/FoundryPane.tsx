/**
 * FoundryPane — Architectural Compiler (v0.8.0)
 *
 * The Foundry is where architects describe software they want to build.
 * It will use Tier 3 to compile a zone-classified, declarative PRD
 * mapped to the Autonomaton pattern.
 *
 * This sprint implements the UI shell only; compilation logic comes later.
 */

export function FoundryPane() {
  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full space-y-6 mt-8">

        <div className="border-b border-grove-border pb-6">
          <div className="font-mono text-xs text-grove-amber tracking-[0.2em] uppercase mb-4">
            Architectural Compiler
          </div>
          <h2 className="font-serif text-3xl text-grove-text mb-3">
            The Architect's Foundry
          </h2>
          <p className="font-mono text-sm text-grove-text-dim leading-relaxed">
            Describe the software you want to build. The Foundry will use your
            <span className="text-grove-text font-bold"> Tier 3 API Key </span>
            to compile a zone-classified, declarative PRD mapped to the Autonomaton pattern.
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <textarea
            placeholder="e.g., A local agent that reads my Notion inbox, categorizes tasks by urgency, and autonomously drafts status reports..."
            className="w-full h-40 bg-grove-bg border border-grove-border p-4 font-mono text-sm text-grove-text placeholder:text-grove-text-dim focus:border-grove-amber focus:outline-none resize-none"
          />
          <div className="flex justify-between items-center">
            <div className="font-mono text-[10px] text-grove-text-dim uppercase">
              Requires valid models.config
            </div>
            <button className="bg-grove-amber text-grove-bg font-mono text-xs uppercase px-6 py-3 hover:bg-grove-amber-bright transition-colors">
              Compile Architecture →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
