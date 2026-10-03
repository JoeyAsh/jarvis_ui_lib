import { useState } from 'react';
import type { ReactElement } from 'react';
import { Outlet, useLocation } from 'react-router';
import { GridBackground } from '@ui';
import { DocsHeader } from './DocsHeader';
import { DocsSidebar } from './DocsSidebar';
import { PageFooter } from './PageFooter';
import { currentSlug } from '../utils/navigation';

export function DocsLayout(): ReactElement {
    const location = useLocation();
    const slug = currentSlug(location.pathname);
    // The drawer belongs to the page it was opened on, so navigating closes it.
    const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
    const menuOpen = menuOpenOn === slug;

    return (
        <div className="min-h-screen bg-bg text-text font-mono">
            <GridBackground />
            <DocsHeader
                menuOpen={menuOpen}
                onMenuToggle={() => setMenuOpenOn(menuOpen ? null : slug)}
            />

            <div className="relative z-[1] mx-auto flex max-w-[1280px] gap-8 px-4 pt-6 lg:px-6">
                <aside className="hidden lg:block w-[220px] shrink-0">
                    <div className="sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto pb-8">
                        <DocsSidebar activeSlug={slug} />
                    </div>
                </aside>

                {menuOpen && (
                    <div className="fixed inset-x-0 top-[62px] bottom-0 z-[40] overflow-y-auto border-t border-border bg-bg px-4 py-4 lg:hidden">
                        <DocsSidebar activeSlug={slug} />
                    </div>
                )}

                <main className="min-w-0 flex-1 pb-24">
                    <article className="mx-auto max-w-[860px]">
                        <Outlet />
                        <PageFooter slug={slug} />
                    </article>
                </main>
            </div>
        </div>
    );
}

export default DocsLayout;
