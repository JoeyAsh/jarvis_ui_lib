---
paths:
    - 'src/**/*.{tsx,css}'
---

# Styling rules

## Tailwind first

Layout, spacing, color and typography via Tailwind v4 utilities. Theme tokens come from
`src/index.css` (`@theme`): `bg-bg`, `bg-surface`, `text-text`, `text-text-secondary`,
`text-accent`, `border-border`, `text-error`, ... The raw tokens live in `src/styles/tokens.css`
(`--bg`, `--accent`, `--glow`, `--r-1`, `--s-*`, `--z-*`, `--dur-*`). Colors always via
tokens/CSS variables — no new hardcoded hex in components.

## Per-component CSS (only when Tailwind cannot express it)

For keyframes, blend modes, multi-layer gradients, `backdrop-filter` stacks, pseudo-element chrome.

- File: `src/ui/<group>/<Name>/<Name>.css`, classes prefixed `lib-` (BEM-style, e.g.
  `.lib-panel__head`).
- Aggregate it: add `@import './<group>/<Name>/<Name>.css';` to `src/ui/components.css` (groups:
  primitives / orb / window / compositions). Never `import './Foo.css'` from a component file.
- Shared `@keyframes` go in `src/ui/ui.css` (keyframes only, no selectors).
- Add a short header comment explaining why Tailwind alone is insufficient.

## Inline styles

Forbidden, except CSS-variable injection:
`style={{ '--panel-opacity': x } as CSSProperties}`. Prefer CSS variables for dynamic values
(e.g. computed positions) instead of raw `left/top/width` styles where feasible.

## Design language (hypermodern HUD)

- **Font:** JetBrains Mono only (`font-mono`; `--font-sans` is mapped to it too).
- **Radius:** hard cap 4px. Prefer 2px (`rounded-[2px]`), 0 for structural elements. `@theme` wipes
  `rounded-sm/md/lg/...`; `rounded-full` remains only for circles (orb, dots).
- **Borders:** hairline 1px in component chrome.
- **Glow, not shadow:** `shadow-glow` / `--glow*` tokens. No `drop-shadow`, no blur filters for chrome.
- **Dark only:** no light mode or adaptive color scheme.
- **Overlay panels:** `rgba(13,13,20,0.72–0.75)` background, `backdrop-filter: blur(12px)`,
  `1px solid var(--border)`.
- **Motion:** easing `--ease` / `--ease-hud`; 150 / 300 / 500ms steps; entry animation `winIn`
  (clip-path reveal); state changes crossfade opacity.
- **Brand signatures:** corner brackets, light trace, scanlines, grid background, reticle. Reuse the
  existing primitives rather than re-drawing them.

When unsure, read `src/styles/tokens.css` and the nearest existing component before inventing values.
