# Grove Autonomaton v0.3.1 — "Pegged Dashboard Layout"

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | ✅ All tasks implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T16:45:00Z |
| **Next Action** | Manual verification, then commit |
| **Attention Anchor** | Make UI behave like IDE — fixed viewport, internal scrolling only |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** Pegged dashboard layout where only specific panels scroll
- **Success looks like:** Viewport locked to screen, input pinned, interactions slide up smoothly
- **We are NOT:** Adding features — this is a CSS Flexbox structural fix
- **Current phase:** Implementation
- **Next action:** Apply h-screen + min-h-0 fixes

---

## Goal

Fix the UI to behave like an IDE/terminal rather than a scrolling webpage. The input line, telemetry, and pipeline should stay anchored — only specific internal panels scroll.

---

## The Problem

Currently the app uses `min-h-screen` which allows the page to grow beyond the viewport. This breaks the "controlled dashboard" illusion — elements run away instead of staying pegged.

---

## The Fix (4 Changes)

1. **Lock Root to Viewport** — `h-screen overflow-hidden` on App root
2. **Secret Weapon** — `min-h-0` on main container (prevents flex blowout)
3. **Fix InteractionPane** — `min-h-0` on container
4. **Auto-Scroll** — Ref-based smooth scroll on new interactions

---

## Acceptance Criteria

- [x] Viewport exactly screen height (no page scroll)
- [x] Interaction list scrolls internally
- [x] New interactions slide up smoothly
- [x] Input stays pinned at bottom
- [x] Telemetry stays pegged at bottom
- [x] Pipeline stays pegged at top
- [x] Config editor scrolls independently

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | `h-screen overflow-hidden` on root, `min-h-0` on main |
| `src/components/Interaction/InteractionPane.tsx` | `min-h-0` on container, auto-scroll hook |
