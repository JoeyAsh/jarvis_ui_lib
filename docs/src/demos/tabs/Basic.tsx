import { CodeBlock, Tabs } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <Tabs
            aria-label="Package manager"
            items={[
                {
                    value: 'npm',
                    label: 'npm',
                    content: <CodeBlock code="npm install jarvis-react-ui" />,
                },
                {
                    value: 'pnpm',
                    label: 'pnpm',
                    content: <CodeBlock code="pnpm add jarvis-react-ui" />,
                },
                {
                    value: 'yarn',
                    label: 'yarn',
                    content: <CodeBlock code="yarn add jarvis-react-ui" />,
                },
            ]}
        />
    );
}
