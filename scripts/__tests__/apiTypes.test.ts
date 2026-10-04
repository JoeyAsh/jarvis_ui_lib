import { describe, expect, it } from 'vitest';
import { createTypeExtractor, referencedTypes, typeNames } from '../apiTypes';

const types = createTypeExtractor();

describe('typeNames', () => {
    it('finds the type names in a type expression', () => {
        expect(typeNames('TableColumn<T>[] | Partial<Record<AppOrbState, string>>')).toEqual([
            'TableColumn',
            'T',
            'Partial',
            'Record',
            'AppOrbState',
        ]);
    });
});

describe('createTypeExtractor', () => {
    it('lists the fields of an interface with JSDoc and defaults', () => {
        const tab = types.get('TabItem');
        expect(tab?.definition).toBeNull();
        expect(tab?.fields.map((f) => f.name)).toEqual(['content', 'label', 'value', 'disabled']);
        expect(tab?.fields.find((f) => f.name === 'disabled')).toMatchObject({
            type: 'boolean',
            required: false,
            default: 'false',
        });
        expect(tab?.fields.every((f) => f.description !== '')).toBe(true);
    });

    it('keeps type parameters and gives unions their definition', () => {
        expect(types.get('TableColumn')?.name).toBe('TableColumn<T>');
        expect(types.get('TableAlign')?.definition).toBe("'left' | 'center' | 'right'");
    });

    it('drops member comments from union definitions', () => {
        expect(types.get('AppOrbState')?.definition).toBe("OrbState | 'working'");
    });

    it('ignores React, DOM and non-exported types', () => {
        expect(types.get('ReactNode')).toBeUndefined();
        expect(types.get('HTMLDivElement')).toBeUndefined();
        expect(types.get('Partial')).toBeUndefined();
    });
});

describe('referencedTypes', () => {
    it('follows field types transitively, once each', () => {
        const names = referencedTypes(types, ['NavListGroup[]', 'NavListItem']).map((t) => t.name);
        expect(names).toEqual(['NavListGroup', 'NavListItem']);
    });

    it('follows aliases through their definition', () => {
        const names = referencedTypes(types, ['Partial<Record<AppOrbState, string>>']).map(
            (t) => t.name,
        );
        expect(names).toEqual(['AppOrbState', 'OrbState']);
    });
});
