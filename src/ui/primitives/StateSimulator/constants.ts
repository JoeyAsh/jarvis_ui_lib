import type { SimOption } from './StateSimulator.types';

/** Buttons of the simulator, in display order. */
export const SIM_OPTIONS: SimOption[] = [
    { key: 'idle', label: 'IDLE' },
    { key: 'listening', label: 'LISTENING' },
    { key: 'thinking', label: 'THINKING' },
    { key: 'speaking', label: 'SPEAKING' },
    { key: 'follow_up', label: 'FOLLOW UP' },
    { key: 'working', label: 'WORKING' },
];
