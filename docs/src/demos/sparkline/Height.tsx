import { Sparkline } from 'jarvis-react-ui';

const SIGNAL = [12, 18, 9, 22, 30, 26, 35, 28, 40, 33, 45, 38, 50, 42];

export default function Height() {
    return (
        <div className="flex w-full max-w-[320px] flex-col gap-4">
            <Sparkline data={SIGNAL} height={16} />
            <Sparkline data={SIGNAL} />
            <Sparkline data={SIGNAL} height={56} />
        </div>
    );
}
