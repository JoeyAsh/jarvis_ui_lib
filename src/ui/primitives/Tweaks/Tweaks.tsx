import { useId, type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { ToggleRow } from './ToggleRow';
import { SwatchButton } from './SwatchButton';
import { HUE_SWATCHES } from './constants';
import type { TweaksProps, TweaksState } from './Tweaks.types';

export function Tweaks({ open, tweaks, onChange, className }: TweaksProps): ReactElement {
    function upd<K extends keyof TweaksState>(key: K, value: TweaksState[K]): void {
        onChange({ ...tweaks, [key]: value });
    }

    const id = useId();
    const hueId = `${id}-hue`;
    const glowId = `${id}-glow`;

    return (
        <div className={cx('lib-tweaks', open && 'open', className)}>
            <h3 className="lib-tweaks__heading">◈ TWEAKS</h3>

            {/* Accent Hue */}
            <div className="lib-tweaks__field">
                <label htmlFor={hueId}>
                    Accent Hue <span className="lib-tweaks__val">{tweaks.hue}°</span>
                </label>
                <input
                    id={hueId}
                    type="range"
                    min={0}
                    max={360}
                    value={tweaks.hue}
                    onChange={(e) => upd('hue', Number(e.target.value))}
                />
                <div className="lib-tweaks__swatches">
                    {HUE_SWATCHES.map((h) => (
                        <SwatchButton
                            key={h}
                            hue={h}
                            active={tweaks.hue === h}
                            onSelect={() => upd('hue', h)}
                        />
                    ))}
                </div>
            </div>

            {/* Glow Intensity */}
            <div className="lib-tweaks__field">
                <label htmlFor={glowId}>
                    Glow intensity <span className="lib-tweaks__val">{tweaks.glow}</span>
                </label>
                <input
                    id={glowId}
                    type="range"
                    min={0}
                    max={100}
                    value={tweaks.glow}
                    onChange={(e) => upd('glow', Number(e.target.value))}
                />
            </div>

            <ToggleRow
                label="Scanlines"
                value={tweaks.scan}
                onToggle={() => upd('scan', !tweaks.scan)}
            />
            <ToggleRow
                label="Grid"
                value={tweaks.grid}
                onToggle={() => upd('grid', !tweaks.grid)}
            />
            <ToggleRow
                label="Rings"
                value={tweaks.rings}
                onToggle={() => upd('rings', !tweaks.rings)}
            />
            <ToggleRow
                label="Particles"
                value={tweaks.particles}
                onToggle={() => upd('particles', !tweaks.particles)}
            />
            <ToggleRow
                label="Idle dim"
                value={tweaks.idleDim}
                onToggle={() => upd('idleDim', !tweaks.idleDim)}
            />
        </div>
    );
}

export default Tweaks;
