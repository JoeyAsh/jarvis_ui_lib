import {
    useLayoutEffect,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactElement,
} from 'react';
import { cx } from '@common/utils/cx';
import { useSfx } from '@core/audio';
import { Window } from '../../window/Window';
import type { WindowState } from '../../window/Window';
import { SnapOverlay } from '../../window/SnapOverlay';
import { SwapOverlay } from '../../window/SwapOverlay';
import { computeAllSlots, slotAtPoint, TOP_BAR_HEIGHT } from '../../window/slotGrid';
import type { SlotId, SlotRect } from '../../window/slotGrid';
import type { ResizeDir } from '../../window/hooks/useResizable';
import type {
    ManagedWindow,
    ExpandedRect,
    WindowManagerProps,
    PanelMode,
    PanelContentRenderProps,
    ActiveDrag,
    FreeDrag,
    WindowLocalState,
} from './WindowManager.types';
import {
    getViewport,
    measureContainer,
    toLocalPoint,
    applyResize,
    clampExpandedRect,
    defaultExpandedRect,
    cascadeRect,
    withoutKeys,
} from './utils';
import { MIN_EXPANDED_W, MIN_EXPANDED_H } from './constants';

// Re-export so consumers can import from this module.
export type { PanelMode, PanelContentRenderProps, ManagedWindow, ExpandedRect };

// ── WindowManager ─────────────────────────────────────────────────────────────

/**
 * WindowManager — controlled composition that renders N windows at slot-derived
 * positions (compact mode) or at free-floating positions (expanded mode).
 */
