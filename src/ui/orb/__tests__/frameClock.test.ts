import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createFrameClock } from '../frameClock';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('createFrameClock', () => {
    it('reports delta and elapsed time in seconds', () => {
        const now = vi.spyOn(performance, 'now');
        now.mockReturnValue(1000);
        const clock = createFrameClock();

        now.mockReturnValue(1016);
        expect(clock.delta()).toBeCloseTo(0.016);
        now.mockReturnValue(1050);
        expect(clock.delta()).toBeCloseTo(0.034);
        expect(clock.elapsed()).toBeCloseTo(0.05);
    });
});

describe('orbEngine', () => {
    it('does not use the deprecated THREE.Clock', () => {
        const source = readFileSync(resolve(__dirname, '../orbEngine.ts'), 'utf-8');
        expect(source).not.toMatch(/new (THREE\.)?Clock\(/);
    });
});
