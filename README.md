# jarvis-react-ui

Sharp, dark, HUD-style React components: primitives, inputs, dialogs, toasts, tables, charts, a
window/slot-grid system and a CSS / Three.js orb. JetBrains Mono, glow instead of shadows, built-in
UI sound effects.

### 📖 Documentation: **https://joeyash.github.io/jarvis_ui_lib/**

Guides, theming playground, design tokens, live demos with copy-pasteable source and generated API
tables for every component. Press <kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> to search.

[![CI](https://github.com/JoeyAsh/jarvis_ui_lib/actions/workflows/ci.yml/badge.svg)](https://github.com/JoeyAsh/jarvis_ui_lib/actions/workflows/ci.yml)
[![Docs](https://github.com/JoeyAsh/jarvis_ui_lib/actions/workflows/docs.yml/badge.svg)](https://joeyash.github.io/jarvis_ui_lib/)
[![npm](https://img.shields.io/npm/v/jarvis-react-ui)](https://www.npmjs.com/package/jarvis-react-ui)
[![license](https://img.shields.io/npm/l/jarvis-react-ui)](LICENSE)

## Features

- 60 documented components: buttons, inputs, switches, tooltips, tabs, tables, dialogs, toasts,
  code blocks, line/area/bar charts, panels, HUD shell, status dock and decorative HUD layers
- `JarvisProvider`: one root provider for UI sounds, toasts and app controls
- Drag, resize and snap window system on a 9-slot grid (`WindowManager`)
- CSS orb (`CssOrb`) and a Three.js orb (`ThreeOrb`, separate entry so `three` stays optional)
- UI sound effects (click, hover, drag, boot, ...), on by default, silent without a provider
- Accessible: keyboard support, ARIA roles, focus management, reduced-motion support
- Fully typed (TypeScript declarations with JSDoc), ESM only, tree-shakeable
- Ships one compiled stylesheet. Tailwind is **not** required in your project

## Install

```bash
npm i jarvis-react-ui react react-dom lucide-react
```

Peer dependencies: `react` and `react-dom` (^19) and `lucide-react`. `three` is only needed for
`ThreeOrb` from `jarvis-react-ui/orb`.

## Quick start

```tsx
// main.tsx
import 'jarvis-react-ui/style.css';
import { createRoot } from 'react-dom/client';
import { JarvisProvider } from 'jarvis-react-ui';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
    <JarvisProvider>
        <App />
    </JarvisProvider>,
);
```

```tsx
// App.tsx
import { Button, Metric, Panel, Pill, useToast } from 'jarvis-react-ui';

export function App() {
    const { toast } = useToast();
    return (
        <Panel title="System">
            <Metric value={42} unit="%" />
            <Pill variant="ok">online</Pill>
            <Button onClick={() => toast({ variant: 'success', title: 'Diagnostics passed' })}>
                Run diagnostics
            </Button>
        </Panel>
    );
}
```

The stylesheet contains the design tokens, the compiled utility layer, keyframes and all component
styles (including Tailwind's preflight reset), and loads JetBrains Mono from Google Fonts. Import it
once at the root of your app. See
[Installation](https://joeyash.github.io/jarvis_ui_lib/getting-started/installation) and
[Usage](https://joeyash.github.io/jarvis_ui_lib/getting-started/usage).

## Sound effects

`JarvisProvider` starts the audio engine; sound is on by default. `<JarvisProvider sfx={false}>`
starts muted, and `useJarvis()` returns `{ isMuted, toggleMute }` for a mute switch (the choice is
stored in `localStorage`).

The sound files ship in the package under `public/sounds` and are loaded from `/sounds/` by default.
Either copy them into your static folder, or point the engine at your own path or a CDN:

```bash
cp -r node_modules/jarvis-react-ui/public/sounds public/sounds
```

```tsx
<JarvisProvider soundBaseUrl="https://cdn.jsdelivr.net/npm/jarvis-react-ui@0.1.0/public/sounds/">
```

Browsers only start audio after a user gesture; missing files are logged and skipped. Details,
manual setup without the provider and the sound hooks for your own components:
[Sound effects](https://joeyash.github.io/jarvis_ui_lib/getting-started/sound).

## Three.js orb

```tsx
import { lazy, Suspense } from 'react';

const ThreeOrb = lazy(() => import('jarvis-react-ui/orb').then((m) => ({ default: m.ThreeOrb })));

export const Orb = () => (
    <Suspense fallback={null}>
        <ThreeOrb state="idle" />
    </Suspense>
);
```

`CssOrb` is exported from the main entry and has no extra dependency.

## Components

Every component has a page with live demos and an API table in the
[documentation](https://joeyash.github.io/jarvis_ui_lib/).

- **Primitives**: `Button`, `IconButton`, `Input`, `Switch`, `Link`, `Tooltip`, `Divider`, `Pill`,
  `Label`, `Mono`, `Metric`, `ProgressBar`, `Sparkline`, `Icon`, `Hint`, `Kbd`, `Toast`, `Panel`,
  `TopBar`, `BrandMark`
- **HUD decoration**: `CornerBrackets`, `Scanlines`, `GridBackground`, `GlowFrame`, `Reticle`,
  `LightTrace`, `PanelBloom`, `PanelRails`, `ViewportCorners`, `StarField`, `Reactor`, `Scene`
- **Voice & status**: `PushToTalkButton`, `WaveformMeter`, `WaveStrip`, `StatusLabel`
- **Compositions**: `JarvisProvider`, `ToastProvider`, `Dialog`, `Callout`, `CodeBlock`, `NavList`,
  `Table`, `Tabs`, `GlassCard`, `HUDShell`, `StatusBadge`, `StatusDock`, `WindowManager`
- **Charts**: `LineChart`, `AreaChart`, `BarChart`
- **Window system**: `Window`, `SnapOverlay`, `SwapOverlay`, `SlotGhost`, slot-grid helpers
  (`computeSlot`, `computeAllSlots`, `slotAtPoint`, ...)
- **Orb**: `CssOrb` (main entry), `ThreeOrb` and `createOrb` (`jarvis-react-ui/orb`)
- **Hooks**: `useToast`, `useJarvis`, `useSfx`, `useClickSfx`, `useHoverSfx`, `useAudioEngine`,
  `useDraggable`, `useResizable`, `useSlotDrag`
- **Utilities**: `cx`, `formatTime`, `relativeTime`, `formatAge`, `formatDuration`
- **Dev tools**: `StateSimulator`, `Tweaks`

## Theming

All colors, glows, radii, spacing, z-indices and timings are CSS custom properties. Override them
on `:root` after importing the stylesheet:

```css
:root {
    --accent: #e8a84c;
    --accent-bright: #ffc76e;
    --accent-dim: #a1702d;
    --glow: 0 0 8px #e8a84caa;
    --shadow-glow: 0 0 8px #e8a84caa; /* glow utilities read --shadow-glow* */
}
```

To re-theme only part of the page, also set the `--color-*` aliases on that element (e.g.
`--color-accent`). The [Theming](https://joeyash.github.io/jarvis_ui_lib/customization/theming)
page has a live playground, and the full list is under
[Design tokens](https://joeyash.github.io/jarvis_ui_lib/customization/tokens). Design rules: sharp
edges (max 4px radius), glow instead of drop shadows, JetBrains Mono only, dark only.

## Development

```bash
git clone https://github.com/JoeyAsh/jarvis_ui_lib.git
cd jarvis_ui_lib
npm ci
npm run docs:dev         # documentation site at http://localhost:5174/jarvis_ui_lib/
npm run dev              # internal showcase at http://localhost:5173
```

| Script                   | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `npm run docs:dev`       | Documentation site dev server                             |
| `npm run build:docs`     | Build the documentation site into `dist-docs/`            |
| `npm run docs:check`     | Docs coverage per component (page, demo, nav, prop JSDoc) |
| `npm run dev`            | Showcase dev server                                       |
| `npm run build`          | Build the library into `dist/` (JS, .d.ts, CSS)           |
| `npm run build:showcase` | Type-check and build the showcase app                     |
| `npm test`               | Vitest (single run)                                       |
| `npm run typecheck`      | Type-check the library, docs and scripts                  |
| `npm run lint`           | ESLint (0 errors and 0 warnings required)                 |
| `npm run format:check`   | Prettier check (`npm run format` writes)                  |

## Contributing

Contributions are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md). Every new or changed component
ships with tests, a showcase demo and a documentation page. Releases are described in
[RELEASING.md](RELEASING.md).

## License

[MIT](LICENSE) (c) 2026 JoeyAsh.

The sound effects in `public/sounds` were generated with ElevenLabs by the author and are
distributed under the same MIT license by their owner, see [NOTICE](NOTICE).
