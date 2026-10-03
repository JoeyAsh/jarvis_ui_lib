import { StarField } from 'jarvis-react-ui';

const COUNTS = [20, 60, 150];

export default function Count() {
    return (
        <>
            {COUNTS.map((count) => (
                <div
                    key={count}
                    className="relative flex h-[90px] w-[160px] items-end justify-center overflow-hidden border border-border bg-bg pb-2"
                >
                    <StarField count={count} />
                    <span className="relative text-[9px] text-text-muted">count={count}</span>
                </div>
            ))}
        </>
    );
}
