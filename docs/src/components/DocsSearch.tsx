import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { Dialog, IconButton, Input, Kbd } from '@ui';
import { cx } from '@common/utils/cx';
import { loadSearch, runSearch } from '../utils/search';
import { slugify } from '../utils/text';
import type { SearchEngine, SearchResult } from '../search.types';

/**
 * Site search: a trigger in the header, `Ctrl/Cmd+K` (or `/`) anywhere, and a dialog with a
 * combobox over the build-time page index.
 */
export function DocsSearch(): ReactElement {
    const navigate = useNavigate();
    const listId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [engine, setEngine] = useState<SearchEngine | null>(null);
    const [active, setActive] = useState(0);

    const results: SearchResult[] = engine === null ? [] : runSearch(engine, query);
    const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

    useEffect(() => {
        function onKey(e: globalThis.KeyboardEvent): void {
            const typing =
                e.target instanceof HTMLElement &&
                (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
            if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
                e.preventDefault();
                setOpen(true);
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (open && engine === null) void loadSearch().then(setEngine);
    }, [open, engine]);

    function changeOpen(next: boolean): void {
        setOpen(next);
        if (!next) {
            setQuery('');
            setActive(0);
        }
    }

    function go(result: SearchResult): void {
        changeOpen(false);
        const hash = result.heading === undefined ? '' : `#${slugify(result.heading)}`;
        void navigate(`/${result.doc.slug}${hash}`);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            const hit = results[active];
            if (hit !== undefined) {
                e.preventDefault();
                go(hit);
            }
        }
    }

    const optionId = (i: number): string => `${listId}-option-${i}`;

    return (
        <>
            <button
                type="button"
                onClick={() => changeOpen(true)}
                aria-label="Search documentation"
                className="hidden md:inline-flex items-center gap-3 h-[26px] px-[8px] border border-border rounded-[2px] bg-[rgba(13,13,20,0.75)] text-[10px] text-text-muted hover:border-border-bright cursor-pointer"
            >
                <Search size={12} aria-hidden="true" />
                <span>Search docs…</span>
                <Kbd>{isMac ? '⌘ K' : 'Ctrl K'}</Kbd>
            </button>
            <IconButton
                icon={Search}
                label="Search documentation"
                size="sm"
                className="md:hidden"
                onClick={() => changeOpen(true)}
            />
            <Dialog
                open={open}
                onOpenChange={changeOpen}
                title="Search documentation"
                hideTitle
                showClose={false}
                size="lg"
                initialFocusRef={inputRef}
            >
                <Input
                    ref={inputRef}
                    fullWidth
                    role="combobox"
                    aria-label="Search documentation"
                    aria-expanded={results.length > 0}
                    aria-controls={listId}
                    aria-activedescendant={results.length > 0 ? optionId(active) : undefined}
                    aria-autocomplete="list"
                    placeholder="Search components, guides, props…"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActive(0);
                    }}
                    onKeyDown={handleKeyDown}
                    startAdornment={<Search size={12} aria-hidden="true" />}
                    endAdornment={<Kbd>Esc</Kbd>}
                />
                <ul
                    id={listId}
                    role="listbox"
                    aria-label="Results"
                    className="m-0 mt-3 list-none p-0"
                >
                    {results.map((r, i) => (
                        <li
                            key={r.doc.id}
                            id={optionId(i)}
                            role="option"
                            aria-selected={i === active}
                            onMouseEnter={() => setActive(i)}
                            onMouseDown={(e) => {
                                // mousedown keeps focus in the input (keyboard users use Enter).
                                e.preventDefault();
                                go(r);
                            }}
                            className={cx(
                                'flex cursor-pointer items-center gap-3 border-l px-3 py-2',
                                i === active
                                    ? 'border-accent bg-[rgba(76,168,232,0.08)] text-accent-bright'
                                    : 'border-transparent text-text-secondary',
                            )}
                        >
                            <span className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate text-[11px] uppercase tracking-[1px]">
                                    {r.doc.title}
                                </span>
                                {r.heading !== undefined && (
                                    <span className="truncate text-[10px] text-text-muted">
                                        § {r.heading}
                                    </span>
                                )}
                            </span>
                            <span className="shrink-0 text-[9px] uppercase tracking-[1px] text-text-muted">
                                {r.doc.group}
                            </span>
                        </li>
                    ))}
                </ul>
                {query.trim() !== '' && engine !== null && results.length === 0 && (
                    <p className="m-0 mt-3 text-[11px] text-text-muted">
                        No results for “{query}”.
                    </p>
                )}
                {engine === null && (
                    <p className="m-0 mt-3 text-[11px] text-text-muted">Loading index…</p>
                )}
            </Dialog>
        </>
    );
}

export default DocsSearch;
