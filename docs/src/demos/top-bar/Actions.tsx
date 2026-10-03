import { Bell, Settings } from 'lucide-react';
import { BrandMark, IconButton, StatusBadge, TopBar } from 'jarvis-react-ui';

export default function Actions() {
    return (
        <TopBar
            position="static"
            left={<BrandMark />}
            center={<StatusBadge label="LINK · SECURE" state="online" pulse />}
            right={
                <span className="flex items-center gap-1">
                    <IconButton icon={Bell} label="Notifications" size="sm" />
                    <IconButton icon={Settings} label="Settings" size="sm" />
                </span>
            }
        />
    );
}
