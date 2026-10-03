import { ProgressBar } from 'jarvis-react-ui';

export default function Heights() {
    return (
        <div className="flex w-full max-w-[320px] flex-col gap-4">
            <ProgressBar value={0.55} aria-label="Shield charge" />
            <ProgressBar value={0.55} height="normal" aria-label="Shield charge" />
        </div>
    );
}
