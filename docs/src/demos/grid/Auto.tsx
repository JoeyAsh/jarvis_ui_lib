import { GlassCard, Grid } from 'jarvis-react-ui';

const SYSTEMS = ['Radar', 'Comms', 'Shields', 'Thrusters', 'Life support', 'Navigation'];

export default function Auto() {
    return (
        <Grid minColumnWidth={140} gap="sm" className="w-full">
            {SYSTEMS.map((name) => (
                <GlassCard key={name} title={name}>
                    nominal
                </GlassCard>
            ))}
        </Grid>
    );
}
