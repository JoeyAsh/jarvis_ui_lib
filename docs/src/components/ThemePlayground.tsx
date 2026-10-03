import { useState } from 'react';
import type { ReactElement } from 'react';
import { Button, Metric, Panel, Pill, ProgressBar, Switch } from '@ui';
import { DocsCodeBlock } from './DocsCodeBlock';
import { THEME_PRESETS } from './themePresets';
import { cssBlock, expandThemeVars } from '../utils/themeVars';

/**
 * Applies a preset to a preview container (CSS-variable injection only), including the `--color-*`
 * and `--shadow-glow*` aliases a scoped override needs, and prints the matching CSS.
 */
export function ThemePlayground(): ReactElement {
    const [presetId, setPresetId] = useState(THEME_PRESETS[0]?.id ?? '');
    const preset = THEME_PRESETS.find((p) => p.id === presetId) ?? THEME_PRESETS[0];
    const vars = preset?.vars ?? {};
    const scoped = expandThemeVars(vars);
    const css = cssBlock('.my-area', scoped);

    return (
        <div className="my-6 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Theme presets">
                {THEME_PRESETS.map((p) => (
                    <Button
                        key={p.id}
                        size="sm"
                        variant={p.id === presetId ? 'primary' : 'ghost'}
                        aria-pressed={p.id === presetId}
                        onClick={() => setPresetId(p.id)}
                    >
                        {p.label}
                    </Button>
                ))}
            </div>
            <div
                className="flex flex-wrap items-start gap-6 p-6 border border-border rounded-[2px] bg-bg"
                style={scoped}
            >
                <Panel title="REACTOR" className="w-[240px]">
                    <div className="flex flex-col gap-3">
                        <Metric value="87" unit="%" />
                        <ProgressBar value={87} aria-label="Reactor output" />
                        <div className="flex gap-2">
                            <Pill variant="info">ONLINE</Pill>
                            <Pill>IDLE</Pill>
                        </div>
                    </div>
                </Panel>
                <div className="flex flex-col gap-3">
                    <Button variant="primary">ENGAGE</Button>
                    <Button>STANDBY</Button>
                    <Switch label="Shields" defaultChecked />
                </div>
            </div>
            <DocsCodeBlock code={css} language="css" title="theme.css (scoped to one area)" />
        </div>
    );
}

export default ThemePlayground;
