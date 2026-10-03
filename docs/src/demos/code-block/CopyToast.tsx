import { CodeBlock, useToast } from '@ui';

export default function CopyToast() {
    const { toast } = useToast();

    return (
        <CodeBlock
            className="w-full"
            code="npm i jarvis-react-ui"
            language="bash"
            onCopy={() => toast({ id: 'copied', variant: 'success', title: 'Copied' })}
        />
    );
}
