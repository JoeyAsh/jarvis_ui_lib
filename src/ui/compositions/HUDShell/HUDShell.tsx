import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { Scene } from '../../primitives/Scene';
import { Reactor } from '../../primitives/Reactor';
import { ViewportCorners } from '../../primitives/ViewportCorners';
import type { HUDShellProps } from './HUDShell.types';

export function HUDShell({
    topbar,
    orb,
    dock,
    scene,
    viewportCorners = true,
    reactor = true,
    idle = false,
    working = false,
    children,
    className,
    style,
}: HUDShellProps): ReactElement {
    return (
        <div
            className={cx('hud-shell', idle && 'idle', working && 'is-working', className)}
            style={style}
        >
            {/* Background scene layer */}
            <Scene grid={scene?.grid} stars={scene?.stars} scanlines={scene?.scanlines} />

            {/* Bottom reactor glow */}
            {reactor && <Reactor />}

            {/* Viewport corner marks */}
            {viewportCorners && <ViewportCorners />}

            {/* TopBar slot */}
            {topbar && <div className="hud-shell__topbar">{topbar}</div>}

            {/* Orb slot */}
            {orb && <div className="hud-shell__orb">{orb}</div>}

            {/* Panel / window slot; inert while idle so the dimmed panels cannot be focused */}
            {children && (
                <div className="hud-shell__children" inert={idle}>
                    {children}
                </div>
            )}

            {/* Dock slot (rendered at natural fixed position) */}
            {dock}
        </div>
    );
}

export default HUDShell;
