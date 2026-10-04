# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `WebFrame`: a web page in a sandboxed iframe with a toolbar (address, reload, open in new tab);
  only `http(s)` URLs are loaded.
- Layout: `Stack` (column or row, `gap` on the `--s-*` tokens, `align`, `justify`, `wrap`) and `Grid`
  (1–6 equal columns or auto-fit with `minColumnWidth`) lay out content without Tailwind.
- Form controls:
    - `Slider`: range input with pointer drag, track click and keyboard (arrows, PageUp/PageDown,
      Home/End), `onValueChange` / `onValueCommit`, `min` / `max` / `step`, `formatValue`, `fullWidth`.
    - `Checkbox`: native checkbox in HUD chrome with an `indeterminate` state.
    - `Textarea`: multi-line field matching `Input`, with `autoResize` between `rows` and `maxRows`.
    - `RadioGroup`: mutually exclusive options with roving focus, descriptions and disabled items.
    - `Select`: dropdown with keyboard navigation, typeahead and icons; the list opens in a portal,
      so it is not clipped inside windows, and Escape closes only the list.
- Docs: new "Forms" group in the sidebar (Input, Textarea, Select, Checkbox, RadioGroup, Switch,
  Slider).
- Media:
    - `MediaControls`: source-independent transport controls (play/pause, seek bar, time, mute,
      volume, optional previous/next/fullscreen), fully controlled, with `K` / `M` / arrow-key
      shortcuts; unknown or live durations show `LIVE`.
    - `MediaPlayer`: video or audio file player with `MediaControls`, captions track, error state
      and a `MediaHandle` ref (`play`, `pause`, `seek`, `setVolume`, `setMuted`).
    - `YouTubePlayer`: YouTube video with HUD controls via the IFrame Player API (loaded on first
      mount, privacy-enhanced `youtube-nocookie.com` by default), the same `MediaHandle`, and a
      "Watch on YouTube" fallback when embedding is disabled.
- Docs: new "Media" group in the sidebar.
- `WindowManager`: floating windows for content created at runtime. `ManagedWindow.floating` opens a
  window free-floating without a slot (no limit of nine), `defaultRect` sets its initial rect
  (otherwise it opens centred and cascades), and `closable` plus the new `onClose` prop add a close
  button and Escape-to-close. The window used last is drawn on top. A new floating window plays
  `menu_open`.
- `Window`: `closeOnEscape` and `stackIndex` props; closing now also plays `menu_close`.
- `StatusDock`: `labels` (status text per state, e.g. for localization) and `brand` props, passed
  through to the built-in `StatusLabel`.

### Changed

- `Window` / `WindowManager`: the window body now fills the window height, so content can use
  `height: 100%` (e.g. a `WebFrame` or a player filling a floating window).

### Fixed

- `ThreeOrb` (`particle`, `halo`, `signal`, `reactor`, `lattice`) and `createVariantOrb`: the canvas
  painted an opaque dark background over everything behind it, e.g. the `HUDShell` grid, stars and
  horizon. The variant orbs now render on a transparent canvas, including their bloom glow.

## [0.4.1] - 2026-10-04

### Fixed

- `style.css`: the published stylesheet contained no component styles and none of the library's
  keyframes (`.lib-panel`, `.hud-shell`, `.lib-scene`, ... had no rules), so components rendered
  unstyled. Affected every release up to 0.4.0. The build now fails when a component stylesheet
  or keyframe is missing from `dist/style.css`.
- `Panel`, `TopBar`, `StateSimulator` and `Tweaks`: the glass blur (`backdrop-filter`) was dropped
  from the built CSS in Chrome and Firefox; only the `-webkit-` variant was left.

## [0.4.0] - 2026-10-04

### Added

- Docs for AI coding assistants: the package ships `dist/llms.txt`, `dist/llms-full.txt` and
  `dist/api.json` (every public component with entry point, props and demo sources), also exported as
  `jarvis-react-ui/llms.txt`, `jarvis-react-ui/llms-full.txt` and `jarvis-react-ui/api.json`. The docs
  site serves `/llms.txt`, `/llms-full.txt` and a Markdown version of every page (`<page>.md`).
- API reference: the public helper types that props use (`TabItem`, `TableColumn<T>`, `TableAlign`,
  `AppOrbState`, `NavListGroup`, `ChartSeries`, ...) are documented with their fields or definition
  below each API table, in `llms-full.txt` and in `api.json` (`types` per component).

## [0.3.0] - 2026-10-03

### Added

- `ThreeOrb`: five new WebGL designs via the `variant` prop: `particle`, `halo`, `signal`, `reactor`
  and `lattice` (bloom-lit, each loaded as its own chunk). The original look stays the default as
  `constellation`.
- `ThreeOrb`: new props `quality` (`'high'` / `'low'` for weak GPUs), `interactive` (drag to rotate,
  scroll to zoom), `analyser` (Web Audio `AnalyserNode` for audio reactivity; the variant designs
  simulate a voice without one) and `fill` (`'viewport'` default, or `'container'` to fill the parent
  element).
- `jarvis-react-ui/orb`: `createVariantOrb(variant, container, options)` to drive the variant designs
  without React, `readAudio` / `createAudioBuffers` helpers, `ORB_VARIANTS`, `ORB_VISUAL_STATES`,
  `BAND_COUNT` and the `OrbRenderer`, `OrbVariant`, `OrbVisualState`, `OrbQuality`,
  `VariantOrbOptions`, `ThreeOrbVariant` and `ThreeOrbFill` types.

### Fixed

- `ThreeOrb` / `createOrb`: no longer log the `THREE.Clock` deprecation warning with three r183 or
  newer.

