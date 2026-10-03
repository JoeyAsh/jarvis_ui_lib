import type { AppOrbState, OrbState } from '@common/types';
import type { OrbVisualState } from '../variants';

/** The original engine has no `working` state; it shows `thinking` instead. */
export function toConstellationState(state: AppOrbState): OrbState {
    return state === 'working' ? 'thinking' : state;
}

/** Variant designs know idle / listening / working / speaking. */
export function toVariantState(state: AppOrbState): OrbVisualState {
    switch (state) {
        case 'thinking':
        case 'working':
            return 'working';
        case 'follow_up':
        case 'listening':
            return 'listening';
        case 'speaking':
            return 'speaking';
        default:
            return 'idle';
    }
}
