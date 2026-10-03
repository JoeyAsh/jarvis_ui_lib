import type { DocsGroup, DocsPage } from './nav.types';

/** Sidebar order of the groups. */
export const GROUP_ORDER: DocsGroup[] = [
    'Getting started',
    'Customization',
    'Primitives',
    'Compositions',
    'Window',
    'Orb',
    'Hooks',
    'Utilities',
    'Reference',
];

/**
 * Every docs page, in sidebar order within its group. Each `slug` must have a matching
 * `pages/<slug>.mdx` (`pages/index.mdx` for the landing page); `npm run docs:check` verifies this.
 */
export const PAGES: DocsPage[] = [
    { slug: '', title: 'Overview' },

    { slug: 'getting-started/installation', title: 'Installation', group: 'Getting started' },
    { slug: 'getting-started/usage', title: 'Usage', group: 'Getting started' },
    { slug: 'getting-started/sound', title: 'Sound effects', group: 'Getting started' },
    { slug: 'components/jarvis-provider', title: 'JarvisProvider', group: 'Getting started' },

    { slug: 'customization/theming', title: 'Theming', group: 'Customization' },
    { slug: 'customization/tokens', title: 'Design tokens', group: 'Customization' },
    { slug: 'customization/tailwind', title: 'Tailwind', group: 'Customization' },

    { slug: 'components/button', title: 'Button', group: 'Primitives' },
    { slug: 'components/icon-button', title: 'IconButton', group: 'Primitives' },
    { slug: 'components/input', title: 'Input', group: 'Primitives' },
    { slug: 'components/switch', title: 'Switch', group: 'Primitives' },
    { slug: 'components/link', title: 'Link', group: 'Primitives' },
    { slug: 'components/tooltip', title: 'Tooltip', group: 'Primitives' },
    { slug: 'components/divider', title: 'Divider', group: 'Primitives' },
    { slug: 'components/panel', title: 'Panel', group: 'Primitives' },
    { slug: 'components/toast', title: 'Toast', group: 'Primitives' },
    { slug: 'components/top-bar', title: 'TopBar', group: 'Primitives' },

    { slug: 'components/callout', title: 'Callout', group: 'Compositions' },
    { slug: 'components/code-block', title: 'CodeBlock', group: 'Compositions' },
    { slug: 'components/nav-list', title: 'NavList', group: 'Compositions' },
    { slug: 'components/table', title: 'Table', group: 'Compositions' },
    { slug: 'components/tabs', title: 'Tabs', group: 'Compositions' },
    { slug: 'components/toast-provider', title: 'ToastProvider', group: 'Compositions' },
    { slug: 'components/window-manager', title: 'WindowManager', group: 'Compositions' },

    { slug: 'changelog', title: 'Changelog', group: 'Reference' },
];
