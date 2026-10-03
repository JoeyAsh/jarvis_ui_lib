---
name: showcase-section
description: Add or extend a section of the jarvis-ui-lib showcase (the npm run dev preview) so a component has a visible demo, including the sidebar nav entry. Use when a component needs a showcase demo, or when asked to add/update a showcase section, nav item or preview.
argument-hint: '<component or topic> [existing section to extend]'
---

# Showcase section

Target: `$ARGUMENTS`. Read `.claude/rules/showcase.md` first.

## Extend an existing section (preferred when it fits)

Existing sections in `src/ui/showcase/sections/`: Overview, Tokens, PrimitivesText,
PrimitivesChrome, PrimitivesInteractive, Orb, Compositions, Windows, DevOverlays (plus helpers like
`WindowsSection.utils.tsx`). Add `ShowcaseCard`s to the matching one — no nav change needed.

## Add a new section

1. Create `src/ui/showcase/sections/<Topic>Section.tsx` (one component; types in
   `<Topic>Section.types.ts`; helpers in `utils.ts`):
    ```tsx
    export function TopicSection(): ReactElement {
        return (
            <section id="topic" className="flex flex-col gap-4">
                <div>
                    <h2 className="text-[12px] text-text font-mono mb-1">Topic</h2>
                    <p className="text-[10px] text-text-secondary font-mono">variants · states</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <ShowcaseCard label="DEFAULT" code={`<Thing />`}>
                        <Thing />
                    </ShowcaseCard>
                </div>
            </section>
        );
    }
    ```
    Model on `sections/ButtonsSection.tsx`. Cover every variant/size/state; `code` must be valid.
2. In `src/ui/showcase/Showcase.tsx`: import the section; add
   `{ id: 'topic', label: 'TOPIC', group: 'PRIMITIVES' }` to `NAV` (`id` equals the
   `<section id>`); render `<TopicSection />` in `<main>` in NAV order. New group → extend `NavGroup` in `Showcase.types.ts`.
3. Fixed-position pieces: wrap the preview in `relative overflow-hidden transform-gpu` with an
   explicit height (see `HUDShellSection.tsx`).
4. New component CSS must already be `@import`ed in `src/ui/components.css` (main.tsx loads it).
5. Run `/verify` and look at the section in the browser.
