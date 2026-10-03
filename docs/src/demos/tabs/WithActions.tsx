import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { IconButton, Tabs } from 'jarvis-react-ui';

export default function WithActions() {
    const [refreshed, setRefreshed] = useState(0);

    return (
        <Tabs
            aria-label="Logs"
            panelClassName="text-[11px] text-text-secondary"
            actions={
                <IconButton
                    icon={RefreshCw}
                    label="Refresh logs"
                    size="sm"
                    onClick={() => setRefreshed((n) => n + 1)}
                />
            }
            items={[
                { value: 'all', label: 'All', content: `128 entries, refreshed ${refreshed}x.` },
                {
                    value: 'errors',
                    label: 'Errors',
                    content: `2 entries, refreshed ${refreshed}x.`,
                },
            ]}
        />
    );
}
