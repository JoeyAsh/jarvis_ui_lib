import { SlotGhost } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <div className="relative h-[120px] w-[412px]">
            <SlotGhost rect={{ x: 0, y: 0, w: 200, h: 120 }} label="Empty slot" />
            <SlotGhost rect={{ x: 212, y: 0, w: 200, h: 120 }} />
        </div>
    );
}
