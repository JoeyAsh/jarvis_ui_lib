import { Kbd } from 'jarvis-react-ui';

export default function Shortcuts() {
    return (
        <dl className="m-0 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 text-[11px] text-text-secondary">
            <dt className="flex gap-1">
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
            </dt>
            <dd className="m-0">Search the docs</dd>
            <dt className="flex gap-1">
                <Kbd>Space</Kbd>
            </dt>
            <dd className="m-0">Push to talk</dd>
            <dt className="flex gap-1">
                <Kbd>Esc</Kbd>
            </dt>
            <dd className="m-0">Close dialog</dd>
        </dl>
    );
}
