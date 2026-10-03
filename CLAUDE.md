# CLAUDE.md — jarvis-ui-lib

## Rules are mandatory

All rules in `.claude/rules/` are binding. Every single rule MUST ALWAYS be followed, without
exception. If a rule conflicts with a request or cannot be met, stop and ask instead of deviating.

- `components.md` — component structure and conventions
- `styling.md` — Tailwind first, per-component CSS, no inline styles
- `typescript.md` — strict typing, no `any` / `!` / `@ts-ignore`
- `testing.md` — test conventions
- `showcase.md` — every public component needs a showcase demo
- `audio.md` — SFX hooks, events and sound assets
- `protected.md` — protected files (orbEngine, sounds, aliases, ESLint config)
- `changelog.md` — every user-facing change adds a `CHANGELOG.md` entry under `[Unreleased]`
- `release.md` — releases only via release PR + GitHub release; never publish locally, never merge yourself
- `identity.md` — public repo: author as `JoeyAsh` noreply, no personal names or private emails

## What this is

Standalone React component library for the JARVIS HUD interface (sharp, dark, JetBrains Mono,
glow instead of shadows), published to npm as **`jarvis-react-ui`** (MIT). It contains
primitives, compositions, a window/slot-grid system and a CSS/Three.js orb. The dev entry is a
live **showcase** (`npm run dev` → http://localhost:5173).

Stack: React 19, TypeScript 7 (strict; `tsc` from `@typescript/native`, TS 6 API kept as `typescript` for
typescript-eslint / vite-plugin-dts), Vite 8, Tailwind v4 (`@tailwindcss/vite`), Three.js,
lucide-react, Vitest 5 + React Testing Library (jsdom), ESLint 10 (type-checked), Prettier.

## Commands

```bash
npm run dev            # showcase dev server (:5173)
npm run typecheck      # tsc --noEmit (TS 7 via @typescript/native; plain `tsc` bin is ambiguous)
npm run build          # library build → dist/ (JS, .d.ts, style.css) via vite.config.lib.ts
npm run build:showcase # typecheck && vite build (showcase app)
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

1. `npm run typecheck`, `npm run build`, `npm run build:showcase`, `npm test` pass.
2. `npm run lint` has 0 errors and 0 warnings; `npm run format:check` is clean.
3. New/changed components have tests and a showcase demo (section updated, nav item if new section).
4. Affected showcase sections were checked visually in a browser (`/verify` skill).
5. No rule in `.claude/rules/` is violated; no `any`, `!`, `@ts-ignore`, `eslint-disable`.
6. `CHANGELOG.md` updated per `.claude/rules/changelog.md` (user-facing changes).

## Rules (path-scoped, auto-loaded) — `.claude/rules/`

See the list under "Rules are mandatory" above (loaded automatically; `changelog.md` always).

## Skills — `.claude/skills/`

- `/new-component` — scaffold a primitive/composition end to end
- `/showcase-section` — add or extend a showcase section and nav item
- `/add-sound` — add an SFX event (file, config entry, hook usage)
- `/verify` — run all checks, then visually check the showcase with Playwright
- `/changelog` — add a CHANGELOG entry or cut a release
- `/release` — cut and publish a version end to end (user-invoked only)
- `/review-ui` — review a change against the rules; PASS / NEEDS_CHANGES

## Working notes

- Line endings are LF (`.gitattributes`); Prettier: 4 spaces, single quotes, width 100.
- Other edits may happen in parallel in this repo: stage only the files you changed, never
  `git add -A`.
- This is a pure UI library: no app-level concerns (state management, API layer, backend).
- **`main` is protected:** all changes go through a feature branch + pull request; the `ci`
  check must be green before merging. Never push to `main`. See `CONTRIBUTING.md`; releases in
  `RELEASING.md`.
- Library build: `src/lib.ts` is the package entry (tokens + Tailwind theme + `@ui` barrel +
  `core/audio` + shared types); `src/ui/orb/index.ts` is the `jarvis-react-ui/orb` entry. Anything
  that should be public must be exported from those; the showcase is never part of the package.
