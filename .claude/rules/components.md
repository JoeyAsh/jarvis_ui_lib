---
paths:
    - 'src/ui/**/*.{ts,tsx}'
---

# Component rules

ESLint enforces: React / hooks / jsx-a11y recommended + type-checked typescript-eslint. The
structural rules below are **conventions checked in review** (`/review-ui`), not by lint.

## One component per file

No second `function Foo` / `const Foo = ...` component in the same `.tsx`.

## Types live in `<Name>.types.ts`

Every `interface`, `type` and `enum` (including unions like `ButtonVariant` and helper-component
props) goes in a sibling `<Name>.types.ts`. None in `.tsx` or hook `.ts` files. Re-export public
types through `index.ts`.

## No top-level helpers in `.tsx`

Formatters, classifiers, type guards, math go in a sibling `utils.ts` (or `format.ts`,
`classify.ts`). A lowercase top-level `function foo()` / `const foo = () =>` in a `.tsx` is a
violation. Handlers defined inside the component body are fine.

## Module-level constants in `.tsx`

Allowed only: component-local style/config lookup tables consumed by that one component
(`VARIANT_CLASSES`, `SIZE_CLASSES`, ...). Numbers, thresholds, timings and values used by more than
one component go to a sibling `constants.ts` (see `compositions/WindowManager/constants.ts`).

## Exports

Named export **and** default export on every component; set `displayName` on `forwardRef`
components (see `primitives/Button/Button.tsx`).

## Folder anatomy

```
src/ui/<primitives|compositions>/<Name>/
  <Name>.tsx          component
  <Name>.types.ts     props + all types
  <Name>.css          optional, lib-* BEM, see styling.md
  utils.ts / constants.ts   optional
  index.ts            named + type + default re-exports
  __tests__/<Name>.test.tsx
```

`index.ts` (from `primitives/Button`):

```ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
export { default } from './Button';
```

## Public API

A public component (and its types) is exported from `src/ui/index.ts`, under the matching section
(Primitives / Orb / Window subsystem / Compositions). Exception: Three.js orb pieces stay out of
the barrel (see `protected.md`).

## Documentation

Every public component needs JSDoc on all props and a docs page with demos in the same PR, see
`docs.md`.

## Interactivity

Interactive components use the SFX hooks (see `audio.md`) and must be keyboard accessible
(`jsx-a11y` is enforced).
