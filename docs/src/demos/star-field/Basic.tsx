import { StarField } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <div className="relative flex h-[120px] w-[320px] items-center justify-center overflow-hidden border border-border bg-bg">
            <StarField />
            <span className="relative text-[10px] uppercase tracking-[2px] text-text-muted">
                Deep space
            </span>
        </div>
    );
}
