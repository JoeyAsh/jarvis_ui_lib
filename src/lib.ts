// ================================================================
// jarvis-react-ui — package entry (library build only)
// Bundles design tokens, the Tailwind theme and every component
// stylesheet into a single `style.css`, and re-exports the public API.
// ================================================================

import './styles/tokens.css';
import './index.css';
// Imported here and not only in ui/index.ts: the entry is the one module Rollup always keeps, while
// a re-export-only barrel can be tree-shaken together with its side-effect imports.
import './ui/ui.css';
import './ui/components.css';

export * from './ui';
export * from './core/audio';
export type { OrbState, AppOrbState, PanelId, LocationCoords, ClassValue } from './common';
export { cx, formatDuration, formatAge, formatTime, relativeTime } from './common';
