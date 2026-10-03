import { CodeBlock } from 'jarvis-react-ui';

const CODE = "import { Button } from 'jarvis-react-ui';";

// Trusted markup generated at build time (e.g. by shiki), never user input.
const HTML =
    '<span class="text-accent-bright">import</span> { Button } ' +
    '<span class="text-accent-bright">from</span> ' +
    '<span class="text-success">\'jarvis-react-ui\'</span>;';

export default function Highlighted() {
    return <CodeBlock title="App.tsx" language="tsx" code={CODE} html={HTML} />;
}
