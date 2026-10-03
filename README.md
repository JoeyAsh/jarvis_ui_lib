# JARVIS UI Library

Sharp, HUD-style React component library (primitives, compositions, window system, CSS/Three.js orb)
with a live showcase. Extracted from the [JARVIS](https://github.com/JoeyAsh/JARVIS) monorepo
(`frontend/src/ui`, branch `refactor/component-migration`). The library's runtime dependencies
(shared types, `cx` util, SFX audio subset, design tokens, sounds) are part of this repo as real,
working source.

Stack: Vite 8, React 19, TypeScript, Tailwind v4 (`@tailwindcss/vite`), Three.js, lucide-react, Vitest.

## Run the preview

```bash
npm install
npm run dev        # opens the showcase at http://localhost:5173
```

Other scripts: `npm run build` (tsc + vite build), `npm run preview`, `npm test`, `npm run lint`,
`npm run typecheck`.

## Structure

```
index.html              Showcase entry (loads src/ui/showcase/main.tsx)
public/
  sounds/               UI sound effects (SFX) used by the audio engine
  favicon.svg
src/
  ui/                   The library
    index.ts            Single public barrel - import everything from '@ui'
    primitives/         Atomic display components
    compositions/       Multi-primitive components (HUDShell, WindowManager, StatusDock, ...)
    orb/                CssOrb + ThreeOrb (lazy-loaded)
    window/             Window / drag / resize system + slot grid
    showcase/           Component gallery (the preview app)
    ui.css, components.css
  common/               Part of the lib: shared types (OrbState, PanelId, SlotId, ...) and
                        utils (cx, time formatters)
  core/audio/           Part of the lib: SFX subset - SfxContext/SfxProvider, useClickSfx,
                        useHoverSfx, useAudioEngine, audioEngine, SFX config (+ tests)
  styles/tokens.css     Design tokens (CSS custom properties, JetBrains Mono)
  index.css             Tailwind v4 theme mapped to the tokens
  test/setup.ts         Vitest setup (jest-dom)
```

Path aliases (tsconfig + vite): `@ui`, `@ui/*`, `@common/*`, `@core/*`, `@test/*`.

## Design rules

- Import from the `@ui` barrel only; no deep imports (except `@ui/orb/*`).
- One component per file; each primitive in its own folder with a `.types.ts` sibling.
  No `interface`/`type` declarations in `.tsx` files.
- No inline styles for color or font. Use CSS variables from `src/index.css` / `tokens.css`.
- CSS Modules only for keyframes / blend modes / multi-layer backdrop-filter; everything else is
  Tailwind utilities. No global `import './Foo.css'` in components.
- No `border-radius` above 4 px. Sharp HUD aesthetic.
- All colors via `var(--token)`, never hardcoded hex.
- JetBrains Mono only (loaded from Google Fonts in `tokens.css`).
- `src/ui/orb/orbEngine.ts` is a black box - do not modify.

Adding a primitive: create `src/ui/primitives/MyThing/{MyThing.tsx,MyThing.types.ts,index.ts}`,
export it from `src/ui/index.ts`, add `__tests__/MyThing.test.tsx`. See `src/ui/README.md`.

## Notes

- `.npmrc` sets `legacy-peer-deps=true` (eslint-plugin-jsx-a11y does not yet declare ESLint 10 support).
- Lint: `npm run lint` is clean (0 errors, 0 warnings) with the full type-checked rule set;
  no rules are downgraded. `vite.config.ts` is linted via `tsconfig.node.json`.
