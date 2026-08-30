import { createContext, useContext } from 'react';
import { createAnimationStore, type AnimationStore, type AnimationState } from './AnimationStore';
import { useStore } from 'zustand';

const AnimationContext = createContext<AnimationStore | null>(null);

export const AnimationProvider = ({ children }: { children: React.ReactNode }) => {
    const store = createAnimationStore();
    return <AnimationContext.Provider value={store}>{children}</AnimationContext.Provider>;
};

export const useAnimation = <T,>(selector: (store: AnimationState) => T) => {
    const store = useContext(AnimationContext);
    if (!store) {
        throw new Error('AnimationContext not found');
    }
    return useStore(store, selector);
};
