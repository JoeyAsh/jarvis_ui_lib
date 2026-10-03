import type { ThemePreset } from './ThemePlayground.types';

/** Example accent themes for the theming playground. Values are plain CSS custom properties. */
export const THEME_PRESETS: ThemePreset[] = [
    {
        id: 'jarvis',
        label: 'JARVIS',
        vars: {
            '--accent': '#4ca8e8',
            '--accent-bright': '#6ec4ff',
            '--accent-dim': '#2d6aa1',
            '--border-bright': '#2a3d4f',
            '--glow': '0 0 8px #4ca8e8aa',
            '--glow-strong': '0 0 20px #4ca8e8cc, 0 0 40px #4ca8e844',
        },
    },
    {
        id: 'amber',
        label: 'Amber',
        vars: {
            '--accent': '#e8a84c',
            '--accent-bright': '#ffc76e',
            '--accent-dim': '#a1702d',
            '--border-bright': '#4f3d2a',
            '--glow': '0 0 8px #e8a84caa',
            '--glow-strong': '0 0 20px #e8a84ccc, 0 0 40px #e8a84c44',
        },
    },
    {
        id: 'crimson',
        label: 'Crimson',
        vars: {
            '--accent': '#e85a6e',
            '--accent-bright': '#ff7e90',
            '--accent-dim': '#a12d3e',
            '--border-bright': '#4f2a31',
            '--glow': '0 0 8px #e85a6eaa',
            '--glow-strong': '0 0 20px #e85a6ecc, 0 0 40px #e85a6e44',
        },
    },
    {
        id: 'matrix',
        label: 'Matrix',
        vars: {
            '--accent': '#4ce88a',
            '--accent-bright': '#7effb0',
            '--accent-dim': '#2da15c',
            '--border-bright': '#2a4f3a',
            '--glow': '0 0 8px #4ce88aaa',
            '--glow-strong': '0 0 20px #4ce88acc, 0 0 40px #4ce88a44',
        },
    },
];
