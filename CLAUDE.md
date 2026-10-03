# CLAUDE.md — jarvis-ui-lib

## What this is

Standalone React component library for the JARVIS HUD interface (sharp, dark, JetBrains Mono,
glow instead of shadows), extracted from the JARVIS monorepo (`frontend/src/ui`). It contains
primitives, compositions, a window/slot-grid system and a CSS/Three.js orb. The dev entry is a
live **showcase** (`npm run dev` → http://localhost:5173). Not a published package (`private`).

Stack: React 19, TypeScript 6 (strict), Vite 8, Tailwind v4 (`@tailwindcss/vite`), Three.js,
lucide-react, Vitest 4 + React Testing Library (jsdom), ESLint 10 (type-checked), Prettier.

## Commands

```bash
npm run dev            # showcase dev server (:5173)
npm run typecheck      # tsc --noEmit
npm run build          # tsc && vite build
npm test               # vitest run (single pass); npm run test:watch for watch mode
npm run lint           # eslint . — must be 0 errors AND 0 warnings
npm run lint:fix
npm run format:check   # prettier --check .  (npm run format to write)
```

`.npmrc` sets `legacy-peer-deps=true` (jsx-a11y lacks ESLint 10 peer support) — keep it.

## Directory map

```
index.html              showcase entry → src/ui/showcase/main.tsx
public/sounds/          SFX assets, one folder per event (+ MANIFEST.md); public/favicon.svg
src/ui/                 THE LIBRARY
  index.ts              single public barrel (also imports ui.css + components.css)
  ui.css                keyframes only
  components.css        @import aggregation of every component stylesheet
  primitives/<Name>/    atomic components
  compositions/<Name>/  multi-primitive components (HUDShell, WindowManager, StatusDock, ...)
  window/               Window, SnapOverlay, SwapOverlay, SlotGhost, slotGrid, hooks/
  orb/                  CssOrb (in barrel), ThreeOrb + orbEngine (NOT in barrel, lazy)
  showcase/             component gallery (Showcase.tsx, ShowcaseCard, sections/*, navItems.tsx)
src/common/             shared types (OrbState, PanelId, SlotId, ...) and utils (cx, time)
src/core/audio/         SFX subset: SfxContext/SfxProvider, useClickSfx, useHoverSfx, audioEngine, config
src/styles/tokens.css   design tokens (CSS custom properties, font import)
src/index.css           Tailwind v4 `@theme` mapped onto the tokens
src/test/setup.ts       vitest setup (jest-dom)
```

## Path aliases (tsconfig.json + vite.config.ts — keep both in sync)

`@ui` → `src/ui/index.ts` · `@ui/*` → `src/ui/*` · `@common/*` · `@core/*` · `@test/*`

## Import rules

- Consumers (apps, tests outside a component) import from the **`@ui` barrel** only. Deep `@ui/**`
  imports are flagged by ESLint (`no-restricted-imports`), except `@ui/orb/*`.
- `ThreeOrb`, `createOrb` and `OrbEngine` are deliberately **not** in the barrel (keeps Three.js in
  its own chunk); import them from `@ui/orb`.
- Inside `src/ui`, components import siblings via relative paths (see existing code).
- **Stylesheets:** every new component `.css` must be `@import`ed in `src/ui/components.css`.
  Showcase `main.tsx` loads `tokens.css`, `index.css`, `ui.css` and `components.css`; a component
  stylesheet that is not aggregated silently renders unstyled.

## Definition of Done

A change is done only when ALL hold:

1. `npm run typecheck`, `npm run build`, `npm test` pass.
2. `npm run lint` has 0 errors and 0 warnings; `npm run format:check` is clean.
3. New/changed components have tests and a showcase demo (section updated, nav item if new section).
4. Affected showcase sections were checked visually in a browser (`/verify` skill).
5. No rule in `.claude/rules/` is violated; no `any`, `!`, `@ts-ignore`, `eslint-disable`.

## Rules (path-scoped, auto-loaded) — `.claude/rules/`

`components.md` · `styling.md` · `typescript.md` · `testing.md` · `showcase.md` · `audio.md` ·
`protected.md`.

## Skills — `.claude/skills/`

- `/new-component` — scaffold a primitive/composition end to end
- `/showcase-section` — add or extend a showcase section and nav item
- `/add-sound` — add an SFX event (file, config entry, hook usage)
- `/verify` — run all checks, then visually check the showcase with Playwright
- `/review-ui` — review a change against the rules; PASS / NEEDS_CHANGES

## Working notes

- Line endings are LF (`.gitattributes`); Prettier: 4 spaces, single quotes, width 100.
- Other edits may happen in parallel in this repo: stage only the files you changed, never
  `git add -A`.
- Conventions originate in the JARVIS monorepo; app-level concerns (Redux, RTK Query, feature
  layers, backend) do not exist here.
