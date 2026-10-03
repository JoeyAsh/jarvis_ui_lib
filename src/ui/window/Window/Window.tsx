import { useCallback, useId, useRef, type ReactElement, type MouseEvent } from 'react';
import { Minimize2, RotateCcw, Square, X } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { useClickSfx, useHoverSfx, useSfx } from '@core/audio';
import { Panel } from '../../primitives/Panel/Panel';
import { useDraggable } from '../hooks/useDraggable';
import type { DragState } from '../hooks/useDraggable';
import { rectVars } from '../rectVars';
import { useResizable } from '../hooks/useResizable';
import type { ResizeDir, ResizeState } from '../hooks/useResizable';
import { DOUBLE_CLICK_MS, ICON_SIZE, ICON_STROKE } from './constants';
import type { WindowProps, WindowState } from './Window.types';

export function Window({
    id,
    title,
    ix,
    badge,
    position,
    state = 'idle',
    focused = false,
    mode = 'compact',
    onFocus,
    onDragStart,
    onDragMove,
    onDragEnd,
    onResizeStart,
    onResizeMove,
    onResizeEnd,
    onReset,
    onClose,
    onModeToggle,
    draggable = true,
    resizable = true,
    className,
    itemRenderer,
}: WindowProps): ReactElement {
    const { playOneShot } = useSfx();
    const hoverButtonSfx = useHoverSfx('button');
    const titleId = useId();

    const handleFocus = useCallback((): void => {
        if (onFocus) onFocus(id);
    }, [id, onFocus]);

    const handleDragStart = useCallback(
        (e: PointerEvent): void => {
            if (onDragStart) onDragStart(id, e);
        },
        [id, onDragStart],
    );

    const handleDragMove = useCallback(
        (dragState: DragState, e: PointerEvent): void => {
            if (onDragMove) onDragMove(id, dragState.dx, dragState.dy, e);
        },
        [id, onDragMove],
    );

    const handleDragEnd = useCallback(
        (_dragState: DragState, e: PointerEvent): void => {
            if (onDragEnd) onDragEnd(id, e);
        },
        [id, onDragEnd],
    );

    const { onPointerDown: handlePointerDown, dragging } = useDraggable({
        onStart: handleDragStart,
        onMove: handleDragMove,
        onEnd: handleDragEnd,
        disabled: !draggable,
    });

    const handleResizeStartCb = useCallback(
        (dir: ResizeDir, e: PointerEvent): void => {
            if (onResizeStart) onResizeStart(id, dir, e);
        },
        [id, onResizeStart],
    );

    const handleResizeMoveCb = useCallback(
        (resizeState: ResizeState, e: PointerEvent): void => {
            if (onResizeMove && resizeState.dir !== null) {
                onResizeMove(id, resizeState.dir, resizeState.dx, resizeState.dy, e);
            }
        },
        [id, onResizeMove],
    );

    const handleResizeEndCb = useCallback(
        (_resizeState: ResizeState, e: PointerEvent): void => {
            if (onResizeEnd) onResizeEnd(id, e);
        },
        [id, onResizeEnd],
    );

    const { onPointerDown: handleResizePointerDown, resizing } = useResizable({
        onStart: handleResizeStartCb,
        onMove: handleResizeMoveCb,
        onEnd: handleResizeEndCb,
        disabled: !resizable,
    });

    const handlePointerDownCapture = useCallback((): void => {
        if (onFocus) onFocus(id);
    }, [id, onFocus]);

    const handleReset = useCallback(
        (e: MouseEvent<HTMLButtonElement>): void => {
            e.stopPropagation();
            playOneShot('click');
            playOneShot('recall');
            if (onReset) onReset(id);
        },
        [id, onReset, playOneShot],
    );

    const handleClose = useCallback(
        (e: MouseEvent<HTMLButtonElement>): void => {
            e.stopPropagation();
            if (onClose) onClose(id);
        },
        [id, onClose],
    );

    // Shared by the dock/undock button and the header double-click: plays the
    // expand/collapse sound for the current mode, then toggles it.
    const toggleMode = useCallback((): void => {
        if (!onModeToggle) return;
        playOneShot(mode === 'compact' ? 'expand' : 'collapse');
        onModeToggle(id);
    }, [id, mode, onModeToggle, playOneShot]);

    const handleModeToggle = useCallback(
        (e: MouseEvent<HTMLButtonElement>): void => {
            e.stopPropagation();
            playOneShot('click');
            toggleMode();
        },
        [playOneShot, toggleMode],
    );

    const onCloseClick = useClickSfx(handleClose);

    const lastClickRef = useRef(0);
    const handleHeaderClick = useCallback(
        (e: MouseEvent<HTMLDivElement>): void => {
            const target = e.target instanceof Element ? e.target : null;
            if (target && target.closest('[data-no-drag]')) return;
            const now = performance.now();
            if (now - lastClickRef.current < DOUBLE_CLICK_MS) {
                toggleMode();
                lastClickRef.current = 0;
            } else {
                lastClickRef.current = now;
            }
        },
        [toggleMode],
    );

    const effectiveState: WindowState = resizing ? 'resizing' : dragging ? 'dragging' : state;

    const rootStyle = rectVars('lib-window', position);

    const hasTitle = title !== undefined && title !== null && title !== false && title !== '';

    const headerLeft = (
        <span className="lib-window__hdr-drag" data-testid="window-drag-handle">
            {ix !== undefined && <span className="lib-window__ix">{ix}</span>}
            <span id={titleId} className="lib-window__title">
                {title}
            </span>
        </span>
    );

    const hasModeToggle = onModeToggle !== undefined;
    const hasActions = onReset !== undefined || hasModeToggle || onClose !== undefined;

    const headerActions = hasActions ? (
        <>
            {onReset !== undefined && (
                <button
                    className="lib-window__btn"
                    aria-label="Reset window"
                    title="Reset"
                    onClick={handleReset}
                    onMouseEnter={hoverButtonSfx}
                    onPointerDown={(e) => e.stopPropagation()}
                    type="button"
                    data-no-drag
                    data-sfx-hover="button"
                >
                    <RotateCcw size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden />
                </button>
            )}
            {hasModeToggle && (
                <button
                    className="lib-window__btn"
                    aria-label={mode === 'compact' ? 'Undock window' : 'Dock window'}
                    title={mode === 'compact' ? 'Undock' : 'Dock'}
                    onClick={handleModeToggle}
                    onMouseEnter={hoverButtonSfx}
                    onPointerDown={(e) => e.stopPropagation()}
                    type="button"
                    data-no-drag
                    data-sfx-hover="button"
                >
                    {mode === 'compact' ? (
                        <Square size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden />
                    ) : (
                        <Minimize2 size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden />
                    )}
                </button>
            )}
            {onClose !== undefined && (
                <button
                    className="lib-window__btn lib-window__btn--close"
                    aria-label="Close window"
                    title="Close"
                    onClick={onCloseClick}
                    onMouseEnter={hoverButtonSfx}
                    onPointerDown={(e) => e.stopPropagation()}
                    type="button"
                    data-no-drag
                    data-sfx-hover="button"
                >
                    <X size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden />
                </button>
            )}
        </>
    ) : undefined;

    return (
        <div
            className={cx('lib-window', className)}
            data-state={effectiveState}
            data-mode={mode}
            data-window-id={id}
            style={rootStyle}
            role="region"
            aria-labelledby={hasTitle ? titleId : undefined}
            onPointerDownCapture={handlePointerDownCapture}
        >
            <Panel
                ix={headerLeft}
                title={undefined}
                badge={badge}
                actions={headerActions}
                focused={focused}
                onFocus={handleFocus}
                onHeaderPointerDown={handlePointerDown}
                onHeaderClick={handleHeaderClick}
            >
                <div className="lib-window__body">
                    {itemRenderer({ mode, focused, dragging: dragging || resizing })}
                </div>
            </Panel>
            {resizable && (
                <>
                    <span
                        className="lib-window__resize lib-window__resize--n"
                        onPointerDown={handleResizePointerDown('n')}
                        data-testid="resize-n"
                    />
                    <span
                        className="lib-window__resize lib-window__resize--s"
                        onPointerDown={handleResizePointerDown('s')}
                        data-testid="resize-s"
                    />
                    <span
                        className="lib-window__resize lib-window__resize--e"
                        onPointerDown={handleResizePointerDown('e')}
                        data-testid="resize-e"
                    />
                    <span
                        className="lib-window__resize lib-window__resize--w"
                        onPointerDown={handleResizePointerDown('w')}
                        data-testid="resize-w"
                    />
                    <span
                        className="lib-window__resize lib-window__resize--ne"
                        onPointerDown={handleResizePointerDown('ne')}
                        data-testid="resize-ne"
                    />
                    <span
                        className="lib-window__resize lib-window__resize--nw"
                        onPointerDown={handleResizePointerDown('nw')}
                        data-testid="resize-nw"
                    />
                    <span
                        className="lib-window__resize lib-window__resize--se"
                        onPointerDown={handleResizePointerDown('se')}
                        data-testid="resize-se"
                    />
                    <span
                        className="lib-window__resize lib-window__resize--sw"
                        onPointerDown={handleResizePointerDown('sw')}
                        data-testid="resize-sw"
                    />
                </>
            )}
        </div>
    );
}

export default Window;
