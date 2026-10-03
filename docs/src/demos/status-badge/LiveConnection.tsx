import { useEffect, useState } from 'react';
import { BrandMark, StatusBadge, TopBar } from 'jarvis-react-ui';
import type { StatusBadgeState } from 'jarvis-react-ui';

const CYCLE: StatusBadgeState[] = ['online', 'warn', 'offline'];

const LABELS: Record<StatusBadgeState, string> = {
    online: 'Link · secure',
    warn: 'Link · unstable',
    offline: 'Link · lost',
};

export default function LiveConnection() {
    const [index, setIndex] = useState(0);
    const state = CYCLE[index % CYCLE.length] ?? 'online';

    useEffect(() => {
        const id = setInterval(() => setIndex((i) => i + 1), 2000);
        return () => clearInterval(id);
    }, []);

    return (
        <TopBar
            position="static"
            left={<BrandMark />}
            right={<StatusBadge state={state} label={LABELS[state]} />}
        />
    );
}
