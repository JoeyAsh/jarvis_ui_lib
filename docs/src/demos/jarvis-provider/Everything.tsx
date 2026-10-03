import { Button, Panel, useJarvis, useToast } from '@ui';

export default function Everything() {
    const { isMuted } = useJarvis();
    const { toast } = useToast();

    return (
        <Panel title="SYSTEM" className="w-[280px]">
            <div className="flex flex-col items-start gap-3">
                <span className="text-[11px] text-text-secondary">
                    Sound {isMuted ? 'off' : 'on'} · toasts ready
                </span>
                <Button
                    variant="primary"
                    onClick={() =>
                        toast({ variant: 'success', title: 'Diagnostics passed', duration: 3000 })
                    }
                >
                    Run diagnostics
                </Button>
            </div>
        </Panel>
    );
}
