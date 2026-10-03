import { Reticle } from 'jarvis-react-ui';

export default function InHeading() {
    return (
        <div className="flex items-center gap-2">
            <Reticle size={10} className="text-text-muted" />
            <span className="text-[10px] uppercase tracking-[2px] text-text-secondary">
                Target lock
            </span>
            <Reticle size={10} className="text-text-muted" />
        </div>
    );
}
