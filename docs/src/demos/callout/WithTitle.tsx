import { Callout } from '@ui';

export default function WithTitle() {
    return (
        <div className="flex w-full max-w-[420px] flex-col gap-2">
            <Callout title="Note">Import style.css once at the root of your app.</Callout>
            <Callout variant="warning" title="Heads up">
                ThreeOrb needs the optional three peer dependency.
            </Callout>
        </div>
    );
}
