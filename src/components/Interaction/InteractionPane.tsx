/**
 * InteractionPane — User input and interaction history
 *
 * This is where users type requests and see responses.
 * Each interaction shows: tier, zone, cost, and the system response.
 */

import { useState } from 'react'
import { useApp, useTutorial, usePendingApproval } from '../../state/context'
import { processInteraction, continueAfterApproval, rejectInteraction } from '../../services'

export function InteractionPane() {
  const [input, setInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const { state, dispatch } = useApp()
  const tutorial = useTutorial()
  const pendingApproval = usePendingApproval()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || processing) return

    setProcessing(true)
    setInput('')

    try {
      await processInteraction(input, state, dispatch)
    } finally {
      setProcessing(false)
    }
  }

  const handleApprove = async () => {
    if (!pendingApproval) return
    setProcessing(true)
    try {
      await continueAfterApproval(pendingApproval, state, dispatch)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = () => {
    rejectInteraction(dispatch)
  }

  return (
    <div className="flex-1 border-r border-slate-700 flex flex-col">
      {/* Interaction List */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        {state.interactions.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            <p className="text-lg mb-2">Welcome to the Pattern Playground</p>
            <p className="text-sm">
              {tutorial.active
                ? 'Follow the tutorial to experience the Autonomaton pattern.'
                : 'Type a request below to begin.'}
            </p>
            <div className="mt-6 text-xs text-slate-600 space-y-1">
              <p>Try: "capture my idea about project architecture"</p>
              <p>Try: "research best practices for API design"</p>
              <p>Try: "delete all user data" (red zone demo)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {state.interactions.map((interaction) => (
              <div
                key={interaction.id}
                className={`
                  bg-slate-800/50 rounded-lg p-4 border-l-4 transition-all
                  ${interaction.zone === 'green' ? 'border-zone-green' : ''}
                  ${interaction.zone === 'yellow' ? 'border-zone-yellow' : ''}
                  ${interaction.zone === 'red' ? 'border-zone-red' : ''}
                  ${interaction.status === 'pending' ? 'opacity-70' : ''}
                  ${state.selectedInteractionId === interaction.id ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                {/* User Input */}
                <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                  <span className="text-slate-500">›</span>
                  {interaction.input}
                </div>

                {/* Metadata Badges */}
                <div className="flex items-center gap-3 text-xs mb-3">
                  <span className={`tier-${interaction.tier} px-2 py-0.5 rounded border`}>
                    T{interaction.tier}: {interaction.tier === 0 ? 'Cached' : interaction.tier === 1 ? 'Cheap' : interaction.tier === 2 ? 'Premium' : 'Apex'}
                  </span>
                  <span className={`zone-${interaction.zone} px-2 py-0.5 rounded border capitalize`}>
                    {interaction.zone}
                  </span>
                  <span className="text-slate-500">
                    ${interaction.cost.toFixed(4)}
                  </span>
                  {interaction.skillMatch && (
                    <span className="text-tier-0 px-2 py-0.5 rounded border border-tier-0">
                      ⚡ Skill
                    </span>
                  )}
                  {interaction.sovereignty === 'local' && (
                    <span className="text-green-400 text-xs">🏠 Local</span>
                  )}
                </div>

                {/* Response */}
                {interaction.response && (
                  <div className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-900/50 rounded p-3">
                    {interaction.response}
                  </div>
                )}

                {/* Status indicator */}
                {interaction.status === 'pending' && (
                  <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                    <span className="animate-pulse">●</span>
                    Processing...
                  </div>
                )}
                {interaction.status === 'rejected' && (
                  <div className="text-xs text-red-400 mt-2">
                    ✗ Rejected by user
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pending Approval Card */}
        {pendingApproval && (
          <div className="mt-4 bg-yellow-950/30 border border-zone-yellow rounded-lg p-4">
            <div className="flex items-center gap-2 text-zone-yellow font-medium mb-2">
              <span>✋</span>
              <span>Approval Required</span>
            </div>
            <p className="text-sm text-slate-300 mb-2">
              This action is in the <strong>YELLOW ZONE</strong> — it requires your approval before proceeding.
            </p>
            <div className="text-xs text-slate-400 mb-4 bg-slate-900/50 rounded p-2">
              <strong>Intent:</strong> {pendingApproval.intent}<br />
              <strong>Tier:</strong> {pendingApproval.tier}<br />
              <strong>Estimated cost:</strong> ${pendingApproval.cost.toFixed(4)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={processing}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                {processing ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-slate-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={processing ? 'Processing...' : 'Type your request...'}
            disabled={processing || !!pendingApproval}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={processing || !!pendingApproval || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {processing ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
