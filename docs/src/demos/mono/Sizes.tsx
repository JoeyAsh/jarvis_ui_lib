import { Mono } from 'jarvis-react-ui';

export default function Sizes() {
    return (
        <div className="flex flex-col gap-2">
            <Mono size="xs">xs · SYS.BOOT 0x00FF</Mono>
            <Mono size="sm">sm · SYS.BOOT 0x00FF</Mono>
            <Mono size="md">md · SYS.BOOT 0x00FF</Mono>
            <Mono size="lg">lg · SYS.BOOT 0x00FF</Mono>
        </div>
    );
}
