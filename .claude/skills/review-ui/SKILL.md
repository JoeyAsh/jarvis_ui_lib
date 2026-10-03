---
name: review-ui
description: Review jarvis-ui-lib changes (diff, files or a component) against the project rules and return a PASS or NEEDS_CHANGES verdict. Use when asked to review, audit or quality-gate UI library code, or before a commit/PR of component changes.
argument-hint: '[files, component name, or empty for the current diff]'
context: fork
allowed-tools: Read Grep Glob Bash(git diff *) Bash(git status *) Bash(git log *)
---

# Review UI

Scope: `$ARGUMENTS` (empty = `git diff HEAD` plus untracked files from `git status`). Read-only: do
not edit. Read `.claude/rules/*.md` first; cite `file:line` for every finding.

## Checklist

**Critical (any one => NEEDS_CHANGES)**

- More than one component in a `.tsx`; `interface`/`type`/`enum` in a `.tsx` or hook `.ts`.
- Top-level lowercase helper function/const in a `.tsx`; numeric/timing constants in a `.tsx`.
- `any`, `!`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`, `as unknown as`.
- Inline `style` other than CSS-variable injection; `import './Foo.css'` in a component.
- New `.css` not `@import`ed in `src/ui/components.css`; class names without `lib-` prefix.
- Deep `@ui/**` imports (except `@ui/orb/*`); Three.js orb pieces added to `src/ui/index.ts`.
- Any change to `src/ui/orb/orbEngine.ts`; loosened `eslint.config.js`/`tsconfig.json`.
- Radius > 4px, non-JetBrains-Mono font, hardcoded hex colors, `drop-shadow`.
- Public component missing from `src/ui/index.ts` (component + types), missing test, or missing
  showcase demo.
- Public component without docs page, demo or sidebar entry, public prop without JSDoc, or a
  component change whose docs page/demos/JSDoc were not updated (`.claude/rules/docs.md`).
- Docs-only UI component in `docs/` that should be a library component.
- SFX: config `file` that does not exist in `public/sounds/`.

**Major**: missing named+default export or `index.ts` re-exports, missing `displayName` on
`forwardRef`, interactive element without keyboard/a11y support or SFX hooks, tests hitting real
audio/network or not restoring mocks, fixed-position preview without `transform-gpu` container.

**Minor**: naming, dead code, comments, Prettier-style nits.

## Verdict format

```
VERDICT: PASS | NEEDS_CHANGES
Critical: - file:line — issue — fix
Major: ...
Minor: ...
Checks not run: (say if /verify results were not available)
```

PASS requires zero Critical and zero Major findings.
