---
paths:
    - 'src/ui/showcase/**'
    - 'src/ui/index.ts'
---

# Showcase rules

The showcase (`npm run dev`) is the library's documentation and visual test bed.

- **Every public component needs a demo** covering its variants/states, built from `ShowcaseCard`
  (`label`, `code` snippet string, children, optional `dark`). The `code` snippet must be valid usage.
- A section is `src/ui/showcase/sections/<Topic>Section.tsx` exporting `<Topic>Section`, rendering
  `<section id="<nav-id>" className="flex flex-col gap-4">` with an `h2`, a description line and a
  grid of `ShowcaseCard`s. Several components may share a section (e.g. `PrimitivesTextSection`).
- **Add a section:**
    1. create the section file;
    2. import it in `src/ui/showcase/Showcase.tsx`;
    3. add `{ id, label, group }` to `NAV` there (`id` equals the section's `id`; `group` is the
       `NavGroup` union in `Showcase.types.ts` — extend the union if a new group is needed);
    4. render it in `<main>` in the same order as `NAV`.
       Extending an existing section needs no nav change.
- The component rules apply to showcase files too: one component per file, types in `.types.ts`,
  helpers in `utils.ts` / `*.utils.tsx`, no new inline styles.
- **Fixed-position HUD pieces** (`HUDShell`, `WindowManager`, `ViewportCorners`, overlays) escape
  to the viewport. Wrap previews in a container with `relative overflow-hidden transform-gpu` and an
  explicit height — `transform-gpu` creates the containing block for `position: fixed` children.
  See `HUDShellSection.tsx` and `WindowsSection.tsx`.
- Showcase code imports components relatively (`../../primitives/Button`), like the rest of `src/ui`.
- `ShowcaseSfxRoot` provides SFX and the mute toggle; do not add a second provider.
- Verify in a browser; a green build does not prove a preview looks right (`/verify`).
