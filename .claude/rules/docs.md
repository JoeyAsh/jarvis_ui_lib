---
paths:
    - 'src/ui/**'
    - 'src/core/audio/**'
    - 'docs/**'
---

# Documentation rule

The documentation site (`docs/`, deployed to https://joeyash.github.io/jarvis_ui_lib/) is part of
the component process. This rule is mandatory: **creating or changing a component always includes
its docs, in the same PR.**

## Every public component has

1. **A page** `docs/src/pages/components/<slug>.mdx` (`<slug>` = kebab-case export name,
   `IconButton` → `icon-button`), structured like `button.mdx`: `# Name`, `<Lead>`,
   `<ComponentMeta component="Name" />`, one `##` section per use case with a `<Demo />`,
   Accessibility (and Sound for interactive components), and `## API` with
   `<ApiTable component="Name" />`.
2. **At least one demo** in `docs/src/demos/<slug>/<DemoName>.tsx`: one default-exported function
   component, imports from `'@ui'` only (plus `lucide-react` / React). The file is shown verbatim
   as the example code, so it must be short, idiomatic and copy-pasteable.
3. **A sidebar entry** in `docs/src/nav.ts` (`{ slug: 'components/<slug>', title, group }`).
4. **JSDoc on every public prop** in `<Name>.types.ts`, including `children` and `className`, with
   `@default` for defaulted props. The API table is generated from it (`npm run docs:api`), and the
   comments also ship in the `.d.ts` files.

## Changes and removals

- New prop, variant or behavior → update JSDoc, demos and page text in the same PR.
- Removed or renamed component → remove or rename its page, demos and nav entry; mark deprecated
  components with a `<Callout variant="warning">` on their page.

## Building the docs from the library

- The docs UI uses **only** `jarvis-react-ui` components. If the site needs a component the library
  lacks (input, tabs, chart, ...), add it to the library with `/new-component` instead of writing a
  docs-only component. Docs-app glue (layout, MDX mapping, Demo/ApiTable) lives in `docs/src/`.
- Docs app code follows the same TypeScript and styling rules as `src/` (no `any`, `!`, inline
  styles except CSS-variable injection, ...). Import the library through `@ui`.

## Checks

- `npm run docs:check -- --only <Name>` must pass for every component you add or change.
- `npm run build:docs` must pass; `npm run docs:check` runs in CI.
- Scaffold pages with `/docs-page`. `/new-component` runs it as a required step.
