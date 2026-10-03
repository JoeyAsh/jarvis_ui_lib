import { useId } from 'react';
import { Input } from '@ui';

export default function Invalid() {
    const helpId = useId();

    return (
        <div className="flex flex-col gap-[6px]">
            <Input
                aria-label="Accent color"
                aria-describedby={helpId}
                defaultValue="#zz00ff"
                invalid
            />
            <span id={helpId} className="text-[10px] text-error">
                Use a hex color such as #4ca8e8.
            </span>
        </div>
    );
}
