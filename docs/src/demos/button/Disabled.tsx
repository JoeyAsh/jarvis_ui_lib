import { Button } from 'jarvis-react-ui';

export default function Disabled() {
    return (
        <>
            <Button variant="primary" disabled>
                Engage
            </Button>
            <Button disabled>Standby</Button>
        </>
    );
}
