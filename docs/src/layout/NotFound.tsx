import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { Button, Callout } from '@ui';

export function NotFound(): ReactElement {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Not found · jarvis-react-ui';
    }, []);

    return (
        <div className="flex flex-col items-start gap-6 pt-12">
            <h1 className="m-0 text-[24px] font-medium tracking-[2px] text-text">
                404 · SIGNAL LOST
            </h1>
            <Callout variant="warning" title="Page not found">
                This page does not exist or has moved.
            </Callout>
            <Button variant="primary" onClick={() => void navigate('/')}>
                Back to overview
            </Button>
        </div>
    );
}

export default NotFound;
