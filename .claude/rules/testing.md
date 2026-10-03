---
paths:
    - 'src/**/__tests__/**'
    - 'src/**/*.test.{ts,tsx}'
    - 'src/test/**'
---

# Testing rules

- Runner: Vitest (`npm test`), `environment: 'jsdom'`, `globals: true`, setup file
  `src/test/setup.ts` (jest-dom matchers). RTL and `@testing-library/user-event` are available.
- Co-locate tests: `<Name>/__tests__/<Name>.test.tsx` (or `utils.test.ts`). Use relative imports for
  the unit under test (`../Button`) and the `@core/*` / `@common/*` aliases for cross-area imports.
- Cover: render, each variant/size, className passthrough, interaction callbacks, a11y role/name,
  and the SFX call for interactive components.
- **Mock everything external; no real network, audio, WebGL or running timers:**
    - SFX: wrap in `<SfxContext.Provider value={{ playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() }}>`
      (pattern in `primitives/Button/__tests__/Button.test.tsx`).
    - `ResizeObserver` is missing in jsdom: `vi.stubGlobal('ResizeObserver', MockResizeObserver)`
      (see `compositions/WindowManager/__tests__/WindowManager.container.test.tsx`).
    - `requestAnimationFrame` / `cancelAnimationFrame` via `vi.fn` spies
      (see `orb/CssOrb/__tests__`).
    - `three`, `orbEngine`, `AudioContext`, the audio engine: `vi.mock(...)`
      (see `core/audio/__tests__/useAudioEngine.test.ts`).
- Clean up: `vi.restoreAllMocks()` and `vi.unstubAllGlobals()` in `afterEach`.
- Prefer roles/text over class assertions; class checks are acceptable for variant mapping.
- Test files are exempt only from `no-unused-vars`; `any` and `!` stay forbidden.
