import { useEffect, useState } from 'react';
import { Button, Tweaks, TWEAKS_DEFAULTS, useTweakApply } from 'jarvis-react-ui';
import type { TweaksState } from 'jarvis-react-ui';

/** Variables written by useTweakApply; removed again when the demo unmounts. */
const TWEAKED_VARS = [
    '--tweak-hue',
    '--accent',
    '--accent-bright',
    '--accent-speak',
    '--accent-dim',
    '--glow',
    '--glow-strong',
];

export default function Panel() {
    const [open, setOpen] = useState(true);
    const [tweaks, setTweaks] = useState<TweaksState>(TWEAKS_DEFAULTS);
    useTweakApply(tweaks);

    useEffect(() => {
        const root = document.documentElement;
        return () => TWEAKED_VARS.forEach((name) => root.style.removeProperty(name));
    }, []);

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
