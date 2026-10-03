import { CodeBlock } from '@ui';

const SOURCE = `import { Button } from 'jarvis-react-ui';

export function App() {
    return <Button variant="primary">Engage</Button>;
}`;

export default function TitleAndLanguage() {
    return <CodeBlock title="App.tsx" language="tsx" code={SOURCE} />;
}
