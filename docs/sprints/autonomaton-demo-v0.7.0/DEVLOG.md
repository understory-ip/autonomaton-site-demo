# Grove Autonomaton v0.7.0 — DEVLOG

## 2026-03-04T20:30:00Z — Sprint Start

**Status:** Complete

### Goal
Convert standalone HTML deck to modular React components with reusable primitives.

---

## Phase 0: Pattern Check

**Status:** Complete

- No existing deck component pattern in codebase
- Source: `grove-autonomaton-deck.html` (1078 lines, 13 slides)
- Fonts already loaded in `index.html`
- Tailwind config already has matching grove color palette

---

## Phase 0.5: Canonical Source Audit

**Status:** Complete

| Capability | Canonical Home | Action |
|------------|----------------|--------|
| Color tokens | `tailwind.config.js` | INVOKE — grove.amber, grove.green, etc. |
| Typography | `tailwind.config.js` | INVOKE — font-serif, font-mono |
| Pipeline component | `src/components/Pipeline/` | SEPARATE — deck has own visual |

---

## 2026-03-04T20:35:00Z — Task 1: Folder Structure + CSS

**Status:** Complete

- Created `src/components/Deck/` folder
- Created `deck.css` with:
  - Grid texture background (`.deck-slide::before`)
  - Slide transitions (opacity, pointer-events)
  - Staggered fadeUp animation
  - Progress dot styles
  - Code syntax highlighting classes

---

## 2026-03-04T20:40:00Z — Task 2: Primitive Components

**Status:** Complete

Created 9 reusable primitives:

1. `DeckCard.tsx` — feature cards with accent bar
2. `CodeBlock.tsx` — code examples + Kw/Val/Cmt/Str syntax helpers
3. `ZoneCard.tsx` — green/yellow/red zone governance cards
4. `TierRow.tsx` — cognitive tier rows
5. `FlywheelStep.tsx` — flywheel step boxes
6. `StatBox.tsx` — statistics boxes
7. `Highlight.tsx` — callout boxes
8. `DeckPipeline.tsx` — 5-stage pipeline visualization
9. `PrincipleRow.tsx` — principle definition rows

---

## 2026-03-04T20:45:00Z — Task 3: Slide Component

**Status:** Complete

Created `Slide.tsx` with:
- Slide container with variants (default, title, last, scroll)
- Typography helpers: Display, Headline, Subtitle, Lodestar, BodyText, Divider, Tag

---

## 2026-03-04T20:50:00Z — Task 4: Convert All 13 Slides

**Status:** Complete

Created `slides/slideData.tsx` with all 13 slides:
1. SlideTitle — pattern introduction
2. SlideProblem — reactive assistant paradigm
3. SlidePromise — what Autonomaton delivers
4. SlideFoundations — Extended Mind, Jidoka, Autonomic
5. SlidePipeline — 5-stage invariant pipeline
6. SlideRouter — cognitive tier routing
7. SlideZones — sovereignty guardrails
8. SlideFlywheel — skill flywheel
9. SlideTransparency — governance by construction
10. SlideRatchet — reverse tax
11. SlideBuild — build it this weekend
12. SlidePrinciples — seven principles
13. SlideFinal — bigger picture (end card)

---

## 2026-03-04T20:55:00Z — Task 5: Main Deck Component

**Status:** Complete

Created `Deck.tsx` with:
- useState for current slide
- Keyboard navigation (←/→/Space/↑/↓)
- Touch swipe detection
- Progress dots
- Slide counter
- Navigation buttons

---

## 2026-03-04T20:58:00Z — Task 6: Multi-Page Config

**Status:** Complete

- Created `deck.html` entry point
- Created `src/deck-main.tsx` React entry
- Updated `vite.config.ts` with rollup multi-page input
- Updated `Header.tsx` link: `grove-autonomaton-deck.html` → `/deck.html`

---

## 2026-03-04T21:00:00Z — Build Verification

**Status:** Success

```
npm run build
✓ 243 modules transformed
✓ built in 6.09s

dist/deck.html              1.16 kB
dist/assets/deck-*.css      1.73 kB
dist/assets/deck-*.js      35.94 kB
```

