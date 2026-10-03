import { Switch } from 'jarvis-react-ui';

export default function Sizes() {
    return (
        <>
            <Switch size="sm" label="Compact" defaultChecked />
            <Switch size="md" label="Default" defaultChecked />
        </>
    );
}
