import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';

export type Steps = 'Greeting' | 'BookingForm';

export interface StepsState {
    step: Steps;

    setStep: (step: Steps) => void;
}

export const createStepsStore = () =>
    createStore<StepsState>()(
        devtools(
            (set) => ({
                step: 'Greeting',
                setStep: (step) => {
                    set({ step }, false, 'setStep');
                },
            }),
            { name: 'StepsStore' },
        ),
    );

export type StepsStore = ReturnType<typeof createStepsStore>;
