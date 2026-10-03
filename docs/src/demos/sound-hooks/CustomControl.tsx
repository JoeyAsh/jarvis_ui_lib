import { useClickSfx, useHoverSfx, useSfx } from 'jarvis-react-ui';

export default function CustomControl() {
    const onMouseEnter = useHoverSfx('button');
    const onClick = useClickSfx(() => undefined);
    const { playOneShot } = useSfx();

    return (
        <>
            <button
                type="button"
                data-sfx-hover="button"
                onMouseEnter={onMouseEnter}
                onClick={onClick}
                className="border border-accent px-4 py-2 text-[11px] uppercase tracking-[1px] text-accent"
            >
                Custom control
            </button>
            <button
                type="button"
                onClick={() => playOneShot('confirm')}
                className="border border-success px-4 py-2 text-[11px] uppercase tracking-[1px] text-success"
            >
                Play confirm
            </button>
        </>
    );
}
