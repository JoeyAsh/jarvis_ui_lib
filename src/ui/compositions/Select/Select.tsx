import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { useHoverSfx, useSfx } from '@core/audio';
import { TYPEAHEAD_RESET_MS } from './constants';
import { listboxPosition, nextEnabledIndex, typeaheadIndex } from './utils';
import type { ListboxPosition, SelectProps } from './Select.types';

const SIZE_CLASSES = {
    sm: 'h-[26px] px-[8px] gap-[6px] text-[10px]',
    md: 'h-[32px] px-[10px] gap-[8px] text-[11px]',
} as const;

/**
 * A dropdown to pick one option. The list opens in a portal on `document.body`, so it is never
 * clipped by a scrolling window body and stays above floating windows.
 */
export function Select({
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = 'Select…',
    size = 'md',
    invalid = false,
    disabled = false,
    fullWidth = false,
    name,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    id,
    className,
}: SelectProps): ReactElement {
    const [internal, setInternal] = useState(defaultValue);
    const selected = value ?? internal;
    const selectedIndex = options.findIndex((o) => o.value === selected);
    const selectedOption = options[selectedIndex];

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [position, setPosition] = useState<ListboxPosition | null>(null);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const typeaheadRef = useRef({ query: '', at: 0 });

    const baseId = useId();
    const listId = `${baseId}-listbox`;
    const optionId = (index: number): string => `${baseId}-option-${index}`;

    const hoverSfx = useHoverSfx('button');
    const { playOneShot } = useSfx();

    const measure = useCallback((): void => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect !== undefined) setPosition(listboxPosition(rect, window.innerHeight));
    }, []);

    function openList(): void {
        if (disabled || options.length === 0) return;
        measure();
        setActiveIndex(
            selectedIndex >= 0 && options[selectedIndex]?.disabled !== true
                ? selectedIndex
                : nextEnabledIndex(options, -1, 1),
        );
        playOneShot('menu_open');
        setOpen(true);
    }

    const closeList = useCallback(
        (returnFocus: boolean): void => {
            setOpen(false);
            playOneShot('menu_close');
            if (returnFocus) triggerRef.current?.focus();
        },
        [playOneShot],
    );

    function choose(index: number): void {
        const option = options[index];
        if (option === undefined || option.disabled === true) return;
        playOneShot('click');
        if (option.value !== selected) {
            if (value === undefined) setInternal(option.value);
            onValueChange?.(option.value);
        }
        closeList(true);
    }

    // Focus the list when it opens; keep the active option in view.
    useLayoutEffect(() => {
        if (open) listRef.current?.focus();
    }, [open]);
    useEffect(() => {
        if (!open || activeIndex < 0) return;
        const el = document.getElementById(`${baseId}-option-${activeIndex}`);
        if (el !== null && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ block: 'nearest' });
        }
    }, [open, activeIndex, baseId]);

    // While open: close on a pointer down outside, follow the trigger on scroll and resize.
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: PointerEvent): void => {
            const target = e.target instanceof Node ? e.target : null;
            if (target === null) return;
            if (triggerRef.current?.contains(target) || listRef.current?.contains(target)) return;
            closeList(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure, true);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', measure, true);
        };
    }, [open, closeList, measure]);

    function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>): void {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            openList();
        }
    }

    function handleListKeyDown(e: KeyboardEvent<HTMLUListElement>): void {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((i) => nextEnabledIndex(options, i, 1));
                return;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((i) => nextEnabledIndex(options, i, -1));
                return;
            case 'Home':
                e.preventDefault();
                setActiveIndex(nextEnabledIndex(options, -1, 1));
                return;
            case 'End':
                e.preventDefault();
                setActiveIndex(nextEnabledIndex(options, options.length, -1));
                return;
            case 'Enter':
            case ' ':
                e.preventDefault();
                choose(activeIndex);
                return;
            case 'Escape':
                // Handled here: a surrounding window must not close as well.
                e.preventDefault();
                e.stopPropagation();
                closeList(true);
                return;
            case 'Tab':
                closeList(false);
                return;
            default:
                break;
        }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const now = e.timeStamp;
            const state = typeaheadRef.current;
            const query = now - state.at > TYPEAHEAD_RESET_MS ? e.key : state.query + e.key;
            typeaheadRef.current = { query, at: now };
            const from = query.length > 1 ? activeIndex - 1 : activeIndex;
            const match = typeaheadIndex(options, from, query);
            if (match >= 0) setActiveIndex(match);
        }
    }

    const list =
        open && position !== null
            ? createPortal(
                  <ul
                      ref={listRef}
                      id={listId}
                      role="listbox"
                      tabIndex={-1}
                      aria-labelledby={ariaLabelledby}
                      aria-label={ariaLabelledby === undefined ? ariaLabel : undefined}
                      aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
                      onKeyDown={handleListKeyDown}
                      style={
                          {
                              '--select-x': `${position.x}px`,
                              '--select-y': `${position.y}px`,
                              '--select-w': `${position.w}px`,
                          } as CSSProperties
                      }
                      className={cx(
                          'fixed left-[var(--select-x)] top-[var(--select-y)] z-[9500] m-0 p-[3px] list-none',
                          'w-[var(--select-w)] min-w-[140px] max-h-[240px] overflow-y-auto font-mono',
                          'border border-border-bright rounded-[2px] bg-[rgba(13,13,20,0.94)] shadow-glow',
                          'backdrop-blur-[12px] outline-none animate-[jlib-fade-in_150ms_ease-out_both]',
                          'motion-reduce:animate-none',
                          position.above && '-translate-y-full',
                      )}
                  >
                      {options.map((option, index) => {
                          const isSelected = index === selectedIndex;
                          const isActive = index === activeIndex;
                          const off = option.disabled === true;
                          return (
                              <li
                                  key={option.value}
                                  id={optionId(index)}
                                  role="option"
                                  aria-selected={isSelected}
                                  aria-disabled={off || undefined}
                                  onPointerUp={(e) => {
                                      if (e.button === 0) choose(index);
                                  }}
                                  onPointerMove={() => {
                                      if (!off && !isActive) setActiveIndex(index);
                                  }}
                                  className={cx(
                                      'flex items-center gap-[8px] rounded-[2px] select-none',
                                      SIZE_CLASSES[size],
                                      off
                                          ? 'opacity-40 cursor-not-allowed'
                                          : 'cursor-pointer text-text',
                                      isActive && !off && 'bg-[rgba(76,168,232,0.12)]',
                                      isSelected && 'text-accent',
                                  )}
                              >
                                  {option.icon !== undefined && (
                                      <span className="inline-flex shrink-0 text-text-secondary">
                                          {option.icon}
                                      </span>
                                  )}
                                  <span className="flex-1 truncate">{option.label}</span>
                                  {isSelected && (
                                      <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                                  )}
                              </li>
                          );
                      })}
                  </ul>,
                  document.body,
              )
            : null;

    return (
        <>
            <button
                ref={triggerRef}
                id={id}
                type="button"
                role="combobox"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-invalid={invalid || undefined}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                onClick={() => (open ? closeList(true) : openList())}
                onKeyDown={handleTriggerKeyDown}
                onMouseEnter={disabled ? undefined : hoverSfx}
                data-sfx-hover="button"
                className={cx(
                    'inline-flex items-center font-mono border rounded-[2px] bg-[rgba(13,13,20,0.75)]',
                    'text-left cursor-pointer transition-all duration-[200ms]',
                    'focus-visible:outline-none',
                    invalid
                        ? 'border-error focus-visible:shadow-glow-error'
                        : cx(
                              'border-border hover:border-border-bright focus-visible:border-accent',
                              'focus-visible:shadow-glow',
                              open && 'border-accent shadow-glow',
                          ),
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                    fullWidth ? 'flex w-full' : 'w-[220px]',
                    SIZE_CLASSES[size],
                    className,
                )}
            >
                {selectedOption?.icon !== undefined && (
                    <span className="inline-flex shrink-0 text-text-secondary">
                        {selectedOption.icon}
                    </span>
                )}
                <span
                    className={cx(
                        'flex-1 min-w-0 truncate',
                        selectedOption === undefined ? 'text-text-muted' : 'text-text',
                    )}
                >
                    {selectedOption?.label ?? placeholder}
                </span>
                <ChevronDown
                    size={12}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={cx(
                        'shrink-0 text-text-secondary transition-transform duration-[150ms]',
                        open && 'rotate-180 text-accent',
                    )}
                />
            </button>
            {name !== undefined && <input type="hidden" name={name} value={selected ?? ''} />}
            {list}
        </>
    );
}

export default Select;
