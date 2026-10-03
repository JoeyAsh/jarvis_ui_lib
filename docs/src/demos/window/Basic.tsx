import { Window } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <div className="relative h-[200px] w-[320px]">
            <Window
                id="system"
                title="System"
                ix="◈"
                badge="LIVE"
                position={{ x: 0, y: 0, w: 320, h: 200 }}
                draggable={false}
                itemRenderer={() => 'CPU 42% · RAM 61% · NET 12 MB/s'}
            />
        </div>
    );
}
