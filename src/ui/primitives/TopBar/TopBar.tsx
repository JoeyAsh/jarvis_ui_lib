import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { TopBarProps } from './TopBar.types';

export function TopBar({
    left,
    center,
    right,
    position = 'fixed',
    className,
}: TopBarProps): ReactElement {
    return (
        <div
            className={cx(
                'lib-topbar',
                position !== 'fixed' && `lib-topbar--${position}`,
                className,
            )}
        >
            {/* Bottom corner brackets (::before and ::after on .lib-topbar handle tl/tr) */}
            <span className="lib-topbar__c-bl" />
            <span className="lib-topbar__c-br" />

            {/* Circumnavigating trace */}
            <span className="lib-topbar__trace">
                <i className="lib-topbar__trace-l" />
                <i className="lib-topbar__trace-r" />
            </span>

            <div className="lib-topbar__left">{left}</div>
            <div className="lib-topbar__center">{center}</div>
            <div className="lib-topbar__right">{right}</div>
        </div>
    );
}

export default TopBar;
