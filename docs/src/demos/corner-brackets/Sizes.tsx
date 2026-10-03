import { CornerBrackets } from 'jarvis-react-ui';

const SIZES = [8, 12, 20];

export default function Sizes() {
    return (
        <>
            {SIZES.map((size) => (
                <CornerBrackets key={size} size={size} className="p-3">
                    <div className="px-6 py-4 text-[10px] text-text-secondary">size={size}</div>
                </CornerBrackets>
            ))}
        </>
    );
}
