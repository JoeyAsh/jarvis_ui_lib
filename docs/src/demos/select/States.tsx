import { Select } from 'jarvis-react-ui';

const OPTIONS = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Bravo' },
];

export default function States() {
    return (
        <div className="flex flex-col gap-3">
            <Select aria-label="Small" size="sm" options={OPTIONS} defaultValue="a" />
            <Select aria-label="Invalid" invalid options={OPTIONS} />
            <Select aria-label="Disabled" disabled options={OPTIONS} defaultValue="b" />
        </div>
    );
}
