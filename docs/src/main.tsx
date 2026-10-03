import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { routerBasename } from './utils/paths';
import './docs.css';

const container = document.getElementById('docs-root');

if (container) {
    createRoot(container).render(
        <StrictMode>
            <BrowserRouter basename={routerBasename()}>
                <App />
            </BrowserRouter>
        </StrictMode>,
    );
}
