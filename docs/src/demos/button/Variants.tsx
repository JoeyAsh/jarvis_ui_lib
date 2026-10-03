import { Button } from 'jarvis-react-ui';

export default function Variants() {
    return (
        <>
            <Button variant="primary">Engage</Button>
            <Button>Standby</Button>
            <Button variant="ghost">Details</Button>
            <Button variant="danger">Abort</Button>
        </>
    );
}
