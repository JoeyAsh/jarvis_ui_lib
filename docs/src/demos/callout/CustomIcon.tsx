import { Lightbulb } from 'lucide-react';
import { Callout } from '@ui';

export default function CustomIcon() {
    return (
        <div className="flex w-full max-w-[420px] flex-col gap-2">
            <Callout icon={Lightbulb} title="Tip">
                Hold Shift while dragging a window to swap it with another slot.
            </Callout>
            <Callout icon={false}>A plain note without an icon.</Callout>
        </div>
    );
}
