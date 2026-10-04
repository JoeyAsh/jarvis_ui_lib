import { useState } from 'react';
import { Textarea } from 'jarvis-react-ui';

export default function AutoResize() {
    const [text, setText] = useState('Type a few lines: the field grows up to six lines.');

    return (
        <Textarea
            aria-label="Log entry"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoResize
            rows={2}
            maxRows={6}
        />
    );
}
