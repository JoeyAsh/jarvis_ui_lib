import type { ComponentType } from 'react';
import { Stack } from '../primitives/Stack';
import { Grid } from '../primitives/Grid';
import { Button } from '../primitives/Button';
import { IconButton } from '../primitives/IconButton';
import { Input } from '../primitives/Input';
import { Textarea } from '../primitives/Textarea';
import { Checkbox } from '../primitives/Checkbox';
import { Switch } from '../primitives/Switch';
import { Slider } from '../primitives/Slider';
import { Metric } from '../primitives/Metric';
import { Pill } from '../primitives/Pill';
import { Label } from '../primitives/Label';
import { Mono } from '../primitives/Mono';
import { ProgressBar } from '../primitives/ProgressBar';
import { Sparkline } from '../primitives/Sparkline';
import { Divider } from '../primitives/Divider';
import { StatusLabel } from '../primitives/StatusLabel';
import { Kbd } from '../primitives/Kbd';
import { Hint } from '../primitives/Hint';
import { Link } from '../primitives/Link';
import { Icon } from '../primitives/Icon';
import { WaveStrip } from '../primitives/WaveStrip';
import { WaveformMeter } from '../primitives/WaveformMeter';
import { CornerBrackets } from '../primitives/CornerBrackets';
import { GlowFrame } from '../primitives/GlowFrame';
import { Reticle } from '../primitives/Reticle';
import { LightTrace } from '../primitives/LightTrace';
import { PanelRails } from '../primitives/PanelRails';
import { PanelBloom } from '../primitives/PanelBloom';
import { Scanlines } from '../primitives/Scanlines';
import { GridBackground } from '../primitives/GridBackground';
import { Reactor } from '../primitives/Reactor';
import { Select } from '../compositions/Select';
import { RadioGroup } from '../compositions/RadioGroup';
import { Callout } from '../compositions/Callout';
import { StatusBadge } from '../compositions/StatusBadge';
import { Table } from '../compositions/Table';
import { Tabs } from '../compositions/Tabs';
import { CodeBlock } from '../compositions/CodeBlock';
import { LineChart } from '../compositions/LineChart';
import { AreaChart } from '../compositions/AreaChart';
import { BarChart } from '../compositions/BarChart';
import { MediaControls } from '../compositions/MediaControls';
import { MediaPlayer } from '../compositions/MediaPlayer';
import { YouTubePlayer } from '../compositions/YouTubePlayer';
import { WebFrame } from '../compositions/WebFrame';
import { GlassCard } from '../compositions/GlassCard';
import { adaptTable, adaptTabs } from './adapters';
import type { UiComponentProps, UiPropKind, UiRegistryEntry } from './registry.types';

/**
 * The renderer passes validated, JSON-derived props to library components, so the components are
 * treated as accepting a plain prop record here. Validation against `UI_REGISTRY` guarantees that
 * only the declared props with the declared kinds arrive.
 */
function ui<P>(component: ComponentType<P>): ComponentType<UiComponentProps> {
    return component as ComponentType<UiComponentProps>;
}

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
 * Every component a generated window may use, with its allowed props. Excluded on purpose:
 * `className` (no styling hooks), `Mono.as`, `CodeBlock.html` (raw HTML), `WebFrame.sandbox` and
 * `WebFrame.allow` (a spec must not loosen the sandbox), the orb, providers, the window system,
 * full-screen layers, dialogs and dev tools.
 */
