import { Toast } from '@ui';

export default function Static() {
    return (
        <div className="flex w-full max-w-[360px] flex-col gap-2">
            <Toast
                variant="success"
                title="Diagnostics passed"
                description="All systems nominal."
                duration={5000}
                paused
                onDismiss={() => undefined}
            />
            <Toast
                variant="warning"
                title="Power at 18%"
                action={{ label: 'Reroute', onClick: () => undefined }}
            />
        </div>
    );
}
