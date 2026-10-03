import type { AppOrbState } from '@common/types';
import type { SimOption } from './StateSimulator.types';

/** Props of the internal state button of `StateSimulator`. */
export interface SimButtonProps {
    /** The state and label of this button. */
    option: SimOption;
    /** Whether this button's state is the current one; also sets `aria-pressed`. */
    active: boolean;
    /** Called with `option.key` when the button is clicked. */
    onChange: (state: AppOrbState) => void;
}
