import { Button, Pill, Switch, useJarvis } from 'jarvis-react-ui';

export default function MuteToggle() {
    const { isMuted, toggleMute } = useJarvis();

    return (
        <>
            <Switch label="UI sound" checked={!isMuted} onCheckedChange={toggleMute} />
            <Pill variant={isMuted ? 'default' : 'info'}>{isMuted ? 'muted' : 'live'}</Pill>
            <Button>Hover and click me</Button>
        </>
    );
}
