import type { Steps } from './StepsStore';

type StepsManager = Record<
    Steps,
    {
        prev: (() => Steps) | null;
        next: (() => Steps) | null;
    }
>;

export const stepsManager: StepsManager = {
    Greeting: {
        prev: null,
        next: () => 'BookingForm',
    },
    BookingForm: {
        prev: () => 'Greeting',
        next: null
    }
};