export function WindowManager({
    windows,
    assignments,
    onAssignmentsChange,
    homeAssignments,
    focusedId = null,
    onFocusChange,
    modes: modesProp,
    onModesChange,
    expandedRects: expandedRectsProp,
    onExpandedRectsChange,
    onClose,
    className,
}: WindowManagerProps): ReactElement {
    const { playOneShot } = useSfx();
    const [viewport, setViewport] = useState(getViewport);

    // Stacking order of windows, last used last; drawn on top via `stackIndex`.
    const [zOrder, setZOrder] = useState<string[]>([]);
    const bringToFront = useCallback((id: string): void => {
        setZOrder((prev) =>
            prev[prev.length - 1] === id ? prev : [...prev.filter((x) => x !== id), id],
        );
    }, []);

    // Per-window local state (resizing/idle).
    const [windowStates, setWindowStates] = useState<Record<string, WindowLocalState>>({});

    // Custom per-window rect overrides from resize gestures (compact mode).
    const [customRects, setCustomRects] = useState<Record<string, SlotRect>>({});

    // Starting rect captured at resize-start for computing deltas live.
    const resizeStartRectRef = useRef<Record<string, SlotRect>>({});

    // ── Mode state (uncontrolled unless `modes` prop is provided) ──────────────
    const [internalModes, setInternalModes] = useState<Record<string, PanelMode>>({});
    const isModesControlled = modesProp !== undefined;
    const modes: Record<string, PanelMode> = isModesControlled ? modesProp : internalModes;

    // ── Expanded rect state (uncontrolled unless `expandedRects` prop provided) ─
    const [internalExpandedRects, setInternalExpandedRects] = useState<
        Record<string, ExpandedRect>
    >({});
    const isExpandedControlled = expandedRectsProp !== undefined;
    const expandedRects: Record<string, ExpandedRect> = isExpandedControlled
        ? expandedRectsProp
        : internalExpandedRects;

    // Container root — slot geometry is derived from its measured size, not the viewport.
    const rootRef = useRef<HTMLDivElement>(null);

    // Re-layout whenever the container (or the window) changes size.
    useLayoutEffect(() => {
        const remeasure = (): void => {
            const g = measureContainer(rootRef.current);
            setViewport((prev) => (prev.w === g.w && prev.h === g.h ? prev : { w: g.w, h: g.h }));
            // Clamp all expanded rects to the new container size.
            if (!isExpandedControlled) {
                setInternalExpandedRects((prev) => {
                    const next = { ...prev };
                    let changed = false;
                    for (const id of Object.keys(next)) {
                        const clamped = clampExpandedRect(next[id], g.w, g.h);
                        if (
                            clamped.x !== next[id].x ||
                            clamped.y !== next[id].y ||
                            clamped.w !== next[id].w ||
                            clamped.h !== next[id].h
                        ) {
                            next[id] = clamped;
                            changed = true;
                        }
                    }
                    return changed ? next : prev;
                });
            }
        };
        remeasure();
        window.addEventListener('resize', remeasure);
        let observer: ResizeObserver | null = null;
        const el = rootRef.current;
        if (typeof ResizeObserver !== 'undefined' && el !== null) {
            observer = new ResizeObserver(remeasure);
            observer.observe(el);
        }
        return () => {
            window.removeEventListener('resize', remeasure);
            if (observer !== null) observer.disconnect();
        };
    }, [isExpandedControlled]);

    const slotRects = computeAllSlots(viewport.w, viewport.h);

    // ── Compact slot-drag state ────────────────────────────────────────────────
    const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
    const [snapTarget, setSnapTarget] = useState<SlotId | null>(null);
    const [swapTarget, setSwapTarget] = useState<string | null>(null);

    // ── Expanded free-drag state ───────────────────────────────────────────────
    const [freeDrag, setFreeDragState] = useState<FreeDrag | null>(null);
    // Live position during free drag (avoids updating expandedRects on every move).
    const [freeDragPos, setFreeDragPosState] = useState<{ x: number; y: number } | null>(null);
    // Synchronous mirrors so pointer handlers never read stale gesture state.
    const freeDragRef = useRef<FreeDrag | null>(null);
    const freeDragPosRef = useRef<{ x: number; y: number } | null>(null);
    const setFreeDrag = useCallback((next: FreeDrag | null): void => {
        freeDragRef.current = next;
        setFreeDragState(next);
    }, []);
    const setFreeDragPos = useCallback((next: { x: number; y: number } | null): void => {
        freeDragPosRef.current = next;
        setFreeDragPosState(next);
    }, []);

    // ── Expanded resize state ──────────────────────────────────────────────────
    const expandedResizeStartRef = useRef<Record<string, ExpandedRect>>({});

    // Keep assignments in a ref so event handlers never close over stale values.
    const assignmentsRef = useRef(assignments);
    useLayoutEffect(() => {
        assignmentsRef.current = assignments;
    });

    const modesRef = useRef(modes);
    useLayoutEffect(() => {
        modesRef.current = modes;
    });

    // Floating windows are always expanded, whatever the modes map says.
    const floatingRef = useRef<Set<string>>(new Set());
    useLayoutEffect(() => {
        floatingRef.current = new Set(windows.filter((w) => w.floating === true).map((w) => w.id));
    });
    const modeOf = useCallback(
        (id: string): PanelMode =>
            floatingRef.current.has(id) ? 'expanded' : (modesRef.current[id] ?? 'compact'),
        [],
    );

    const expandedRectsRef = useRef(expandedRects);
    useLayoutEffect(() => {
        expandedRectsRef.current = expandedRects;
    });

    // Home assignments: the `homeAssignments` prop (follows changes) or, without it, the
    // assignments captured on mount.
    const homeRef = useRef<Record<string, SlotId>>(homeAssignments ?? assignments);
    useLayoutEffect(() => {
        if (homeAssignments !== undefined) homeRef.current = homeAssignments;
    }, [homeAssignments]);

    // ── Mode helpers ───────────────────────────────────────────────────────────

    const setMode = useCallback(
        (id: string, next: PanelMode): void => {
            if (isModesControlled) {
                if (onModesChange) onModesChange({ ...modesRef.current, [id]: next });
            } else {
                setInternalModes((prev) => {
                    const updated = { ...prev, [id]: next };
                    if (onModesChange) onModesChange(updated);
                    return updated;
                });
            }
        },
        [isModesControlled, onModesChange],
    );

    // Writes an expanded rect: stored internally when uncontrolled, reported through
    // `onExpandedRectsChange` in both modes. The ref is updated synchronously so several changes
    // within one gesture build on each other before the next render.
    const setExpandedRect = useCallback(
        (id: string, rect: ExpandedRect): void => {
            const next = { ...expandedRectsRef.current, [id]: rect };
            expandedRectsRef.current = next;
            if (!isExpandedControlled) {
                setInternalExpandedRects((prev) => ({ ...prev, [id]: rect }));
            }
            if (onExpandedRectsChange) onExpandedRectsChange(next);
        },
        [isExpandedControlled, onExpandedRectsChange],
    );

    const clearExpandedRect = useCallback(
        (id: string): void => {
            if (!(id in expandedRectsRef.current)) return;
            const next = { ...expandedRectsRef.current };
            delete next[id];
            expandedRectsRef.current = next;
            if (!isExpandedControlled) {
                setInternalExpandedRects((prev) => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });
            }
            if (onExpandedRectsChange) onExpandedRectsChange(next);
        },
        [isExpandedControlled, onExpandedRectsChange],
    );

    // ── Mode toggle (from button or double-click) ──────────────────────────────

    const handleModeToggle = useCallback(
        (id: string): void => {
            const current = modesRef.current[id] ?? 'compact';
            const next: PanelMode = current === 'compact' ? 'expanded' : 'compact';
            if (next === 'expanded') {
                // Compute default expanded rect from slot.
                const slotId = assignmentsRef.current[id] as SlotId | undefined;
                if (slotId !== undefined) {
                    const g = measureContainer(rootRef.current);
                    const rects = computeAllSlots(g.w, g.h);
                    const existing = expandedRectsRef.current[id];
                    const rect = existing
                        ? clampExpandedRect(existing, g.w, g.h)
                        : defaultExpandedRect(rects[slotId], g.w, g.h);
                    setExpandedRect(id, rect);
                }
            }
            setMode(id, next);
            bringToFront(id);
            // Focus the toggled window.
            if (onFocusChange) onFocusChange(id);
        },
        [setMode, setExpandedRect, onFocusChange, bringToFront],
    );

    // ── Focus ─────────────────────────────────────────────────────────────────

    const handleFocus = useCallback(
        (id: string): void => {
            bringToFront(id);
            if (onFocusChange) onFocusChange(id);
        },
        [onFocusChange, bringToFront],
    );

    // ── Close ─────────────────────────────────────────────────────────────────

    const focusedIdRef = useRef(focusedId);
    useLayoutEffect(() => {
        focusedIdRef.current = focusedId;
    });

    const handleClose = useCallback(
        (id: string): void => {
            if (focusedIdRef.current === id && onFocusChange) onFocusChange(null);
            if (onClose) onClose(id);
        },
        [onClose, onFocusChange],
    );

    // ── Compact drag: slot-swap ────────────────────────────────────────────────

    const windowAtSlot = useCallback((slotId: SlotId, excludeId: string): string | null => {
        for (const [wId, sId] of Object.entries(assignmentsRef.current)) {
            if (sId === slotId && wId !== excludeId) return wId;
        }
        return null;
    }, []);

    const handleDragStart = useCallback(
        (id: string): void => {
            const current = modeOf(id);
            if (current === 'expanded') return; // expanded drag handled separately
            const origin = assignmentsRef.current[id] as SlotId | undefined;
            if (origin === undefined) return;
            setActiveDrag({ windowId: id, originSlot: origin });
            setSnapTarget(null);
            setSwapTarget(null);
        },
        [modeOf],
    );

    const handleDragMove = useCallback(
        (id: string, _dx: number, _dy: number, e: PointerEvent): void => {
            const current = modeOf(id);
            if (current === 'expanded') return;
            const g = measureContainer(rootRef.current);
            const p = toLocalPoint(e.clientX, e.clientY, g);
            const hovered = slotAtPoint(p.x, p.y, computeAllSlots(g.w, g.h));
            setSnapTarget(hovered);
            const swap = hovered !== null ? windowAtSlot(hovered, id) : null;
            setSwapTarget(swap);
        },
        [windowAtSlot, modeOf],
    );

    const handleDragEnd = useCallback(
        (id: string, e: PointerEvent): void => {
            const current = modeOf(id);
            if (current === 'expanded') return;

            const g = measureContainer(rootRef.current);
            const p = toLocalPoint(e.clientX, e.clientY, g);
            const hovered = slotAtPoint(p.x, p.y, computeAllSlots(g.w, g.h));

            const current2 = assignmentsRef.current;
            const originSlot = current2[id] as SlotId | undefined;

            if (hovered !== null && originSlot !== undefined) {
                const occupant = windowAtSlot(hovered, id);
                if (occupant !== null) {
                    const next: Record<string, SlotId> = { ...current2 };
                    next[id] = hovered;
                    next[occupant] = originSlot;
                    onAssignmentsChange(next);
                } else if (hovered !== originSlot) {
                    const next: Record<string, SlotId> = { ...current2 };
                    next[id] = hovered;
                    onAssignmentsChange(next);
                }
            }

            setActiveDrag(null);
            setSnapTarget(null);
            setSwapTarget(null);
        },
        [windowAtSlot, onAssignmentsChange, modeOf],
    );

    // ── Expanded free-drag ─────────────────────────────────────────────────────

    const handleExpandedDragStart = useCallback(
        (id: string, e: PointerEvent): void => {
            const current = modeOf(id);
            if (current !== 'expanded') return;
            const rect = expandedRectsRef.current[id];
            if (!rect) return;
            setFreeDrag({
                windowId: id,
                startX: e.clientX,
                startY: e.clientY,
                originX: rect.x,
                originY: rect.y,
            });
            setFreeDragPos({ x: rect.x, y: rect.y });
            bringToFront(id);
            if (onFocusChange) onFocusChange(id);
        },
        [onFocusChange, setFreeDrag, setFreeDragPos, modeOf, bringToFront],
    );

    const handleExpandedDragMove = useCallback(
        (id: string, dx: number, dy: number, _e: PointerEvent): void => {
            const current = modeOf(id);
            if (current !== 'expanded') return;
            const drag = freeDragRef.current;
            if (!drag || drag.windowId !== id) return;
            const vp = measureContainer(rootRef.current);
            const rect = expandedRectsRef.current[id];
            const w = rect ? rect.w : MIN_EXPANDED_W;
            const h = rect ? rect.h : MIN_EXPANDED_H;
            const rawX = drag.originX + dx;
            const rawY = drag.originY + dy;
            const x = Math.max(0, Math.min(rawX, Math.max(0, vp.w - w)));
            const y = Math.max(TOP_BAR_HEIGHT, Math.min(rawY, Math.max(TOP_BAR_HEIGHT, vp.h - h)));
            setFreeDragPos({ x, y });
        },
        [setFreeDragPos, modeOf],
    );

    const handleExpandedDragEnd = useCallback(
        (id: string, _e: PointerEvent): void => {
            const current = modeOf(id);
            if (current !== 'expanded') return;
            const drag = freeDragRef.current;
            if (!drag || drag.windowId !== id) return;
            // Commit final position.
            const pos = freeDragPosRef.current;
            const rect = expandedRectsRef.current[id];
            if (pos && rect && (pos.x !== rect.x || pos.y !== rect.y)) {
                setExpandedRect(id, { ...rect, x: pos.x, y: pos.y });
            }
            setFreeDrag(null);
            setFreeDragPos(null);
        },
        [setExpandedRect, setFreeDrag, setFreeDragPos, modeOf],
    );

    // ── Compact resize handlers ────────────────────────────────────────────────

    const handleResizeStart = useCallback(
        (id: string, _dir: ResizeDir): void => {
            const mode = modeOf(id);

            if (mode === 'expanded') {
                // Expanded resize — capture current expanded rect.
                const rect = expandedRectsRef.current[id];
                if (rect) expandedResizeStartRef.current[id] = rect;
            } else {
                // Compact resize.
                const slotId = assignmentsRef.current[id] as SlotId | undefined;
                if (slotId === undefined) return;
                const currentCustom = customRects[id];
                const baseRect = currentCustom ?? slotRects[slotId];
                resizeStartRectRef.current[id] = baseRect;
            }

            setWindowStates((prev) => ({ ...prev, [id]: 'resizing' }));
        },
        [customRects, slotRects, modeOf],
    );

    const handleResizeMove = useCallback(
        (id: string, dir: ResizeDir, dx: number, dy: number): void => {
            const mode = modeOf(id);
            if (mode === 'expanded') {
                const startRect = expandedResizeStartRef.current[id];
                if (!startRect) return;
                const newRect = applyResize(startRect, dir, dx, dy, MIN_EXPANDED_W, MIN_EXPANDED_H);
                setExpandedRect(id, newRect);
            } else {
                const startRect = resizeStartRectRef.current[id];
                if (startRect === undefined) return;
                const newRect = applyResize(startRect, dir, dx, dy);
                setCustomRects((prev) => ({ ...prev, [id]: newRect }));
            }
        },
        [setExpandedRect, modeOf],
    );

    const handleResizeEnd = useCallback((id: string): void => {
        setWindowStates((prev) => ({ ...prev, [id]: 'idle' }));
    }, []);

    // ── Reset ─────────────────────────────────────────────────────────────────

    const handleReset = useCallback(
        (id: string): void => {
            // Clear custom compact rect.
            setCustomRects((prev) => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
            // Clear expanded rect.
            clearExpandedRect(id);
            // Reset mode to compact.
            setMode(id, 'compact');
            // Reset to home slot.
            const homeSlot = homeRef.current[id] as SlotId | undefined;
            if (homeSlot !== undefined) {
                onAssignmentsChange({ ...assignmentsRef.current, [id]: homeSlot });
            }
            setWindowStates((prev) => ({ ...prev, [id]: 'idle' }));
        },
        [onAssignmentsChange, clearExpandedRect, setMode],
    );

    // ── Floating windows: seed rects, open sound, prune state of removed windows ──

    const knownIdsRef = useRef<Set<string> | null>(null);
    useLayoutEffect(() => {
        const ids = new Set(windows.map((w) => w.id));
        const previous = knownIdsRef.current;
        knownIdsRef.current = ids;

        const g = measureContainer(rootRef.current);
        let floatingIndex = 0;
        let opened = false;
        for (const win of windows) {
            if (win.floating !== true) continue;
            const index = floatingIndex;
            floatingIndex += 1;
            if (expandedRectsRef.current[win.id] !== undefined) continue;
            setExpandedRect(
                win.id,
                win.defaultRect !== undefined
                    ? clampExpandedRect(win.defaultRect, g.w, g.h)
                    : cascadeRect(index, g.w, g.h),
            );
            if (previous !== null && !previous.has(win.id)) {
                opened = true;
                bringToFront(win.id);
            }
        }
        if (opened) playOneShot('menu_open');

        if (previous === null) return;
        const removed = [...previous].filter((id) => !ids.has(id));
        if (removed.length === 0) return;
        setWindowStates((prev) => withoutKeys(prev, removed));
        setCustomRects((prev) => withoutKeys(prev, removed));
        if (!isExpandedControlled) {
            expandedRectsRef.current = withoutKeys(expandedRectsRef.current, removed);
            setInternalExpandedRects((prev) => withoutKeys(prev, removed));
        }
        for (const id of removed) {
            delete resizeStartRectRef.current[id];
            delete expandedResizeStartRef.current[id];
        }
        setZOrder((prev) => prev.filter((id) => ids.has(id)));
    }, [windows, setExpandedRect, bringToFront, playOneShot, isExpandedControlled]);

    // Click outside windows → clear focus.
    useEffect(() => {
        const onDocPointerDown = (e: PointerEvent): void => {
            const target = e.target instanceof Element ? e.target : null;
            if (!target) return;
            if (!target.closest('[data-window-id]')) {
                if (onFocusChange) onFocusChange(null);
            }
        };
        document.addEventListener('pointerdown', onDocPointerDown);
        return () => {
            document.removeEventListener('pointerdown', onDocPointerDown);
        };
    }, [onFocusChange]);

    const rootCls = cx('lib-wm', className);

    // Compute ghostRect for SwapOverlay.
    const swapGhostRect: SlotRect | null =
        swapTarget !== null ? (slotRects[assignments[swapTarget]] ?? null) : null;

    return (
        <div ref={rootRef} className={rootCls}>
            {windows.map((win) => {
                const isFloating = win.floating === true;
                const slotId = assignments[win.id] as SlotId | undefined;
                if (slotId === undefined && !isFloating) return null;

                const mode: PanelMode = isFloating ? 'expanded' : (modes[win.id] ?? 'compact');
                // A floating window has no slot; its rect is seeded before the first paint.
                const baseRect =
                    slotId !== undefined
                        ? slotRects[slotId]
                        : (win.defaultRect ?? cascadeRect(0, viewport.w, viewport.h));
                const closable = win.closable ?? isFloating;
                const localState = windowStates[win.id] ?? 'idle';
                const isCompactDragging =
                    activeDrag !== null && activeDrag.windowId === win.id && mode === 'compact';
                const isExpandedDragging =
                    freeDrag !== null && freeDrag.windowId === win.id && mode === 'expanded';
                const isFocused = focusedId === win.id;

                // Resolve position:
                // - expanded → expandedRects[id] (with live drag override)
                // - compact → slot rect (with custom resize override)
                let position: { x: number; y: number; w: number; h: number };

                if (mode === 'expanded') {
                    const expRect = expandedRects[win.id];
                    if (expRect) {
                        const liveX = isExpandedDragging && freeDragPos ? freeDragPos.x : expRect.x;
                        const liveY = isExpandedDragging && freeDragPos ? freeDragPos.y : expRect.y;
                        position = { x: liveX, y: liveY, w: expRect.w, h: expRect.h };
                    } else {
                        // Expanded rect not yet computed — fall back to slot rect.
                        position = baseRect;
                    }
                } else {
                    position = customRects[win.id] ?? baseRect;
                }

                // Resolve visual window state.
                let winState: WindowState = 'idle';
                if (localState === 'resizing') {
                    winState = 'resizing';
                } else if (isExpandedDragging) {
                    winState = 'dragging';
                } else if (isCompactDragging) {
                    if (swapTarget !== null) {
                        winState = 'swap-preview';
                    } else if (snapTarget !== null) {
                        winState = 'snap-preview';
                    } else {
                        winState = 'dragging';
                    }
                } else if (isFocused) {
                    winState = 'focused';
                }

                // In compact mode: drag fires compact drag handlers.
                // In expanded mode: drag fires expanded free-drag handlers.
                // Resize only works in expanded mode (CSS hides handles in compact).
                const isDraggable = true;
                const isResizable = mode === 'expanded';

                return (
                    <Window
                        key={win.id}
                        id={win.id}
                        title={win.title}
                        ix={win.ix}
                        badge={win.badge}
                        position={position}
                        state={winState}
                        mode={mode}
                        focused={isFocused}
                        onFocus={handleFocus}
                        onDragStart={
                            mode === 'expanded' ? handleExpandedDragStart : handleDragStart
                        }
                        onDragMove={mode === 'expanded' ? handleExpandedDragMove : handleDragMove}
                        onDragEnd={mode === 'expanded' ? handleExpandedDragEnd : handleDragEnd}
                        onResizeStart={handleResizeStart}
                        onResizeMove={handleResizeMove}
                        onResizeEnd={handleResizeEnd}
                        onReset={isFloating ? undefined : handleReset}
                        onModeToggle={isFloating ? undefined : handleModeToggle}
                        onClose={closable ? handleClose : undefined}
                        closeOnEscape={closable && isFloating}
                        stackIndex={zOrder.indexOf(win.id) + 1}
                        draggable={isDraggable}
                        resizable={isResizable}
                        itemRenderer={win.itemRenderer}
                    />
                );
            })}

            {/* SnapOverlay and SwapOverlay only active during compact drag */}
            <SnapOverlay
                active={activeDrag !== null}
                slotRects={slotRects}
                hoveredSlot={snapTarget}
            />

            <SwapOverlay
                active={activeDrag !== null && swapTarget !== null}
                ghostRect={swapGhostRect}
                hovered={activeDrag !== null && swapTarget !== null}
            />
        </div>
    );
}

export default WindowManager;
