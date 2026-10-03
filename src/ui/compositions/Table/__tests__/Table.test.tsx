import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from '../Table';
import type { TableColumn } from '../Table.types';

interface PropRow {
    name: string;
    type: string;
}

const COLUMNS: TableColumn<PropRow>[] = [
    { key: 'name', header: 'Prop', render: (r) => r.name },
    { key: 'type', header: 'Type', render: (r) => <code>{r.type}</code>, align: 'right' },
];

const ROWS: PropRow[] = [
    { name: 'variant', type: "'primary' | 'ghost'" },
    { name: 'size', type: "'sm' | 'md'" },
];

describe('Table', () => {
    it('renders headers as column headers', () => {
        render(<Table columns={COLUMNS} rows={ROWS} getRowKey={(r) => r.name} />);
        expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
            'Prop',
            'Type',
        ]);
    });

    it('renders one row per data entry using render()', () => {
        render(<Table columns={COLUMNS} rows={ROWS} getRowKey={(r) => r.name} />);
        expect(screen.getAllByRole('row')).toHaveLength(3);
        expect(screen.getByText('variant')).toBeDefined();
        expect(screen.getByText("'sm' | 'md'").tagName).toBe('CODE');
    });

    it('applies column alignment', () => {
        render(<Table columns={COLUMNS} rows={ROWS} getRowKey={(r) => r.name} />);
        expect(screen.getByRole('columnheader', { name: 'Type' }).className).toContain(
            'text-right',
        );
    });

    it('shows emptyText when there are no rows', () => {
        render(<Table columns={COLUMNS} rows={[]} getRowKey={(r) => r.name} emptyText="Nothing" />);
        const cell = screen.getByText('Nothing');
        expect(cell.getAttribute('colspan')).toBe('2');
    });

    it('caption is visually hidden unless showCaption', () => {
        const { rerender } = render(
            <Table columns={COLUMNS} rows={ROWS} getRowKey={(r) => r.name} caption="Props" />,
        );
        expect(screen.getByText('Props').className).toContain('sr-only');
        rerender(
            <Table
                columns={COLUMNS}
                rows={ROWS}
                getRowKey={(r) => r.name}
                caption="Props"
                showCaption
            />,
        );
        expect(screen.getByText('Props').className).not.toContain('sr-only');
    });

    it('dense uses tighter padding and className is merged', () => {
        const { container } = render(
            <Table
                columns={COLUMNS}
                rows={ROWS}
                getRowKey={(r) => r.name}
                dense
                className="extra"
            />,
        );
        expect(container.firstElementChild?.className).toContain('extra');
        expect(screen.getByRole('columnheader', { name: 'Prop' }).className).toContain('py-[5px]');
    });
});
