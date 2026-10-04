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
import { UI_REGISTRY_META } from './registry.meta';
import type { UiComponentName } from './registry.meta';
import type { UiComponentProps, UiRegistryEntry } from './registry.types';

/**
 * The renderer passes validated, JSON-derived props to library components, so the components are
 * treated as accepting a plain prop record here. Validation against the registry guarantees that
 * only the declared props with the declared kinds arrive.
 */
function ui<P>(component: ComponentType<P>): ComponentType<UiComponentProps> {
    return component as ComponentType<UiComponentProps>;
}

/** The component behind every allowlisted name; the type makes a missing one a compile error. */
const COMPONENTS: Record<UiComponentName, ComponentType<UiComponentProps>> = {
    Stack: ui(Stack),
    Grid: ui(Grid),
    Button: ui(Button),
    IconButton: ui(IconButton),
    Input: ui(Input),
    Textarea: ui(Textarea),
    Select: ui(Select),
    Checkbox: ui(Checkbox),
    RadioGroup: ui(RadioGroup),
    Switch: ui(Switch),
    Slider: ui(Slider),
    Metric: ui(Metric),
    Mono: ui(Mono),
    ProgressBar: ui(ProgressBar),
    Sparkline: ui(Sparkline),
    Divider: ui(Divider),
    Callout: ui(Callout),
    StatusBadge: ui(StatusBadge),
    StatusLabel: ui(StatusLabel),
    Link: ui(Link),
    Icon: ui(Icon),
    Table: ui(Table),
    Tabs: ui(Tabs),
    CodeBlock: ui(CodeBlock),
    LineChart: ui(LineChart),
    AreaChart: ui(AreaChart),
    MediaControls: ui(MediaControls),
    MediaPlayer: ui(MediaPlayer),
    YouTubePlayer: ui(YouTubePlayer),
    WebFrame: ui(WebFrame),
    WaveformMeter: ui(WaveformMeter),
    GlassCard: ui(GlassCard),
    CornerBrackets: ui(CornerBrackets),
    GlowFrame: ui(GlowFrame),
    GridBackground: ui(GridBackground),
    Pill: ui(Pill),
    Label: ui(Label),
    Kbd: ui(Kbd),
    Hint: ui(Hint),
    BarChart: ui(BarChart),
    WaveStrip: ui(WaveStrip),
    Scanlines: ui(Scanlines),
    Reticle: ui(Reticle),
    LightTrace: ui(LightTrace),
    PanelRails: ui(PanelRails),
    PanelBloom: ui(PanelBloom),
    Reactor: ui(Reactor),
};

/** Components whose spec props need translating (see `adapters.ts`). */
const ADAPTERS: Partial<Record<UiComponentName, UiRegistryEntry['adapt']>> = {
    Table: adaptTable,
    Tabs: adaptTabs,
};

/** Every allowlisted component with its metadata (`UI_REGISTRY_META`), component and adapter. */
export const UI_REGISTRY: Readonly<Record<string, UiRegistryEntry>> = Object.fromEntries(
    (Object.keys(UI_REGISTRY_META) as UiComponentName[]).map((name) => [
        name,
        { ...UI_REGISTRY_META[name], component: COMPONENTS[name], adapt: ADAPTERS[name] },
    ]),
);
