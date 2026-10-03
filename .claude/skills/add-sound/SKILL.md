---
name: add-sound
description: Add a new sound effect (SFX) to jarvis-ui-lib — audio file in public/sounds, SfxEvent and SFX_CONFIG entry, and hook usage in a component. Use when asked to add, wire up or change a UI sound, SFX event or audio feedback.
argument-hint: '<event_name> [path to mp3]'
---

# Add sound

Event: `$ARGUMENTS`. Read `.claude/rules/audio.md` first.

1. **File:** place the mp3 at `public/sounds/<event>/<event>_1.mp3` (variants `_2`, `_3`, ...).
   Add a row for it in `public/sounds/MANIFEST.md`. Never edit existing audio files.
2. **Type + config** in `src/core/audio/config.ts`:
    - add `| '<event>'` to the `SfxEvent` union;
    - add `<event>: { file: '<event>/<event>_1.mp3', loop: false, volume: 0.6, duckable: false }`
      to `SFX_CONFIG` (`file` relative to `public/sounds/`; `loop: true` only for continuous sounds
      like `scan`/`drag_move`; `duckable: true` for background sounds; optional `duckedVolume`).
      `Record<SfxEvent, SfxEntry>` forces both edits — typecheck fails if one is missing.
3. **Verify the path exists:** `ls public/sounds/<event>/` and confirm the exact filename matches.
4. **Use it** in a component via `const { playOneShot } = useSfx();` from `@core/audio`
   (`playOneShot('<event>')`; for loops `play`/`stop`). Click/hover feedback: use `useClickSfx` /
   `useHoverSfx` instead of new events.
5. **Test:** assert `playOneShot` was called with `'<event>'` using a mocked `SfxContext.Provider`
   (see `primitives/Button/__tests__/Button.test.tsx`).
6. Run `/verify` (typecheck, tests, lint, format, build).
