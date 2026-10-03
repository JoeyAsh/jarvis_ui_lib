/**
 * Animation delay (in seconds, <= 0) of the bar at `index`. Reproduces the original 12-bar
 * stagger (-0.6s ... 0s at bar 7, then -0.15s ... -0.55s) and keeps stepping 0.1s per bar
 * beyond that, so meters of any length stagger. Negative delays larger than the 0.9s cycle
 * simply wrap around.
 */
export function meterBarDelay(index: number): number {
    const raw = index <= 6 ? -(0.6 - index * 0.1) : -(0.15 + (index - 7) * 0.1);
    const rounded = Math.round(raw * 100) / 100;
    return rounded === 0 ? 0 : rounded;
}
