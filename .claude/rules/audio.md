---
paths:
    - 'src/core/audio/**'
    - 'public/sounds/**'
    - 'src/ui/**/*.tsx'
---

# Audio (SFX) rules

- Interactive components use the hooks from `@core/audio`:
    - `useClickSfx(onClick)` returns a wrapped handler that plays `click`, then calls yours.
    - `useHoverSfx('button' | 'panel', { throttleMs })` returns an `onMouseEnter` handler (150ms
      default throttle; `'panel'` skips children marked `data-sfx-hover="button"`).
    - `useSfx()` returns `{ playOneShot, play, stop }` for other events. UI components never touch
      `audioEngine` or `AudioContext` directly.
- Mark hover-sound buttons with `data-sfx-hover="button"` (see `primitives/Button/Button.tsx`).
- SFX events are the `SfxEvent` union in `src/core/audio/config.ts`; each maps to an `SFX_CONFIG`
  entry `{ file, loop, volume, duckable, duckedVolume? }`.
- `file` is relative to `public/sounds/` and **must exist** (usual layout `<event>/<event>_1.mp3`; some events use `_default` / named variants such as `boot/boot_default.mp3`).
  After any config change run `ls public/sounds/<event>`.
- `public/sounds/**` is excluded from ESLint; assets are tracked in git (`MANIFEST.md` lists them).
- Tests mock the engine (`vi.mock('@core/audio/audioEngine')`) — see `core/audio/__tests__`.
- To add a sound, use the `/add-sound` skill.
