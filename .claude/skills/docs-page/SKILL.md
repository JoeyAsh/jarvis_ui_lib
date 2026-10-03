---
name: docs-page
description: Create or update the documentation page of a jarvis-ui-lib component on the docs site (docs/) — MDX page, demo files, sidebar entry and prop JSDoc — and verify it with docs:check. Use when a component needs docs, when a component's props/behavior changed, or when asked to write, extend or fix a docs page.
argument-hint: '<ComponentName> [new|update]'
---

# Docs page

Target: `$ARGUMENTS`. Read `.claude/rules/docs.md` first, then the component's `.tsx`, `.types.ts`,
tests and showcase demo to understand its real behavior.

## Steps

1. **JSDoc**: every own prop in `src/ui/<group>/<Name>/<Name>.types.ts` (and public helper types)
   gets a one-sentence `/** ... */` comment, `@default` for defaulted props, including `children`
   and `className` (say which element receives it). Comments only, no type changes.
2. **Demos**: `docs/src/demos/<slug>/<DemoName>.tsx`, one per use case (variants, sizes, states,
   controlled usage, realistic composition). Default-export one function component, import from
   `'@ui'` only. Keep each file short; it is the example code readers copy. Fixed-position HUD
   pieces need `<Demo height="tall" />`; wide content `align="stretch"`.
3. **Page**: `docs/src/pages/components/<slug>.mdx`, modelled on `button.mdx`:
    ```mdx
    # Name

    <Lead>One or two sentences: what it is and when to use it.</Lead>
    <ComponentMeta component="Name" />
    ## <Use case>
    Short explanation. <Demo name="<slug>/<DemoName>" />
    ## Accessibility   (roles, aria attributes, keyboard support)
    ## Sound           (interactive components: which SFX events play)
    ## API
    <ApiTable component="Name" />
    ```
    Link related pages with `[Text](/components/<slug>)`. Use fenced code blocks for snippets that
    can't be demos (e.g. router integration).
4. **Nav**: add `{ slug: 'components/<slug>', title: 'Name', group: 'Primitives' | 'Compositions' | 'Window' | 'Orb' }`
   to `docs/src/nav.ts` (skip when updating).
5. **Verify**:
    - `npm run docs:check -- --only <Name>` exits 0.
    - `npm run typecheck`, `npm run lint` (0/0), `npx prettier --write <your files>`.
    - `npm run build:docs`, then `npm run preview:docs` and open
      `http://localhost:4174/jarvis_ui_lib/components/<slug>` with Playwright: demos render, the code
      toggle shows the source, the API table has types, defaults and descriptions, no console errors.

## Guardrails

- No docs-only UI components: missing building blocks go into the library (`/new-component`).
- Never edit `docs/generated/` (gitignored output of `npm run docs:api`).
- Stage only your files.
