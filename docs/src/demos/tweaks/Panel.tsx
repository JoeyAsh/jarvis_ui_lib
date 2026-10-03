import { useState } from 'react';
import { Button, Tweaks, TWEAKS_DEFAULTS, useTweakApply } from 'jarvis-react-ui';
import type { TweaksState } from 'jarvis-react-ui';

export default function Panel() {
    const [open, setOpen] = useState(true);
    const [tweaks, setTweaks] = useState<TweaksState>(TWEAKS_DEFAULTS);
    // Writes the accent + glow tokens to :root; removes them again on unmount.
    useTweakApply(tweaks);

    return (
        <div className="flex flex-col items-start gap-3 self-start">
            <Button variant={open ? 'primary' : 'secondary'} onClick={() => setOpen((v) => !v)}>
                {open ? 'Close tweaks' : 'Open tweaks'}
            </Button>
            <span className="text-[10px] text-text-muted">
                hue {tweaks.hue}° · glow {tweaks.glow}
            </span>
            <Tweaks open={open} tweaks={tweaks} onChange={setTweaks} />
        </div>
    );
}
