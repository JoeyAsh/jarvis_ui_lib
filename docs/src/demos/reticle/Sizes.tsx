import { Reticle } from 'jarvis-react-ui';

export default function Sizes() {
    return (
        <div className="flex items-center gap-6">
            <Reticle size={10} />
            <Reticle />
            <Reticle size={20} />
            <Reticle size={32} />
        </div>
    );
}
