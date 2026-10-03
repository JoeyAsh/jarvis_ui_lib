import { Mono } from 'jarvis-react-ui';

export default function AsElement() {
    return (
        <div className="flex flex-col gap-2">
            <Mono as="time" dateTime="2026-10-03T09:04:17Z" size="lg">
                09:04:17Z
            </Mono>
            <Mono as="code" secondary>
                uplink --channel 7 --encrypt
            </Mono>
            <Mono as="p" muted size="sm">
                Last handshake 312 ms ago.
            </Mono>
        </div>
    );
}
