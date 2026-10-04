import type { UiPropKind, UiRegistryMeta } from './registry.types';

const CHART_PROPS: Record<string, UiPropKind> = {
    series: 'json',
    labels: 'json',
    height: 'number',
    yMin: 'number',
    yMax: 'number',
    yTicks: 'number',
    showGrid: 'boolean',
    showLegend: 'boolean',
    showTooltip: 'boolean',
    formatValue: 'template',
    'aria-label': 'string',
};

/**
 * Every component a generated window may use, with its allowed props (data only, no React, so
 * validation and the schema generator can use it without loading the components). Excluded on purpose:
 * `className` (no styling hooks), `Mono.as`, `CodeBlock.html` (raw HTML), `WebFrame.sandbox` and
 * `WebFrame.allow` (a spec must not loosen the sandbox), the orb, providers, the window system,
 * full-screen layers, dialogs and dev tools.
 */
export const UI_REGISTRY_META = {
    // ── Layout ──────────────────────────────────────────────────────────────
    Stack: {
        props: { direction: 'enum', gap: 'enum', align: 'enum', justify: 'enum', wrap: 'boolean' },
        children: 'nodes',
    },
    Grid: {
        props: { columns: 'enum', minColumnWidth: 'number', gap: 'enum', align: 'enum' },
        children: 'nodes',
    },

    // ── Forms ───────────────────────────────────────────────────────────────
    Button: {
        props: { variant: 'enum', size: 'enum', disabled: 'boolean' },
        events: { onClick: 'none' },
        children: 'text',
    },
    IconButton: {
        props: {
            icon: 'icon',
            label: 'string',
            variant: 'enum',
            size: 'enum',
            pressed: 'boolean',
            disabled: 'boolean',
        },
        events: { onClick: 'none' },
    },
    Input: {
        props: {
            value: 'string',
            placeholder: 'string',
            type: 'string',
            size: 'enum',
            invalid: 'boolean',
            fullWidth: 'boolean',
            disabled: 'boolean',
            startAdornment: 'node',
            endAdornment: 'node',
            'aria-label': 'string',
        },
        events: { onChange: 'target-value' },
        bind: { value: 'onChange' },
    },
    Textarea: {
        props: {
            value: 'string',
            placeholder: 'string',
            rows: 'number',
            maxRows: 'number',
            autoResize: 'boolean',
            size: 'enum',
            invalid: 'boolean',
            fullWidth: 'boolean',
            disabled: 'boolean',
            'aria-label': 'string',
        },
        events: { onChange: 'target-value' },
        bind: { value: 'onChange' },
    },
    Select: {
        props: {
            options: 'json',
            value: 'string',
            placeholder: 'string',
            size: 'enum',
            invalid: 'boolean',
            disabled: 'boolean',
            fullWidth: 'boolean',
            'aria-label': 'string',
        },
        events: { onValueChange: 'arg' },
        bind: { value: 'onValueChange' },
    },
    Checkbox: {
        props: {
            checked: 'boolean',
            indeterminate: 'boolean',
            label: 'node',
            size: 'enum',
            disabled: 'boolean',
        },
        events: { onCheckedChange: 'arg' },
        bind: { checked: 'onCheckedChange' },
    },
    RadioGroup: {
        props: {
            items: 'json',
            value: 'string',
            orientation: 'enum',
            size: 'enum',
            disabled: 'boolean',
            'aria-label': 'string',
        },
        events: { onValueChange: 'arg' },
        bind: { value: 'onValueChange' },
    },
    Switch: {
        props: { checked: 'boolean', label: 'node', size: 'enum', disabled: 'boolean' },
        events: { onCheckedChange: 'arg' },
        bind: { checked: 'onCheckedChange' },
    },
    Slider: {
        props: {
            value: 'number',
            min: 'number',
            max: 'number',
            step: 'number',
            label: 'node',
            showValue: 'boolean',
            formatValue: 'template',
            size: 'enum',
            fullWidth: 'boolean',
            disabled: 'boolean',
            'aria-label': 'string',
        },
        events: { onValueChange: 'arg', onValueCommit: 'arg' },
        bind: { value: 'onValueChange' },
    },

    // ── Data & text ─────────────────────────────────────────────────────────
    Metric: {
        props: { value: 'node', unit: 'string', small: 'boolean', warn: 'boolean' },
    },
    Pill: { props: { variant: 'enum' }, children: 'text' },
    Label: { props: { dim: 'boolean' }, children: 'text' },
    Mono: {
        props: { size: 'enum', muted: 'boolean', secondary: 'boolean' },
        children: 'text',
    },
    ProgressBar: {
        props: { value: 'number', variant: 'enum', height: 'enum', 'aria-label': 'string' },
    },
    Sparkline: {
        props: {
            data: 'json',
            variant: 'enum',
            width: 'number',
            height: 'number',
            'aria-label': 'string',
        },
    },
    Divider: {
        props: { label: 'node', orientation: 'enum', variant: 'enum' },
    },
    Callout: {
        props: { variant: 'enum', title: 'node', icon: 'icon' },
        children: 'nodes',
    },
    StatusBadge: {
        props: { state: 'enum', label: 'string', pulse: 'boolean' },
    },
    StatusLabel: {
        props: { state: 'enum', brand: 'string', labels: 'json', live: 'boolean' },
    },
    Kbd: { props: { size: 'enum' }, children: 'text' },
    Hint: { props: {}, children: 'text' },
    Link: {
        props: { href: 'url', external: 'boolean', variant: 'enum', active: 'boolean' },
        children: 'text',
    },
    Icon: {
        props: { icon: 'icon', size: 'enum', 'aria-label': 'string' },
    },
    Table: {
        props: {
            columns: 'json',
            rows: 'json',
            caption: 'node',
            showCaption: 'boolean',
            dense: 'boolean',
            emptyText: 'node',
        },
    },
    Tabs: {
        props: { items: 'json', value: 'string', 'aria-label': 'string' },
        events: { onValueChange: 'arg' },
        bind: { value: 'onValueChange' },
    },
    CodeBlock: {
        props: { code: 'string', language: 'string', title: 'node', copyable: 'boolean' },
    },

    // ── Charts & media ──────────────────────────────────────────────────────
    LineChart: {
        props: { ...CHART_PROPS, curve: 'enum', showDots: 'boolean' },
    },
    AreaChart: {
        props: { ...CHART_PROPS, curve: 'enum', stacked: 'boolean' },
    },
    BarChart: { props: { ...CHART_PROPS, stacked: 'boolean' } },
    MediaControls: {
        props: {
            playing: 'boolean',
            currentTime: 'number',
            duration: 'number',
            volume: 'number',
            muted: 'boolean',
            title: 'node',
            size: 'enum',
            disabled: 'boolean',
            'aria-label': 'string',
        },
        events: {
            onPlayPause: 'none',
            onSeek: 'arg',
            onVolumeChange: 'arg',
            onMutedChange: 'arg',
            onPrevious: 'none',
            onNext: 'none',
        },
    },
    MediaPlayer: {
        props: {
            src: 'url',
            kind: 'enum',
            title: 'node',
            poster: 'url',
            captions: 'json',
            autoPlay: 'boolean',
            loop: 'boolean',
            defaultVolume: 'number',
            defaultMuted: 'boolean',
            size: 'enum',
        },
        events: { onEnded: 'none', onError: 'none' },
        handle: true,
    },
    YouTubePlayer: {
        props: {
            videoId: 'string',
            title: 'node',
            autoPlay: 'boolean',
            defaultMuted: 'boolean',
            start: 'number',
            size: 'enum',
        },
        events: { onEnded: 'none', onError: 'arg' },
        handle: true,
    },
    WebFrame: {
        props: { url: 'url', title: 'string', toolbar: 'boolean', height: 'number' },
        events: { onLoad: 'none' },
    },
    WaveStrip: { props: { active: 'boolean', mirrored: 'boolean' } },
    WaveformMeter: {
        props: { active: 'boolean', mirrored: 'boolean', barCount: 'number' },
    },

    // ── HUD decoration ──────────────────────────────────────────────────────
    GlassCard: {
        props: { title: 'string', focused: 'boolean' },
        children: 'nodes',
    },
    CornerBrackets: {
        props: { focused: 'boolean', size: 'number' },
        children: 'nodes',
    },
    GlowFrame: {
        props: { strong: 'boolean', breathe: 'boolean' },
        children: 'nodes',
    },
    Scanlines: { props: { sweep: 'boolean' }, children: 'nodes' },
    Reticle: { props: { size: 'number' } },
    LightTrace: { props: { color: 'string' } },
    PanelRails: { props: { visible: 'boolean' } },
    PanelBloom: { props: { active: 'boolean' } },
    GridBackground: {
        props: { drift: 'boolean', gridSize: 'number' },
    },
    Reactor: { props: {} },
} satisfies Record<string, UiRegistryMeta>;

/** Name of an allowlisted component. */
export type UiComponentName = keyof typeof UI_REGISTRY_META;
