import type { MouseEvent, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { useClickSfx, useHoverSfx } from '@core/audio';
import type { NavListItem, NavListProps } from './NavList.types';

export function NavList({
    groups,
    activeId,
    onItemClick,
    'aria-label': ariaLabel = 'Navigation',
    className,
}: NavListProps): ReactElement {
    const hoverSfx = useHoverSfx('button');
    const clickSfx = useClickSfx<MouseEvent<HTMLAnchorElement>>();

    function handleClick(item: NavListItem, e: MouseEvent<HTMLAnchorElement>): void {
        clickSfx(e);
        onItemClick?.(item, e);
    }

    return (
        <nav aria-label={ariaLabel} className={cx('flex flex-col gap-4 font-mono', className)}>
            {groups.map((group, gi) => (
                <div key={group.label ?? `group-${gi}`} className="flex flex-col gap-[2px]">
                    {group.label !== undefined && (
                        <span className="px-[10px] pb-[4px] text-[8px] uppercase tracking-[2px] text-text-muted">
                            {group.label}
                        </span>
                    )}
                    <ul className="flex flex-col gap-[2px] list-none m-0 p-0">
                        {group.items.map((item) => {
                            const active = item.id === activeId;
                            return (
                                <li key={item.id}>
                                    <a
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={cx(
                                            'lib-navlist__item',
                                            active && 'lib-navlist__item--active',
                                        )}
                                        onMouseEnter={hoverSfx}
                                        onClick={(e) => handleClick(item, e)}
                                        data-sfx-hover="button"
                                    >
                                        <span className="truncate">{item.label}</span>
                                        {item.badge !== undefined && (
                                            <span className="ml-auto shrink-0">{item.badge}</span>
                                        )}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}

export default NavList;