---

## Summary

| Directive | Status | Implementation |
|-----------|--------|----------------|
| React deck components | Complete | 13 slides as components |
| Reusable primitives | Complete | 9 primitive components |
| Multi-page build | Complete | /index.html + /deck.html |
| Copy preserved | Complete | All text from HTML source |
| Easy to update | Complete | Primitives-based architecture |

---

## Files Created

- `deck.html`
- `src/deck-main.tsx`
- `src/components/Deck/index.ts`
- `src/components/Deck/Deck.tsx`
- `src/components/Deck/Slide.tsx`
- `src/components/Deck/deck.css`
- `src/components/Deck/primitives/index.ts`
- `src/components/Deck/primitives/DeckCard.tsx`
- `src/components/Deck/primitives/CodeBlock.tsx`
- `src/components/Deck/primitives/ZoneCard.tsx`
- `src/components/Deck/primitives/TierRow.tsx`
- `src/components/Deck/primitives/FlywheelStep.tsx`
- `src/components/Deck/primitives/StatBox.tsx`
- `src/components/Deck/primitives/Highlight.tsx`
- `src/components/Deck/primitives/DeckPipeline.tsx`
- `src/components/Deck/primitives/PrincipleRow.tsx`
- `src/components/Deck/slides/index.ts`
- `src/components/Deck/slides/slideData.tsx`
- `docs/sprints/autonomaton-demo-v0.7.0/SPEC.md`
- `docs/sprints/autonomaton-demo-v0.7.0/DEVLOG.md`

## Files Modified

- `vite.config.ts` — added multi-page build config
- `src/components/Header/Header.tsx` — updated deck link

---

## 2026-03-04T20:30:00Z — v0.7.1 Course Correction

**Status:** Complete

### Problem

v0.7.0 created a multi-page build (`/deck.html`). This violates SPA architecture. The deck should be a conditionally-rendered overlay component.

### Solution

Refactored to strict SPA overlay:
- Deleted `deck.html`, `src/deck-main.tsx`, `src/components/Deck/Deck.tsx`
- Reverted `vite.config.ts` to single-page config
- Added deck state to `types.ts` and `reducer.ts`
- Created `DeckOverlay.tsx` component
- Added `slideMetadata` to `slideData.tsx` for left-nav
- Updated `App.tsx` to render `DeckOverlay`
- Updated `Header.tsx` with re-entry button

### Key Implementation Details

1. **Synchronous localStorage check** — `isDeckOpen` initialized in reducer's initialState to prevent UI flash:
   ```typescript
   isDeckOpen: typeof window !== 'undefined' && !localStorage.getItem('grove_hasSeenDeck')
   ```

2. **Keyboard navigation** — ESC to close, Left/Right/Space for navigation

3. **localStorage persistence** — `grove_hasSeenDeck` key prevents auto-open on return visits

### Build Verification

```
npm run build
✓ 241 modules transformed
✓ built in 4.24s

dist/index.html                   0.98 kB
dist/assets/index-*.css          31.79 kB
dist/assets/index-*.js          446.10 kB
```

Only `index.html` in output — no `deck.html`.

### Files Created (v0.7.1)

- `src/components/Deck/DeckOverlay.tsx`

### Files Modified (v0.7.1)

- `src/state/types.ts` — added `isDeckOpen`, `activeSlideIndex`, deck actions
- `src/state/reducer.ts` — added initialState and action handlers
- `src/components/Deck/index.ts` — exports `DeckOverlay`
- `src/components/Deck/slides/index.ts` — exports `slideMetadata`
- `src/components/Deck/slides/slideData.tsx` — added `slideMetadata` array
- `src/App.tsx` — imports and renders `DeckOverlay`
- `src/components/Header/Header.tsx` — replaced link with button
- `vite.config.ts` — reverted to single-page config

### Files Deleted (v0.7.1)

- `deck.html`
- `src/deck-main.tsx`
- `src/components/Deck/Deck.tsx`
