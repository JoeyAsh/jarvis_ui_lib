import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatusLabel } from '../StatusLabel';

describe('StatusLabel', () => {
    it('renders without crashing', () => {
        const { container } = render(<StatusLabel state="idle" />);
        expect(container.querySelector('.lib-status-label')).toBeDefined();
    });

    it('shows READY for idle state', () => {
        const { getByText } = render(<StatusLabel state="idle" />);
        expect(getByText('READY')).toBeDefined();
    });

    it('shows listening... for listening state', () => {
        const { getByText } = render(<StatusLabel state="listening" />);
        expect(getByText('listening...')).toBeDefined();
    });

    it('shows thinking... for thinking state', () => {
        const { getByText } = render(<StatusLabel state="thinking" />);
        expect(getByText('thinking...')).toBeDefined();
    });

    it('shows speaking... for speaking state', () => {
        const { getByText } = render(<StatusLabel state="speaking" />);
        expect(getByText('speaking...')).toBeDefined();
    });

    it('shows working... for working state', () => {
        const { getByText } = render(<StatusLabel state="working" />);
        expect(getByText('working...')).toBeDefined();
    });

    it('shows its own follow-up... text for follow_up state', () => {
        const { getByText, queryByText } = render(<StatusLabel state="follow_up" />);
        expect(getByText('follow-up...')).toBeDefined();
        expect(queryByText('listening...')).toBeNull();
    });

    it('uses custom labels and falls back to built-in texts', () => {
        const labels = { idle: 'BEREIT', listening: 'hoere zu...' };
        const { getByText, rerender } = render(<StatusLabel state="idle" labels={labels} />);
        expect(getByText('BEREIT')).toBeDefined();
        rerender(<StatusLabel state="listening" labels={labels} />);
        expect(getByText('hoere zu...')).toBeDefined();
        rerender(<StatusLabel state="thinking" labels={labels} />);
        expect(getByText('thinking...')).toBeDefined();
    });

    it('is not a live region by default', () => {
        const { queryByRole, getByText } = render(<StatusLabel state="idle" />);
        expect(queryByRole('status')).toBeNull();
        expect(getByText('READY').hasAttribute('aria-live')).toBe(false);
    });

    it('becomes a polite live region with live', () => {
        const { getByRole, rerender } = render(<StatusLabel state="idle" live />);
        const region = getByRole('status');
        expect(region.getAttribute('aria-live')).toBe('polite');
        expect(region?.textContent).toContain('READY');
        rerender(<StatusLabel state="speaking" live />);
        expect(getByRole('status')?.textContent).toContain('speaking...');
    });

    it('state text does not have active class when idle', () => {
        const { container } = render(<StatusLabel state="idle" />);
        expect(
            container.querySelector('.lib-status-label__state')?.classList.contains('active'),
        ).toBe(false);
    });

    it('state text has active class when not idle', () => {
        const { container } = render(<StatusLabel state="listening" />);
        expect(
            container.querySelector('.lib-status-label__state')?.classList.contains('active'),
        ).toBe(true);
    });

    it('renders default brand mark', () => {
        const { getByText } = render(<StatusLabel state="idle" />);
        expect(getByText('J A R V I S')).toBeDefined();
    });

    it('renders custom brand prop', () => {
        const { getByText } = render(<StatusLabel state="idle" brand="UNIT 01" />);
        expect(getByText('UNIT 01')).toBeDefined();
    });

    it('merges className', () => {
        const { container } = render(<StatusLabel state="idle" className="extra" />);
        expect(container.querySelector('.lib-status-label')?.classList.contains('extra')).toBe(
            true,
        );
    });
});
