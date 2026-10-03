import type { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { NavList } from '@ui';
import { navGroups, slugFromNavId } from '../utils/navigation';
import type { DocsSidebarProps } from './DocsSidebar.types';

const GROUPS = navGroups();

export function DocsSidebar({ activeSlug }: DocsSidebarProps): ReactElement {
    const navigate = useNavigate();

    return (
        <NavList
            aria-label="Documentation"
            groups={GROUPS}
            activeId={activeSlug === '' ? 'home' : activeSlug}
            onItemClick={(item, e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                void navigate(`/${slugFromNavId(item.id)}`);
            }}
        />
    );
}

export default DocsSidebar;
