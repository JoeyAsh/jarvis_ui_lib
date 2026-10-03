---
name: new-component
description: Scaffold a new UI component (primitive or composition) in jarvis-ui-lib end to end — folder, types with JSDoc, index, barrel export, optional CSS aggregation, test, showcase demo and docs page. Use when asked to add, create or build a new component, primitive or composition in src/ui.
argument-hint: '<Name> [primitive|composition]'
---

# New component

Arguments: `$ARGUMENTS` (PascalCase name; group defaults to `primitives`).
Read `.claude/rules/components.md`, `styling.md`, `typescript.md` and `docs.md` first. Model it on the closest
existing component (`src/ui/primitives/Button` for interactive, `Panel` for CSS-backed).

## Steps

1. **Folder** `src/ui/<primitives|compositions>/<Name>/` with:
    - `<Name>.types.ts` — props interface (+ every union/type); extend native element attrs, accept
      `className`. **JSDoc on every prop** (`/** ... @default x */`, incl. `children`/`className`).
    - `<Name>.tsx` — one component, `cx()` from `@common/utils/cx`, Tailwind token classes,
      named + default export, `displayName` if `forwardRef`. Component-local lookup tables only;
      numbers/timings in `constants.ts`, helpers in `utils.ts`.
    - `index.ts` — `export { Name }`, `export type {...}`, `export { default }`.
    - Interactive? add `useHoverSfx` / `useClickSfx` from `@core/audio` and
      `data-sfx-hover="button"` (see `rules/audio.md`).
2. **CSS only if Tailwind cannot do it** (keyframes, blend modes, backdrop-filter stacks):
   `<Name>.css` with `lib-<name>` BEM classes, then add
   `@import './<group>/<Name>/<Name>.css';` to `src/ui/components.css`.
3. **Barrel:** add to `src/ui/index.ts` in the matching section:
   `export { Name } from './<group>/<Name>';` and
   `export type { NameProps, ... } from './<group>/<Name>';`
4. **Test:** `__tests__/<Name>.test.tsx` per `rules/testing.md` (variants, className passthrough,
   interactions, SFX via `SfxContext.Provider`, mock ResizeObserver/rAF if used).
5. **Showcase:** add a demo via `/showcase-section` (every public component needs one).
6. **Docs page (required, not optional):** run `/docs-page <Name> new` — MDX page in
   `docs/src/pages/components/<slug>.mdx`, demos in `docs/src/demos/<slug>/`, sidebar entry in
   `docs/src/nav.ts`. The component is not done until `npm run docs:check -- --only <Name>` passes.
7. **Changelog:** `Added` entry under `[Unreleased]` (`/changelog`).
8. **Verify:** run `/verify` (includes the docs build and a look at the new docs page).

## Guardrails

- Never edit `src/ui/orb/orbEngine.ts`. Don't add Three.js things to the barrel.
- No inline styles (except CSS-variable injection), no `any` / `!` / `eslint-disable`,
  radius <= 4px, colors via tokens.
- Stage only your files; never `git add -A`.
