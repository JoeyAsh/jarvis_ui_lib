# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Initial public release (planned as 0.1.0).

### Added

- Component library: primitives (`Button`, `Pill`, `Label`, `Metric`, `Panel`, `Sparkline`,
  `ProgressBar`, decorative HUD layers, ...) and compositions (`HUDShell`, `GlassCard`,
  `StatusBadge`, `StatusDock`, `WindowManager`).
- Window system: draggable, resizable windows with a 9-slot snap grid (`Window`, `SnapOverlay`,
  `SwapOverlay`, `SlotGhost`, `useDraggable`, `useResizable`, `useSlotDrag`).
- Orbs: `CssOrb` in the main entry and `ThreeOrb` / `createOrb` in `jarvis-react-ui/orb`
  (`three` is an optional peer dependency).
- UI sound effects: `SfxProvider`, `useSfx`, `useClickSfx`, `useHoverSfx`, `useAudioEngine` and the
  bundled sound files.
- Configurable sound base URL: `AudioEngine.setSoundBaseUrl()` / `getSoundBaseUrl()`, the
  `soundBaseUrl` option of `useAudioEngine` (4th argument) and `DEFAULT_SOUND_BASE_URL` (`/sounds/`),
  so sounds can be served from a custom path or a CDN.
- Design tokens and a single compiled `style.css` (no Tailwind needed in consumer projects).
- Live showcase (`npm run dev`).
- Published as the ESM npm package `jarvis-react-ui` with TypeScript declarations, MIT licensed.

[Unreleased]: https://github.com/JoeyAsh/jarvis_ui_lib/commits/main
[0.1.0]: https://github.com/JoeyAsh/jarvis_ui_lib/releases/tag/v0.1.0
