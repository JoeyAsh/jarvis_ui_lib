import { describe, it, expect } from 'vitest';
import { validateUiSpec } from '../validate';
import { evaluateCondition, interpolate, isSafeUrl, resolveValue } from '../resolve';

const VALID = {
    id: 'volume',
    title: 'Volume',
    size: { w: 360, h: 240 },
    state: { volume: 40, muted: false },
    root: {
        type: 'Stack',
        props: { gap: 'md' },
        children: [
            {
                type: 'Slider',
                props: { label: 'Volume', value: { $bind: 'volume' }, formatValue: '{value} %' },
            },
            { type: 'Switch', props: { label: 'Mute', checked: { $bind: 'muted' } } },
            {
                type: 'Mono',
                children: 'Volume {{volume}}',
                visibleIf: { state: 'muted', eq: false },
            },
            {
                type: 'Button',
                children: 'Apply',
                on: { onClick: [{ emit: 'apply', payload: { $state: 'volume' } }] },
            },
            { type: 'IconButton', props: { icon: 'Play', label: 'Play' } },
            { type: 'Link', props: { href: 'https://example.com' }, children: 'Docs' },
        ],
    },
};

function errorsOf(spec: unknown): string[] {
    return validateUiSpec(spec).errors.map((e) => `${e.path}: ${e.message}`);
}

describe('validateUiSpec', () => {
    it('accepts a valid spec', () => {
        expect(validateUiSpec(VALID)).toEqual({ ok: true, errors: [] });
    });

    it('rejects non-objects and missing ids', () => {
        expect(validateUiSpec(null).ok).toBe(false);
        expect(errorsOf({ root: { type: 'Stack' } })).toContain(
            '$.id: expected a non-empty string',
        );
    });

    it('rejects unknown components and props', () => {
        const errors = errorsOf({
            id: 'x',
            root: {
                type: 'Stack',
                children: [
                    { type: 'ThreeOrb' },
                    { type: 'Button', props: { className: 'evil', onClick: 'x' } },
                    { type: 'CodeBlock', props: { code: 'a', html: '<img onerror=alert(1)>' } },
                ],
            },
        });
        expect(errors).toContain('$.root.children[0].type: unknown component "ThreeOrb"');
        expect(errors).toContain(
            '$.root.children[1].props.className: "Button" has no prop "className"',
        );
        expect(errors).toContain('$.root.children[2].props.html: "CodeBlock" has no prop "html"');
    });

    it('checks value kinds, icons and URLs', () => {
        const errors = errorsOf({
            id: 'x',
            root: {
                type: 'Stack',
                children: [
                    { type: 'Slider', props: { max: 'ten' } },
                    { type: 'IconButton', props: { icon: 'NoSuchIcon', label: 'x' } },
                    { type: 'Link', props: { href: 'javascript:alert(1)' }, children: 'x' },
                    { type: 'WebFrame', props: { url: 'file:///etc/passwd' } },
                ],
            },
        });
        expect(errors).toContain('$.root.children[0].props.max: expected a number');
        expect(
            errors.some((e) => e.startsWith('$.root.children[1].props.icon: unknown icon')),
        ).toBe(true);
        expect(errors).toContain(
            '$.root.children[2].props.href: expected an http(s) URL or a relative path',
        );
        expect(errors).toContain(
            '$.root.children[3].props.url: expected an http(s) URL or a relative path',
        );
    });

    it('checks bindings against declared state and bindable props', () => {
        const errors = errorsOf({
            id: 'x',
            state: { a: 1 },
            root: {
                type: 'Stack',
                children: [
                    { type: 'Slider', props: { value: { $bind: 'missing' } } },
                    { type: 'Slider', props: { max: { $bind: 'a' } } },
                ],
            },
        });
        expect(errors).toContain(
            '$.root.children[0].props.value: state "missing" is not declared in "state"',
        );
        expect(errors).toContain('$.root.children[1].props.max: "max" cannot be bound');
    });

    it('checks children, events, actions and conditions', () => {
        const errors = errorsOf({
            id: 'x',
            root: {
                type: 'Stack',
                children: [
                    { type: 'Slider', children: 'text' },
                    { type: 'Button', children: [{ type: 'Pill' }] },
                    { type: 'Button', on: { onHover: { emit: 'x' } } },
                    { type: 'Button', on: { onClick: [{ go: 'x' }] } },
                    { type: 'Pill', visibleIf: { when: 'x' } },
                ],
            },
        });
        expect(errors).toContain('$.root.children[0].children: "Slider" takes no children');
        expect(errors).toContain('$.root.children[1].children: expected text');
        expect(errors).toContain('$.root.children[2].on.onHover: "Button" has no event "onHover"');
        expect(errors).toContain(
            '$.root.children[3].on.onClick[0]: an action needs "set", "toggle" or "emit" with a name',
        );
        expect(errors.some((e) => e.startsWith('$.root.children[4].visibleIf'))).toBe(true);
    });

    it('limits nesting depth', () => {
        let node: Record<string, unknown> = { type: 'Pill', children: 'leaf' };
        for (let i = 0; i < 30; i++) node = { type: 'Stack', children: [node] };
        expect(errorsOf({ id: 'x', root: node }).some((e) => e.includes('nesting deeper'))).toBe(
            true,
        );
    });
});

