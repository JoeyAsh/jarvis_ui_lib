import { Input, Label } from 'jarvis-react-ui';

export default function WithControl() {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="callsign">Callsign</Label>
            <Input id="callsign" placeholder="MK-XLII" />
        </div>
    );
}
