# jarvis-react-ui

Sharp, dark, HUD-style React components: primitives, compositions, a window/slot-grid system and a
CSS / Three.js orb. JetBrains Mono, glow instead of shadows, built-in UI sound effects.

**Documentation: https://joeyash.github.io/jarvis_ui_lib/** (guides, theming, live demos and API
tables for every component).

[![CI](https://github.com/JoeyAsh/jarvis_ui_lib/actions/workflows/ci.yml/badge.svg)](https://github.com/JoeyAsh/jarvis_ui_lib/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/jarvis-react-ui)](https://www.npmjs.com/package/jarvis-react-ui)
[![license](https://img.shields.io/npm/l/jarvis-react-ui)](LICENSE)

<!-- TODO: add a screenshot of the showcase here -->

## Features

- 30+ primitives and compositions (panels, buttons, pills, metrics, sparklines, HUD shell, status dock, ...)
- Drag, resize and snap window system on a 9-slot grid (`WindowManager`)
- CSS orb (`CssOrb`) and a Three.js orb (`ThreeOrb`, separate entry so `three` stays optional)
- Optional UI sound effects (click, hover, drag, boot, ...) through a small React context
- Fully typed (TypeScript declarations included), ESM only, tree-shakeable
- Ships one compiled stylesheet. Tailwind is **not** required in your project

## Install

```bash
npm i jarvis-react-ui
```

Peer dependencies: `react` and `react-dom` (^19) and `lucide-react`. `three` is only needed if you
use `ThreeOrb` from `jarvis-react-ui/orb`.

```bash
npm i react react-dom lucide-react   # plus three, for the Three.js orb
```

## Quick start

```tsx
import 'jarvis-react-ui/style.css'; // once, e.g. in your app entry
import { Panel, Button, Pill, Metric } from 'jarvis-react-ui';

export function App() {
    return (
        <Panel title="System">
            <Metric value={42} unit="%" />
            <Pill variant="ok">online</Pill>
            <Button>Run diagnostics</Button>
        </Panel>
    );
}
```

The stylesheet contains the design tokens (CSS custom properties), a compiled utility layer used by
the components, keyframes and all component styles. It also includes Tailwind's preflight reset, so
import it once at the root of your app. It loads JetBrains Mono from Google Fonts.

The [documentation site](https://joeyash.github.io/jarvis_ui_lib/) has live demos and the full API
of every component.

### Sound effects

Interactive components play sounds through a React context. Without a provider they are silent
no-ops. To enable audio, mount the engine once and pass it to `SfxProvider`:

```tsx
import { SfxProvider, useAudioEngine } from 'jarvis-react-ui';

export function Root({ children }: { children: React.ReactNode }) {
    const { playOneShot, play, stop } = useAudioEngine('idle', true);
    return (
        <SfxProvider playOneShot={playOneShot} play={play} stop={stop}>
            {children}
        </SfxProvider>
    );
}
```

#### Sounds

The sound files ship inside the package under `public/sounds`. The audio engine loads them from a
**base URL** that defaults to `/sounds/` of your site. There are two ways to provide them:

**1. Copy them to your static directory (default, no configuration):**

```bash
cp -r node_modules/jarvis-react-ui/public/sounds public/sounds
```

**2. Point `soundBaseUrl` at your own path or a CDN** (pin the package version in the URL):

```tsx
const { playOneShot, play, stop } = useAudioEngine('idle', true, false, {
    soundBaseUrl: 'https://unpkg.com/jarvis-react-ui@0.1.0/public/sounds/',
});
```

Alternative base URLs:

- own path: `/assets/sfx/`
- unpkg: `https://unpkg.com/jarvis-react-ui@0.1.0/public/sounds/`
- jsDelivr: `https://cdn.jsdelivr.net/npm/jarvis-react-ui@0.1.0/public/sounds/`

The value may be a relative path or an absolute URL; a trailing slash is added if missing. Query
strings and hashes are rejected (an `Error` is thrown). The audio engine is a process-wide
singleton: the last applied URL wins, and omitting the option does not reset a previously set URL.
The URL is applied in an effect, so set it high in the tree (or call
`getAudioEngine().setSoundBaseUrl()` before render) if child components play sounds on mount.
Outside React you can call `getAudioEngine().setSoundBaseUrl(url)` directly. Changing the base URL
drops the cached sounds so they reload from the new location. A CDN must send CORS headers (unpkg
and jsDelivr do).

The files are also addressable as `jarvis-react-ui/sounds/*` through the package `exports` map for
bundlers that handle assets. Browsers only start audio after a user gesture. Missing files are
logged and skipped; nothing throws.

### Three.js orb

```tsx
import { ThreeOrb } from 'jarvis-react-ui/orb'; // requires the `three` peer dependency

export const Orb = () => <ThreeOrb state="idle" />;
```

`CssOrb` is exported from the main entry and has no extra dependency.

## Components

**Primitives** - `Button`, `Pill`, `Label`, `Metric`, `Mono`, `ProgressBar`, `Sparkline`, `Panel`,
`TopBar`, `StatusLabel`, `Icon`, `BrandMark`, `Hint`, `PushToTalkButton`, `WaveformMeter`,
`WaveStrip`, and decorative layers: `CornerBrackets`, `Scanlines`, `GridBackground`, `GlowFrame`,
`Reticle`, `LightTrace`, `PanelBloom`, `PanelRails`, `ViewportCorners`, `StarField`, `Reactor`.

**Compositions** - `HUDShell`, `GlassCard`, `StatusBadge`, `StatusDock`, `WindowManager`.

**Window system** - `Window`, `SnapOverlay`, `SwapOverlay`, `SlotGhost`, slot-grid helpers
(`computeSlot`, `computeAllSlots`, `slotAtPoint`, ...) and the hooks `useDraggable`, `useResizable`
and `useSlotDrag`.

**Orb** - `CssOrb` (main entry), `ThreeOrb` and `createOrb` (`jarvis-react-ui/orb`).

**Audio** - `SfxProvider`, `useSfx`, `useClickSfx`, `useHoverSfx`, `useAudioEngine`.

**Utilities** - `cx`, `formatDuration`, `formatAge`, `formatTime`, `relativeTime`.

## Theming

All colors, spacing, z-indices, glow and motion values are CSS custom properties on `:root`
(`--bg`, `--surface`, `--accent`, `--text`, `--glow`, `--r-1`, `--s-*`, `--z-*`, `--dur-*`, ...).
Override them after importing the stylesheet:

```css
:root {
    --accent: #e8a84c;
    --accent-bright: #ffc870;
}
```

Components use the tokens only, so one override re-themes everything. Design rules: sharp edges
(max 4px radius), glow instead of drop shadows, JetBrains Mono only.

## Showcase and development

```bash
git clone https://github.com/JoeyAsh/jarvis_ui_lib.git
cd jarvis_ui_lib
npm ci
npm run dev              # live showcase at http://localhost:5173
```

| Script                   | Purpose                                         |
| ------------------------ | ----------------------------------------------- |
| `npm run dev`            | Showcase dev server                             |
| `npm run build`          | Build the library into `dist/` (JS, .d.ts, CSS) |
| `npm run build:showcase` | Type-check and build the showcase app           |
| `npm test`               | Vitest (single run)                             |
| `npm run typecheck`      | `tsc --noEmit`                                  |
| `npm run lint`           | ESLint (0 errors and 0 warnings required)       |
| `npm run format:check`   | Prettier check (`npm run format` writes)        |
| `npm run docs:dev`       | Documentation site dev server                   |
| `npm run build:docs`     | Build the documentation site into `dist-docs/`  |

## Contributing

Contributions are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md). Releases are described in
[RELEASING.md](RELEASING.md).

## License

[MIT](LICENSE) (c) 2026 JoeyAsh.

The sound effects in `public/sounds` were generated with ElevenLabs by the author and are
distributed under the same MIT license by their owner, see [NOTICE](NOTICE).
