import { Link } from '@ui';

export default function Variants() {
    return (
        <p className="text-[11px] text-text-secondary">
            Read the <Link href="#api">API reference</Link> or the{' '}
            <Link href="#accessibility" variant="muted">
                accessibility notes
            </Link>
            .
        </p>
    );
}
