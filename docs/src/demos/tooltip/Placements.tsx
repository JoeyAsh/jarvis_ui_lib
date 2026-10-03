import { Button, Tooltip } from '@ui';

export default function Placements() {
    return (
        <>
            <Tooltip content="Above" placement="top">
                <Button size="sm">Top</Button>
            </Tooltip>
            <Tooltip content="Below" placement="bottom">
                <Button size="sm">Bottom</Button>
            </Tooltip>
            <Tooltip content="To the left" placement="left">
                <Button size="sm">Left</Button>
            </Tooltip>
            <Tooltip content="To the right" placement="right">
                <Button size="sm">Right</Button>
            </Tooltip>
        </>
    );
}
