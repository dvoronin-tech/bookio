import { createStore } from 'zustand/vanilla';

export interface AnimationState {
    animatedElements: Set<string>;
    isIdle: boolean;

    regAnimation: (id: string) => void;
}

export const createAnimationStore = () =>
    createStore<AnimationState>()((set) => ({
        animatedElements: new Set(),
        isIdle: true,
        regAnimation: (id) => {
            set((prevState) => {
                if (prevState.animatedElements.has(id)) {
                    throw new Error(`Animation with id ${id} already registered`);
                }

                const animatedElements = new Set(prevState.animatedElements);
                animatedElements.add(id);

                return { animatedElements, isIdle: animatedElements.size === 0 };
            });
        },
    }));

export type AnimationStore = ReturnType<typeof createAnimationStore>;
