import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Tabs } from '../Tabs';
import type { TabItem } from '../Tabs.types';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function renderWithSfx(sfx: SfxContextValue, ui: ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

const ITEMS: TabItem[] = [
    { value: 'preview', label: 'Preview', content: <p>preview panel</p> },
    { value: 'code', label: 'Code', content: <p>code panel</p> },
    { value: 'off', label: 'Off', content: <p>off panel</p>, disabled: true },
    { value: 'api', label: 'API', content: <p>api panel</p> },
];

describe('Tabs', () => {
    it('renders a tablist and selects the first tab by default', () => {
        render(<Tabs items={ITEMS} aria-label="Demo" />);
        expect(screen.getByRole('tablist', { name: 'Demo' })).toBeDefined();
        expect(screen.getByRole('tab', { name: 'Preview' }).getAttribute('aria-selected')).toBe(
            'true',
        );
        expect(screen.getByRole('tabpanel').textContent).toBe('preview panel');
    });

    it('links tab and panel via aria attributes', () => {
        render(<Tabs items={ITEMS} />);
        const tab = screen.getByRole('tab', { name: 'Preview' });
        const panel = screen.getByRole('tabpanel');
        expect(tab.getAttribute('aria-controls')).toBe(panel.id);
        expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    });

    it('uncontrolled: switches panel on click', () => {
        render(<Tabs items={ITEMS} />);
        fireEvent.click(screen.getByRole('tab', { name: 'Code' }));
        expect(screen.getByRole('tabpanel').textContent).toBe('code panel');
    });

    it('defaultValue selects the initial tab', () => {
        render(<Tabs items={ITEMS} defaultValue="api" />);
        expect(screen.getByRole('tabpanel').textContent).toBe('api panel');
    });

    it('controlled: reports changes and keeps the prop value', () => {
        const onValueChange = vi.fn();
        render(<Tabs items={ITEMS} value="preview" onValueChange={onValueChange} />);
        fireEvent.click(screen.getByRole('tab', { name: 'Code' }));
        expect(onValueChange).toHaveBeenCalledWith('code');
        expect(screen.getByRole('tabpanel').textContent).toBe('preview panel');
    });

    it('arrow keys move selection and skip disabled tabs', () => {
        render(<Tabs items={ITEMS} defaultValue="code" />);
        fireEvent.keyDown(screen.getByRole('tab', { name: 'Code' }), { key: 'ArrowRight' });
        expect(screen.getByRole('tabpanel').textContent).toBe('api panel');
        fireEvent.keyDown(screen.getByRole('tab', { name: 'API' }), { key: 'ArrowRight' });
        expect(screen.getByRole('tabpanel').textContent).toBe('preview panel');
        fireEvent.keyDown(screen.getByRole('tab', { name: 'Preview' }), { key: 'End' });
        expect(screen.getByRole('tabpanel').textContent).toBe('api panel');
        fireEvent.keyDown(screen.getByRole('tab', { name: 'API' }), { key: 'Home' });
        expect(screen.getByRole('tabpanel').textContent).toBe('preview panel');
    });

    it('only the selected tab is in the tab order', () => {
        render(<Tabs items={ITEMS} />);
        expect(screen.getByRole('tab', { name: 'Preview' }).getAttribute('tabindex')).toBe('0');
        expect(screen.getByRole('tab', { name: 'Code' }).getAttribute('tabindex')).toBe('-1');
    });

    it('renders actions and merges class names', () => {
        const { container } = render(
            <Tabs
                items={ITEMS}
                actions={<button type="button">copy</button>}
                className="outer"
                panelClassName="inner"
            />,
        );
        expect(screen.getByRole('button', { name: 'copy' })).toBeDefined();
        expect(container.firstElementChild?.className).toContain('outer');
        expect(screen.getByRole('tabpanel').className).toContain('inner');
    });

    it('plays click when selecting a different tab only', () => {
        const sfx = makeSfx();
        renderWithSfx(sfx, <Tabs items={ITEMS} />);
        fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
        expect(sfx.playOneShot).not.toHaveBeenCalledWith('click');
        fireEvent.click(screen.getByRole('tab', { name: 'Code' }));
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });

    it('keeps the tab list reachable when the value matches no enabled tab', () => {
        render(<Tabs items={ITEMS} value="off" />);
        expect(screen.getByRole('tab', { name: 'Preview' }).getAttribute('tabindex')).toBe('0');
        expect(screen.queryByRole('tabpanel')).toBeNull();
    });

    it('makes the panel focusable', () => {
        render(<Tabs items={ITEMS} />);
        expect(screen.getByRole('tabpanel').getAttribute('tabindex')).toBe('0');
    });
});
