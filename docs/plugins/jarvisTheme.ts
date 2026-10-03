import type { ThemeRegistration } from 'shiki';

/**
 * Shiki theme built from the JARVIS design tokens (src/styles/tokens.css). Build-time only: the
 * colors end up as inline styles in the pre-highlighted HTML, so the values are literal hex here.
 */
export const jarvisTheme: ThemeRegistration = {
    name: 'jarvis',
    type: 'dark',
    colors: {
        'editor.background': '#00000000',
        'editor.foreground': '#e8f4ff',
    },
    tokenColors: [
        {
            scope: ['comment', 'punctuation.definition.comment'],
            settings: { foreground: '#4a6278', fontStyle: 'italic' },
        },
        {
            scope: ['keyword', 'storage', 'storage.type', 'keyword.operator.new'],
            settings: { foreground: '#6ec4ff' },
        },
        {
            scope: ['string', 'string.template', 'punctuation.definition.string'],
            settings: { foreground: '#4ce8a8' },
        },
        {
            scope: ['constant.numeric', 'constant.language', 'support.constant'],
            settings: { foreground: '#e8b24c' },
        },
        {
            scope: ['entity.name.function', 'support.function', 'meta.function-call'],
            settings: { foreground: '#4ca8e8' },
        },
        {
            scope: ['entity.name.tag', 'support.class.component', 'entity.name.type'],
            settings: { foreground: '#4ca8e8' },
        },
        {
            scope: ['entity.other.attribute-name'],
            settings: { foreground: '#e8b24c' },
        },
        {
            scope: ['punctuation', 'meta.brace', 'keyword.operator'],
            settings: { foreground: '#6b8fa8' },
        },
        {
            scope: ['variable', 'variable.other', 'meta.object-literal.key'],
            settings: { foreground: '#e8f4ff' },
        },
    ],
};