export const UI_REGISTRY: Readonly<Record<string, UiRegistryEntry>> = {
    // ── Layout ──────────────────────────────────────────────────────────────
    Stack: {
        component: ui(Stack),
        props: { direction: 'enum', gap: 'enum', align: 'enum', justify: 'enum', wrap: 'boolean' },
        children: 'nodes',
    },
    Grid: {
        component: ui(Grid),
        props: { columns: 'enum', minColumnWidth: 'number', gap: 'enum', align: 'enum' },
        children: 'nodes',
    },

    // ── Forms ───────────────────────────────────────────────────────────────
    Button: {
        component: ui(Button),
        props: { variant: 'enum', size: 'enum', disabled: 'boolean' },
        events: { onClick: 'none' },
        children: 'text',
    },
    IconButton: {
        component: ui(IconButton),
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
        component: ui(Input),
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
        component: ui(Textarea),
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
        component: ui(Select),
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
        component: ui(Checkbox),
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
        component: ui(RadioGroup),
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
        component: ui(Switch),
        props: { checked: 'boolean', label: 'node', size: 'enum', disabled: 'boolean' },
        events: { onCheckedChange: 'arg' },
        bind: { checked: 'onCheckedChange' },
    },
    Slider: {
        component: ui(Slider),
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
        component: ui(Metric),
        props: { value: 'node', unit: 'string', small: 'boolean', warn: 'boolean' },
    },
    Pill: { component: ui(Pill), props: { variant: 'enum' }, children: 'text' },
    Label: { component: ui(Label), props: { dim: 'boolean' }, children: 'text' },
    Mono: {
        component: ui(Mono),
        props: { size: 'enum', muted: 'boolean', secondary: 'boolean' },
        children: 'text',
    },
    ProgressBar: {
        component: ui(ProgressBar),
        props: { value: 'number', variant: 'enum', height: 'enum', 'aria-label': 'string' },
    },
    Sparkline: {
        component: ui(Sparkline),
        props: {
            data: 'json',
            variant: 'enum',
            width: 'number',
            height: 'number',
            'aria-label': 'string',
        },
    },
    Divider: {
        component: ui(Divider),
        props: { label: 'node', orientation: 'enum', variant: 'enum' },
    },
    Callout: {
        component: ui(Callout),
        props: { variant: 'enum', title: 'node', icon: 'icon' },
        children: 'nodes',
    },
    StatusBadge: {
        component: ui(StatusBadge),
        props: { state: 'enum', label: 'string', pulse: 'boolean' },
    },
    StatusLabel: {
        component: ui(StatusLabel),
        props: { state: 'enum', brand: 'string', labels: 'json', live: 'boolean' },
    },
    Kbd: { component: ui(Kbd), props: { size: 'enum' }, children: 'text' },
    Hint: { component: ui(Hint), props: {}, children: 'text' },
    Link: {
        component: ui(Link),
        props: { href: 'url', external: 'boolean', variant: 'enum', active: 'boolean' },
        children: 'text',
    },
    Icon: {
        component: ui(Icon),
        props: { icon: 'icon', size: 'enum', 'aria-label': 'string' },
    },
    Table: {
        component: ui(Table),
        props: {
            columns: 'json',
            rows: 'json',
            caption: 'node',
            showCaption: 'boolean',
            dense: 'boolean',
            emptyText: 'node',
        },
        adapt: adaptTable,
    },
    Tabs: {
        component: ui(Tabs),
        props: { items: 'json', value: 'string', 'aria-label': 'string' },
        events: { onValueChange: 'arg' },
        bind: { value: 'onValueChange' },
        adapt: adaptTabs,
    },
    CodeBlock: {
        component: ui(CodeBlock),
        props: { code: 'string', language: 'string', title: 'node', copyable: 'boolean' },
    },

    // ── Charts & media ──────────────────────────────────────────────────────
    LineChart: {
        component: ui(LineChart),
        props: { ...CHART_PROPS, curve: 'enum', showDots: 'boolean' },
    },
    AreaChart: {
        component: ui(AreaChart),
        props: { ...CHART_PROPS, curve: 'enum', stacked: 'boolean' },
    },
    BarChart: { component: ui(BarChart), props: { ...CHART_PROPS, stacked: 'boolean' } },
    MediaControls: {
        component: ui(MediaControls),
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
        component: ui(MediaPlayer),
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
        component: ui(YouTubePlayer),
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
        component: ui(WebFrame),
        props: { url: 'url', title: 'string', toolbar: 'boolean', height: 'number' },
        events: { onLoad: 'none' },
    },
    WaveStrip: { component: ui(WaveStrip), props: { active: 'boolean', mirrored: 'boolean' } },
    WaveformMeter: {
        component: ui(WaveformMeter),
        props: { active: 'boolean', mirrored: 'boolean', barCount: 'number' },
    },

    // ── HUD decoration ──────────────────────────────────────────────────────
    GlassCard: {
        component: ui(GlassCard),
        props: { title: 'string', focused: 'boolean' },
        children: 'nodes',
    },
    CornerBrackets: {
        component: ui(CornerBrackets),
        props: { focused: 'boolean', size: 'number' },
        children: 'nodes',
    },
    GlowFrame: {
        component: ui(GlowFrame),
        props: { strong: 'boolean', breathe: 'boolean' },
        children: 'nodes',
    },
    Scanlines: { component: ui(Scanlines), props: { sweep: 'boolean' }, children: 'nodes' },
    Reticle: { component: ui(Reticle), props: { size: 'number' } },
    LightTrace: { component: ui(LightTrace), props: { color: 'string' } },
    PanelRails: { component: ui(PanelRails), props: { visible: 'boolean' } },
    PanelBloom: { component: ui(PanelBloom), props: { active: 'boolean' } },
    GridBackground: {
        component: ui(GridBackground),
        props: { drift: 'boolean', gridSize: 'number' },
    },
    Reactor: { component: ui(Reactor), props: {} },
};
