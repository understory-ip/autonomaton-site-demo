# Feature: v0.7.0 — "Deck React Integration"

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | All tasks implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T21:00:00Z |
| **Next Action** | Commit and tag v0.7.0 |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** React component version of the pattern deck with reusable primitives
- **Success looks like:** Deck renders at /deck.html, easy to update slides by converting new HTML
- **We are NOT:** Modifying slide copy (text content), only framing and end card
- **Current phase:** Complete

---

## User Constraints

1. **Do not modify copy** — All slide text preserved exactly from HTML source
2. **Can modify framing** — Layout, structure, navigation can change
3. **Can modify end card** — Last slide can be updated

---

## Goal

Convert the standalone HTML deck into modular React components with reusable primitives, making it easy to update by providing new HTML/CSS files for conversion.

---

## Non-Goals

- Changing slide text content
- Adding routing library (React Router)
- Creating admin interface for editing slides

---

## Acceptance Criteria

- [x] Deck folder structure created (`src/components/Deck/`)
- [x] deck.css with grid texture, slide transitions, animations
- [x] 9 primitive components (DeckCard, CodeBlock, ZoneCard, TierRow, FlywheelStep, StatBox, Highlight, DeckPipeline, PrincipleRow)
- [x] Slide component with typography helpers (Display, Headline, Subtitle, Lodestar, etc.)
- [x] All 13 slides converted to React components
- [x] Main Deck component with keyboard, touch, and dot navigation
- [x] Multi-page Vite config (main + deck entry points)
- [x] Header link updated to `/deck.html`
- [x] Build passes with no errors

---

## Implementation Summary

### Architecture

```
src/components/Deck/
├── index.ts              — exports Deck
├── Deck.tsx              — navigation, layout, state
├── Slide.tsx             — slide container + typography helpers
├── deck.css              — grid texture, transitions, animations
├── primitives/
│   ├── index.ts
│   ├── DeckCard.tsx      — feature cards
│   ├── CodeBlock.tsx     — code examples + syntax highlighting
│   ├── ZoneCard.tsx      — zone governance cards
│   ├── TierRow.tsx       — cognitive tier rows
│   ├── FlywheelStep.tsx  — flywheel step boxes
│   ├── StatBox.tsx       — statistics boxes
│   ├── Highlight.tsx     — callout boxes
│   ├── DeckPipeline.tsx  — pipeline visualization
│   └── PrincipleRow.tsx  — principles list rows
└── slides/
    ├── index.ts
    └── slideData.tsx     — all 13 slides as components
```

### Entry Points

- `/index.html` → Main app (Pattern Playground)
- `/deck.html` → Standalone deck (Pattern Deck)

---

## Files Created

| File | Purpose |
|------|---------|
| `deck.html` | Deck entry point |
| `src/deck-main.tsx` | Deck React entry |
| `src/components/Deck/index.ts` | Exports |
| `src/components/Deck/Deck.tsx` | Main deck component |
| `src/components/Deck/Slide.tsx` | Slide container |
| `src/components/Deck/deck.css` | Deck styles |
| `src/components/Deck/primitives/*.tsx` | 9 primitive components |
| `src/components/Deck/slides/slideData.tsx` | All 13 slides |

## Files Modified

| File | Change |
|------|--------|
| `vite.config.ts` | Multi-page build config |
| `src/components/Header/Header.tsx` | Updated deck link |

---

## Update Workflow

When user provides new `grove-autonomaton-deck.html`:

1. Extract slide content (copy preserved per constraint)
2. Map HTML patterns to existing primitives
3. Update `slideData.tsx` with new structure
4. If new patterns exist, create new primitives
5. Build and verify

---

## Verification

```bash
npm run build
# ✓ 243 modules transformed
# ✓ built in 6.09s

# Output includes:
# dist/deck.html              1.16 kB
# dist/assets/deck-*.css      1.73 kB
# dist/assets/deck-*.js      35.94 kB
```
