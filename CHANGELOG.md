# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `Dialog`: modal dialog rendered into `document.body` with focus trap, Escape and backdrop closing,
  focus return, scroll lock, `initialFocusRef`, three sizes and `menu_open` / `menu_close` sounds.
- `Kbd`: keyboard key chip (`<kbd>`) in two sizes.
- `JarvisProvider`: root provider that mounts the audio engine (UI sounds, on by default, `sfx={false}`
  starts muted), the toast system and `useJarvis()` (`isMuted`, `toggleMute`).
- Toast notifications: `Toast` element, `ToastProvider` and `useToast()` (`toast`, `dismiss`,
  `dismissAll`) with four variants, actions, auto-dismiss that pauses on hover/focus, a queue
  (`max`), four placements, id-based replacement and variant sounds.
- `useAudioEngine`: new `initialMuted` option, used when the user has no stored mute preference.
- `CodeBlock`: new `onCopy` callback, called after the code was copied.

- New primitives: `Input` (text field with start/end adornments, sizes, invalid state), `IconButton`
  (square icon-only button with accessible label and pressed state), `Tooltip` (hover/focus bubble
  with placements), `Switch` (accessible on/off toggle, controlled or uncontrolled), `Divider`
  (horizontal/vertical separator with optional label) and `Link` (accent/muted/nav anchor with
  external and active states). All props carry JSDoc descriptions.
- New compositions: `NavList` (grouped side navigation with active entry, badges and an
  `onItemClick` hook for client-side routers), `Tabs` (accessible tab list with keyboard
  navigation, controlled or uncontrolled), `Table` (typed columns with custom cell renderers,
  dense mode, caption, empty state), `CodeBlock` (code panel with title, language label, copy
  button and optional pre-highlighted HTML) and `Callout` (info/success/warning/error note).
- Documentation website at https://joeyash.github.io/jarvis_ui_lib/ with getting-started guides,
  theming playground, design token reference, live demos with source and generated API tables;
  the package `homepage` now points to it.
- JSDoc descriptions for the props of `Button`, `Panel`, `TopBar`, `WindowManager`, `Input`,
  `IconButton`, `Switch`, `Link`, `Tooltip`, `Divider`, `Callout`, `CodeBlock`, `NavList`, `Table`
  and `Tabs`, shown in editor tooltips.
- JSDoc descriptions for the props of all primitives (`Pill`, `Label`, `Mono`, `Metric`,
  `ProgressBar`, `Sparkline`, `Icon`, `Hint`, `BrandMark`, the HUD decoration layers,
  `PushToTalkButton`, `WaveformMeter`, `WaveStrip`, `StatusLabel`, `StateSimulator`, `Tweaks`),
  with documentation pages and live demos for each.
- JSDoc descriptions for the props of `Window`, `SnapOverlay`, `SwapOverlay`, `SlotGhost`, `CssOrb`,
  `ThreeOrb`, `GlassCard`, `StatusBadge`, `StatusDock` and `HUDShell`. Every public component is now
  documented on the docs site, plus pages for the hooks and the slot-grid and time helpers.
- `TopBar`: new `position` prop (`'fixed'` default, `'sticky'`, `'static'`) so the bar can be used
  inside a page layout; new `TopBarPosition` type.

### Fixed

- `GlowFrame` `breathe`, `GridBackground` `drift`, `Scanlines` `sweep` and the `StatusBadge` pulse
  referenced animations that did not exist, so they did nothing (`breathe` even removed the glow).
  The keyframes now ship in the stylesheet.

## [0.1.0] - 2026-10-03

Initial public release.

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

[Unreleased]: https://github.com/JoeyAsh/jarvis_ui_lib/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/JoeyAsh/jarvis_ui_lib/releases/tag/v0.1.0
