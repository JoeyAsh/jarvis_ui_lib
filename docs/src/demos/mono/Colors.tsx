import { Mono } from 'jarvis-react-ui';

export default function Colors() {
    return (
        <div className="flex flex-col gap-2">
            <Mono>Reactor output stable at 3.2 GJ/s</Mono>
            <Mono secondary>Next diagnostic in 14 min</Mono>
            <Mono muted>Log rotated · 2,048 entries archived</Mono>
        </div>
    );
}
