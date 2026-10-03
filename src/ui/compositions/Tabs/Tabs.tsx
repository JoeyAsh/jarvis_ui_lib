import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { useHoverSfx, useSfx } from '@core/audio';
import { firstEnabledValue, nextEnabledIndex } from './utils';
import type { TabsProps } from './Tabs.types';

export function Tabs({
    items,
    value,
    defaultValue,
    onValueChange,
    'aria-label': ariaLabel,
    actions,
    className,
    panelClassName,
}: TabsProps): ReactElement {
    const baseId = useId();
    const [internal, setInternal] = useState(defaultValue ?? firstEnabledValue(items));
    const selected = value ?? internal;
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const hoverSfx = useHoverSfx('button');
    const { playOneShot } = useSfx();

    function select(next: string): void {
        if (next === selected) return;
        playOneShot('click');
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number): void {
        let target = -1;
        if (e.key === 'ArrowRight') target = nextEnabledIndex(items, index, 1);
        else if (e.key === 'ArrowLeft') target = nextEnabledIndex(items, index, -1);
        else if (e.key === 'Home') target = nextEnabledIndex(items, -1, 1);
        else if (e.key === 'End') target = nextEnabledIndex(items, items.length, -1);
        const item = items[target];
        if (item === undefined) return;
        e.preventDefault();
        select(item.value);
        tabRefs.current[target]?.focus();
    }

    const active = items.find((t) => t.value === selected && t.disabled !== true);
    // Roving tabindex target: the selected tab, or the first enabled one when the selection is
    // missing or disabled, so the tab list always stays reachable by keyboard.
    const focusValue = active?.value ?? firstEnabledValue(items);

    return (
        <div className={cx('flex flex-col font-mono', className)}>
            <div className="flex items-center border-b border-border">
                <div role="tablist" aria-label={ariaLabel} className="flex items-end gap-[2px]">
                    {items.map((item, index) => {
                        const isSelected = item.value === selected;
                        return (
                            <button
                                key={item.value}
                                ref={(el) => {
                                    tabRefs.current[index] = el;
                                }}
                                type="button"
                                role="tab"
                                id={`${baseId}-tab-${item.value}`}
                                aria-selected={isSelected}
                                aria-controls={`${baseId}-panel-${item.value}`}
                                tabIndex={item.value === focusValue ? 0 : -1}
                                disabled={item.disabled}
                                className={cx(
                                    '-mb-px px-[12px] py-[6px] border-b bg-transparent cursor-pointer',
                                    'text-[10px] uppercase tracking-[1px]',
                                    'transition-colors duration-[150ms]',
                                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                                    'disabled:opacity-40 disabled:cursor-not-allowed',
                                    isSelected
                                        ? 'text-accent-bright border-accent'
                                        : 'text-text-secondary border-transparent hover:text-accent',
                                )}
                                onMouseEnter={hoverSfx}
                                onClick={() => select(item.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                data-sfx-hover="button"
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
                {actions !== undefined && (
                    <div className="ml-auto flex items-center gap-[4px] pb-[2px]">{actions}</div>
                )}
            </div>
            {active !== undefined && (
                <div
                    role="tabpanel"
                    id={`${baseId}-panel-${active.value}`}
                    aria-labelledby={`${baseId}-tab-${active.value}`}
                    tabIndex={0}
                    className={cx(
                        'pt-[12px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                        panelClassName,
                    )}
                >
                    {active.content}
                </div>
            )}
        </div>
    );
}

export default Tabs;
