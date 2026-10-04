import type { DocsGroup, DocsPage } from './nav.types';

/** Sidebar order of the groups. */
export const GROUP_ORDER: DocsGroup[] = [
    'Getting started',
    'Customization',
    'Primitives',
    'Forms',
    'HUD decoration',
    'Voice & status',
    'Compositions',
    'Charts',
    'Media',
    'Window',
    'Orb',
    'Hooks',
    'Utilities',
    'Dev tools',
    'Reference',
];

/**
 * Every docs page, in sidebar order within its group. Each `slug` must have a matching
 * `pages/<slug>.mdx` (`pages/index.mdx` for the landing page); `npm run docs:check` verifies this.
 */
export const PAGES: DocsPage[] = [
    { slug: '', title: 'Overview' },

    { slug: 'getting-started/installation', title: 'Installation', group: 'Getting started' },
    { slug: 'getting-started/usage', title: 'Usage', group: 'Getting started' },
    { slug: 'getting-started/sound', title: 'Sound effects', group: 'Getting started' },
    { slug: 'components/jarvis-provider', title: 'JarvisProvider', group: 'Getting started' },
    { slug: 'getting-started/ai', title: 'Using with AI', group: 'Getting started' },

    { slug: 'customization/theming', title: 'Theming', group: 'Customization' },
    { slug: 'customization/tokens', title: 'Design tokens', group: 'Customization' },
    { slug: 'customization/tailwind', title: 'Tailwind', group: 'Customization' },

    { slug: 'components/stack', title: 'Stack', group: 'Primitives' },
    { slug: 'components/grid', title: 'Grid', group: 'Primitives' },
    { slug: 'components/button', title: 'Button', group: 'Primitives' },
    { slug: 'components/icon-button', title: 'IconButton', group: 'Primitives' },
    { slug: 'components/link', title: 'Link', group: 'Primitives' },
    { slug: 'components/tooltip', title: 'Tooltip', group: 'Primitives' },
    { slug: 'components/divider', title: 'Divider', group: 'Primitives' },
    { slug: 'components/pill', title: 'Pill', group: 'Primitives' },
    { slug: 'components/label', title: 'Label', group: 'Primitives' },
    { slug: 'components/mono', title: 'Mono', group: 'Primitives' },
    { slug: 'components/metric', title: 'Metric', group: 'Primitives' },
    { slug: 'components/progress-bar', title: 'ProgressBar', group: 'Primitives' },
    { slug: 'components/sparkline', title: 'Sparkline', group: 'Primitives' },
    { slug: 'components/icon', title: 'Icon', group: 'Primitives' },
    { slug: 'components/hint', title: 'Hint', group: 'Primitives' },
    { slug: 'components/kbd', title: 'Kbd', group: 'Primitives' },
    { slug: 'components/toast', title: 'Toast', group: 'Primitives' },
    { slug: 'components/panel', title: 'Panel', group: 'Primitives' },
    { slug: 'components/top-bar', title: 'TopBar', group: 'Primitives' },
    { slug: 'components/brand-mark', title: 'BrandMark', group: 'Primitives' },

    { slug: 'components/input', title: 'Input', group: 'Forms' },
    { slug: 'components/textarea', title: 'Textarea', group: 'Forms' },
    { slug: 'components/select', title: 'Select', group: 'Forms' },
    { slug: 'components/checkbox', title: 'Checkbox', group: 'Forms' },
    { slug: 'components/radio-group', title: 'RadioGroup', group: 'Forms' },
    { slug: 'components/switch', title: 'Switch', group: 'Forms' },
    { slug: 'components/slider', title: 'Slider', group: 'Forms' },

    { slug: 'components/corner-brackets', title: 'CornerBrackets', group: 'HUD decoration' },
    { slug: 'components/scanlines', title: 'Scanlines', group: 'HUD decoration' },
    { slug: 'components/grid-background', title: 'GridBackground', group: 'HUD decoration' },
    { slug: 'components/glow-frame', title: 'GlowFrame', group: 'HUD decoration' },
    { slug: 'components/reticle', title: 'Reticle', group: 'HUD decoration' },
    { slug: 'components/light-trace', title: 'LightTrace', group: 'HUD decoration' },
    { slug: 'components/panel-bloom', title: 'PanelBloom', group: 'HUD decoration' },
    { slug: 'components/panel-rails', title: 'PanelRails', group: 'HUD decoration' },
    { slug: 'components/viewport-corners', title: 'ViewportCorners', group: 'HUD decoration' },
    { slug: 'components/star-field', title: 'StarField', group: 'HUD decoration' },
    { slug: 'components/reactor', title: 'Reactor', group: 'HUD decoration' },
    { slug: 'components/scene', title: 'Scene', group: 'HUD decoration' },

    { slug: 'components/push-to-talk-button', title: 'PushToTalkButton', group: 'Voice & status' },
    { slug: 'components/waveform-meter', title: 'WaveformMeter', group: 'Voice & status' },
    { slug: 'components/wave-strip', title: 'WaveStrip', group: 'Voice & status' },
    { slug: 'components/status-label', title: 'StatusLabel', group: 'Voice & status' },

    { slug: 'components/callout', title: 'Callout', group: 'Compositions' },
    { slug: 'components/code-block', title: 'CodeBlock', group: 'Compositions' },
    { slug: 'components/dialog', title: 'Dialog', group: 'Compositions' },
    { slug: 'components/glass-card', title: 'GlassCard', group: 'Compositions' },
    { slug: 'components/hud-shell', title: 'HUDShell', group: 'Compositions' },
    { slug: 'components/nav-list', title: 'NavList', group: 'Compositions' },
    { slug: 'components/status-badge', title: 'StatusBadge', group: 'Compositions' },
    { slug: 'components/status-dock', title: 'StatusDock', group: 'Compositions' },
    { slug: 'components/table', title: 'Table', group: 'Compositions' },
    { slug: 'components/tabs', title: 'Tabs', group: 'Compositions' },
    { slug: 'components/toast-provider', title: 'ToastProvider', group: 'Compositions' },
    { slug: 'components/window-manager', title: 'WindowManager', group: 'Compositions' },

    { slug: 'components/line-chart', title: 'LineChart', group: 'Charts' },
    { slug: 'components/area-chart', title: 'AreaChart', group: 'Charts' },
    { slug: 'components/bar-chart', title: 'BarChart', group: 'Charts' },

    { slug: 'components/media-controls', title: 'MediaControls', group: 'Media' },
    { slug: 'components/media-player', title: 'MediaPlayer', group: 'Media' },
    { slug: 'components/you-tube-player', title: 'YouTubePlayer', group: 'Media' },
    { slug: 'components/web-frame', title: 'WebFrame', group: 'Media' },

    { slug: 'components/window', title: 'Window', group: 'Window' },
    { slug: 'components/snap-overlay', title: 'SnapOverlay', group: 'Window' },
    { slug: 'components/swap-overlay', title: 'SwapOverlay', group: 'Window' },
    { slug: 'components/slot-ghost', title: 'SlotGhost', group: 'Window' },

    { slug: 'components/css-orb', title: 'CssOrb', group: 'Orb' },
    { slug: 'components/three-orb', title: 'ThreeOrb', group: 'Orb' },

    { slug: 'hooks/sound-hooks', title: 'Sound hooks', group: 'Hooks' },
    { slug: 'hooks/use-audio-engine', title: 'useAudioEngine', group: 'Hooks' },
    { slug: 'hooks/use-draggable', title: 'useDraggable', group: 'Hooks' },
    { slug: 'hooks/use-resizable', title: 'useResizable', group: 'Hooks' },
    { slug: 'hooks/use-slot-drag', title: 'useSlotDrag', group: 'Hooks' },

    { slug: 'utilities/slot-grid', title: 'Slot grid', group: 'Utilities' },
    { slug: 'utilities/helpers', title: 'cx & time helpers', group: 'Utilities' },

    { slug: 'components/state-simulator', title: 'StateSimulator', group: 'Dev tools' },
    { slug: 'components/tweaks', title: 'Tweaks', group: 'Dev tools' },

    { slug: 'changelog', title: 'Changelog', group: 'Reference' },
];