## [0.2.0] - 2026-10-03

### Added

- Charts: `LineChart` (linear or smooth, optional dots), `AreaChart` (optionally stacked) and
  `BarChart` (grouped or stacked, negative values). Dependency-free SVG in token colors, responsive
  width, nice y-axis ticks, legend, hover tooltip, keyboard inspection (arrow keys) and a
  screen-reader data table. Shared `ChartSeries`, `ChartColor` and `BaseChartProps` types.
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

- `StatusLabel`: `labels` prop to override or localize the text per state, and `live` prop that
  turns the status text into a polite live region.
- `StatusDock`: `pttLabel` prop for the accessible name of the built-in push-to-talk button.
- `StateSimulator`: `FOLLOW UP` button for the `follow_up` state.
- `WindowManager`: `onExpandedRectsChange` prop, so controlled `expandedRects` can be moved and
  resized.
- `HUDShell`: `working` shows an accent light trace along the top edge and a soft edge vignette.
- `Scene`: `starCount` prop (default 60).
- `CssOrb`, `ThreeOrb`: optional `aria-label`; when set, the orb is exposed as `role="img"`.
- `PushToTalkButton`: accepts all native `<button>` attributes and events (`disabled`, `id`,
  `onPointerDown` / `onPointerUp` for hold-to-talk, ...), forwards its `ref` and supports `aria-label`.
- `Hint`: the position union is exported as `HintPosition`.

### Changed

- `Label`, `Mono`, `Pill`, `Metric`: native attributes (`id`, `title`, `aria-*`, `data-*`, event
  handlers) are forwarded to the root element; `Mono` accepts `dateTime` for `as="time"`.
- `Icon`: decorative by default (`aria-hidden="true"` without `aria-label`); with `aria-label` it gets
  `role="img"`. `className` no longer defaults to an empty string.
- `Window`: the root is a non-modal `role="region"` named by its title (was `role="dialog"`);
  `onDragStart` / `onResizeStart` are typed with the native `PointerEvent` they receive; header icons
  are lucide-react icons; accent glows replace black drop shadows.
- `HUDShell`: idle panels are `inert`, and leaving idle crossfades like entering it.
- `StatusDock`: the state text is a polite live region, so state changes are announced.
- `StatusLabel`: `follow_up` shows `follow-up...` instead of `listening...`.
- `GlassCard`: draws one set of corner brackets (the Panel's own) instead of two.
- `LightTrace`: `color` also tints the bright center and glow, not only the tails.
- `PushToTalkButton`: `onClick` is a standard click handler and receives the event (no-argument
  handlers still work).
- `useTweakApply`: removes the CSS variables it set when the component unmounts.
- `StateSimulator`, `Tweaks`: buttons and swatches expose their selection via `aria-pressed`.
- `Hint`: the fixed corner modifier class is now `lib-hint--fixed-br` (was `fixed-br`); `Hint.Key`
  renders the `Kbd` chip.
- Styling: inline styles were replaced by classes and CSS variables in `ProgressBar`, `Sparkline`,
  `Reticle`, `CornerBrackets`, `Scanlines`, `GridBackground`, `GlowFrame`, `StarField`, `CssOrb`,
  `Window`, `SnapOverlay`, `SwapOverlay` and `SlotGhost`; colors in `Sparkline`, `Scanlines`,
  `GridBackground`, `Scene`, `Reactor`, `CssOrb`, `PushToTalkButton` and `StateSimulator` derive from
  the theme tokens, so they follow token overrides. No visual change with the default tokens.

### Deprecated

- `PushToTalkButton`: the `ariaLabel` prop; use `aria-label` instead (it wins when both are set).

### Fixed

- `GlowFrame` `breathe`, `GridBackground` `drift`, `Scanlines` `sweep` and the `StatusBadge` pulse
  referenced animations that did not exist, so they did nothing (`breathe` even removed the glow).
  The keyframes now ship in the stylesheet.
- `prefers-reduced-motion` is now respected by `GridBackground` drift, `GlowFrame` breathe (falls back
  to the static glow), `StarField` and `Scene` twinkle/drift, `LightTrace`, `PanelBloom`,
  `StatusBadge` pulse and the `CssOrb` particle loop.
- `CssOrb` is decorative by default (`aria-hidden`) instead of an `aria-label` on a role-less
  element; the `ThreeOrb` canvas is `aria-hidden` by default.
- `WindowManager`: dragging or resizing an expanded window with controlled `expandedRects` no longer
  snaps back; `homeAssignments` changes are picked up by Reset (was read once on mount).
- `Window`: double-clicking the header plays the `expand` / `collapse` sound like the button.
- `WaveformMeter`: every bar gets its own animation delay, not only the first 12.
- `Tweaks`: slider ids are unique per instance (`useId`).
- `StateSimulator`: the toolbar wraps on narrow screens instead of overflowing its container.
- `PushToTalkButton`: the rotating dashed rim was shifted to the top left (it reused a `spin`
  keyframe meant for centered orb rings).
- The stylesheet no longer defines `spin` and `pulse` keyframes, which overrode Tailwind's
  `animate-spin` / `animate-pulse` in apps that use Tailwind.

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

[Unreleased]: https://github.com/JoeyAsh/jarvis_ui_lib/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/JoeyAsh/jarvis_ui_lib/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/JoeyAsh/jarvis_ui_lib/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/JoeyAsh/jarvis_ui_lib/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/JoeyAsh/jarvis_ui_lib/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/JoeyAsh/jarvis_ui_lib/releases/tag/v0.1.0
