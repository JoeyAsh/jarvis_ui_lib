import { Route, Routes } from 'react-router';
import type { ReactElement } from 'react';
import { DocsLayout } from './layout/DocsLayout';
import { JarvisProvider } from '@ui';
import { MdxPage } from './layout/MdxPage';
import { NotFound } from './layout/NotFound';
import { PAGE_ROUTES } from './routes';

export function App(): ReactElement {
    return (
        <JarvisProvider soundBaseUrl={`${import.meta.env.BASE_URL}sounds/`}>
            <Routes>
                <Route element={<DocsLayout />}>
                    {PAGE_ROUTES.map(({ slug, Page }) =>
                        slug === '' ? (
                            <Route
                                key="index"
                                index
                                element={<MdxPage slug={slug} Page={Page} />}
                            />
                        ) : (
                            <Route
                                key={slug}
                                path={slug}
                                element={<MdxPage slug={slug} Page={Page} />}
                            />
                        ),
                    )}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </JarvisProvider>
    );
}

export default App;
