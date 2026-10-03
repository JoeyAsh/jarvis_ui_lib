---
paths:
    - '**/*.{ts,tsx}'
---

# TypeScript rules

- `tsconfig.json` is `strict` plus `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`. `npm run typecheck` must be clean.
- ESLint runs `recommendedTypeChecked`: `no-unsafe-*`, `no-floating-promises`,
  `no-misused-promises` etc. are errors. Do not weaken `eslint.config.js` or downgrade rules.
- Forbidden: `any`, non-null assertion `!`, `@ts-ignore` / `@ts-expect-error` shortcuts,
  `// eslint-disable*` comments, `as unknown as T` to dodge a real typing problem. If a type is
  missing, write it (in `<Name>.types.ts`).
- Unused variables/args: prefix with `_` (the only escape hatch; the rule is off in tests).
- Type-only imports use `import type` (`isolatedModules` is on).
- Props interfaces extend the native element attributes when wrapping one
  (`ButtonHTMLAttributes<HTMLButtonElement>`) and accept `className`.
- Target ES2020; React 19 JSX transform — no `import React`.
- `no-restricted-imports` is configured as `warn`, and lint must have 0 warnings: no deep `@ui/**`
  imports except `@ui/orb/*`.
