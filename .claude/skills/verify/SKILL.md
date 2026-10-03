---
name: verify
description: Run the full jarvis-ui-lib verification (typecheck, test, lint with 0 warnings, format check, builds, docs check) and visually check affected showcase sections and docs pages in the browser with Playwright. Use before declaring work done, before committing, or when asked to verify, check or validate changes.
disable-model-invocation: true
allowed-tools: Bash(npm run *) Bash(npx vite *) Bash(npx prettier *) Bash(git status *) Bash(git diff *)
---

# Verify

## 1. Static checks (run in order, stop and fix on first failure)

```bash
npm run typecheck
npm test
npm run lint            # 0 errors AND 0 warnings
npm run format:check    # fix with: npx prettier --write <your changed files>
npm run build
npm run build:showcase
npm run build:docs
npm run docs:check      # changed components must not be listed (use -- --only <Name>)
```

Report pass/fail per step with the counts (tests passed, lint problems). Do not "fix" failures by
loosening ESLint/tsconfig, adding `eslint-disable`, or touching `src/ui/orb/orbEngine.ts`. Only run
`npm run format` / `lint:fix` on files you own (other edits may be in flight) — prefer
`npx prettier --write <files>`.

## 2. Visual check (needed for any UI change)

1. Start the dev server in the background: `npm run dev` (port 5173; use `npx vite --no-open` to
   avoid opening a browser).
2. With the Playwright MCP tools: `browser_navigate` to `http://localhost:5173`, click the nav item
   (or navigate to `#<section-id>`) for each affected section, `browser_take_screenshot`, and
   check `browser_console_messages` for errors/warnings.
3. Look for: unstyled output (missing `@import` in `src/ui/components.css`), fixed-position pieces
   escaping their preview (missing `transform-gpu` container), radius > 4px, non-mono fonts,
   hover/focus states, layout at the demo width.
4. For changed components, also check their docs page: `npm run preview:docs` (port 4174) and
   open `http://localhost:4174/jarvis_ui_lib/components/<slug>`. Demos render, the code toggle
   works, the API table shows types/defaults/descriptions, no console errors.
5. Stop the servers afterwards.

## 3. Report

```
typecheck: PASS | test: PASS (N) | lint: PASS (0/0) | format: PASS | build: PASS | docs: PASS
visual: <sections checked + findings>
```

Anything failing → NEEDS_FIXES with the first concrete error.
