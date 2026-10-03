import { Switch } from 'jarvis-react-ui';

export default function Uncontrolled() {
    return (
        <>
            <Switch label="Scanlines" />
            <Switch label="Grid" defaultChecked />
        </>
    );
}
