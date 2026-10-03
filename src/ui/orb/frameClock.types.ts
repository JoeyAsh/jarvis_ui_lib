export interface FrameClock {
    /** Seconds since the previous `delta()` call (0 on the first call). */
    delta(): number;
    /** Seconds since the clock was created. */
    elapsed(): number;
}
