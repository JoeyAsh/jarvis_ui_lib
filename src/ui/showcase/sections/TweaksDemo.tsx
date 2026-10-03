import { useState, type ReactElement } from 'react';
import { Tweaks, TWEAKS_DEFAULTS, useTweakApply } from '../../primitives/Tweaks';
import type { TweaksState } from '../../primitives/Tweaks';
import { CssOrb } from '../../orb/CssOrb';

/**
 * Tweaks panel scoped into a preview stage. While mounted, `useTweakApply` overrides the accent
 * tokens of the whole page; unmounting restores them.
 */
export function TweaksDemo(): ReactElement {
    const [tweaks, setTweaks] = useState<TweaksState>(TWEAKS_DEFAULTS);
    useTweakApply(tweaks);

    return (
        // transform-gpu scopes the fixed Tweaks panel to this stage
        <div className="relative h-[560px] w-full overflow-hidden border border-border bg-bg transform-gpu">
            <CssOrb state="idle" rings={tweaks.rings} particles={tweaks.particles} />
            <Tweaks open tweaks={tweaks} onChange={setTweaks} />
        </div>
    );
}

export default TweaksDemo;