describe('resolve helpers', () => {
    it('fills templates and resolves state reads deeply', () => {
        const state = { volume: 40, name: 'JARVIS', list: [1, 2] };
        expect(interpolate('Vol {{volume}} · {{ name }} · {{missing}}', state)).toBe(
            'Vol 40 · JARVIS · ',
        );
        expect(resolveValue({ $state: 'volume' }, state)).toBe(40);
        expect(resolveValue([{ $state: 'name' }, 'x'], state)).toEqual(['JARVIS', 'x']);
        expect(resolveValue({ a: { $state: 'list' } }, state)).toEqual({ a: [1, 2] });
    });

    it('evaluates conditions', () => {
        const state = { on: true, mode: 'auto', empty: [] };
        expect(evaluateCondition({ state: 'on' }, state)).toBe(true);
        expect(evaluateCondition({ state: 'empty' }, state)).toBe(false);
        expect(evaluateCondition({ state: 'mode', eq: 'auto' }, state)).toBe(true);
        expect(evaluateCondition({ state: 'mode', ne: 'auto' }, state)).toBe(false);
    });

    it('allows only safe URLs', () => {
        expect(isSafeUrl('https://example.com')).toBe(true);
        expect(isSafeUrl('/docs/page')).toBe(true);
        expect(isSafeUrl('javascript:alert(1)')).toBe(false);
        expect(isSafeUrl('data:text/html,x')).toBe(false);
        expect(isSafeUrl('//evil.example')).toBe(false);
    });

    it('rejects URL tricks that browsers normalise into another scheme or host', () => {
        expect(isSafeUrl(' javascript:alert(1)')).toBe(false);
        expect(isSafeUrl('java\tscript:alert(1)')).toBe(false);
        expect(isSafeUrl('java\nscript:alert(1)')).toBe(false);
        expect(isSafeUrl('\u0001javascript:alert(1)')).toBe(false);
        expect(isSafeUrl('JaVaScRiPt:alert(1)')).toBe(false);
        expect(isSafeUrl('\\\\evil.example')).toBe(false);
        expect(isSafeUrl('/\\evil.example')).toBe(false);
        expect(isSafeUrl('https://example.com ')).toBe(false);
        expect(isSafeUrl('')).toBe(false);
        expect(isSafeUrl('page.html')).toBe(true);
        expect(isSafeUrl('?q=1#top')).toBe(true);
        expect(isSafeUrl('HTTPS://EXAMPLE.COM/x')).toBe(true);
    });
});
