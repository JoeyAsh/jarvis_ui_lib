import { Switch } from '@ui';

export default function Uncontrolled() {
    return (
        <>
            <Switch label="Scanlines" />
            <Switch label="Grid" defaultChecked />
        </>
    );
}
