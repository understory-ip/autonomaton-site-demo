# Signal Watch Recipe

Competitive Intelligence Monitor built on the Grove Autonomaton Pattern.

## Fork This Recipe

To create a new domain-specific autonomaton, follow these 5 steps:

### Step 1: Copy the Directory

```bash
cp -r recipes/signal-watch recipes/your-domain
```

### Step 2: Update Types

Edit `recipes/your-domain/state/types.ts`:

1. Rename `SignalWatchState` → `YourDomainState`
2. Rename `SignalWatchAction` → `YourDomainAction`
3. Replace domain-specific types:
   - `WatchlistSubject` → your entity type
   - `ClassifiedSignal` → your observation type
   - `Briefing` → your analysis type
4. Update `currentView` with your views

### Step 3: Update Reducer

Edit `recipes/your-domain/state/reducer.ts`:

1. Rename `signalWatchReducer` → `yourDomainReducer`
2. Rename `signalWatchInitialState` → `yourDomainInitialState`
3. Update action handlers for your domain actions
4. Modify initial state with your defaults

### Step 4: Update Config

Edit `recipes/your-domain/config/`:

- `defaults.ts` — Your domain's default entities
- `zones.ts` — Zone thresholds for your domain
- `routing.ts` — Intent routing for your domain

### Step 5: Wire Up Entry Point

Update `src/state/context.tsx` to import from your recipe:

```tsx
import {
  YourDomainProvider,
  useYourDomainState,
  useYourDomainDispatch,
} from '../../recipes/your-domain/state/context'

export { YourDomainProvider as AppProvider }
export const useAppState = useYourDomainState
export const useAppDispatch = useYourDomainDispatch
```

---

## Architecture

Signal Watch extends the core autonomaton with:

- **Competitive Intelligence Domain** — Subjects, signals, briefings
- **AI Landscape Watchlist** — 5 default competitors
- **Zone-Based Governance** — Score adjustment thresholds
- **Strategic Briefings** — Web-sourced research reports

### Core Extension Points

| Core Concept | Signal Watch Implementation |
|--------------|---------------------------|
| Entity | `WatchlistSubject` |
| Observation | `ClassifiedSignal` |
| Analysis | `Briefing` |
| Dimension | Score (0.0-1.0) |

### Zone Thresholds

| Zone | Score Delta | Signal Level |
|------|-------------|--------------|
| GREEN | < 0.05 | routine |
| YELLOW | 0.05 - 0.15 | significant |
| RED | >= 0.15 | critical |

### Voice Presets

- **Strategic** — Board-level, investment implications
- **Executive** — Action-oriented, bottom-line focus
- **Operator** — Technical, implementation details

---

## File Structure

```
recipes/signal-watch/
├── config/
│   ├── defaults.ts     # Default AI watchlist
│   ├── routing.ts      # Intent routing config
│   └── zones.ts        # Zone thresholds
├── state/
│   ├── types.ts        # Signal Watch types
│   ├── reducer.ts      # Signal Watch reducer
│   └── context.tsx     # Signal Watch provider
├── index.ts            # Main export
└── README.md           # This file
```

## License

MIT
