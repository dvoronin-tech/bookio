import { createContext, useContext } from 'react';
import { createStepsStore, type StepsStore, type StepsState } from './StepsStore';
import { useStore } from 'zustand';

const StepsContext = createContext<StepsStore | null>(null);

export const StepsProvider = ({ children }: { children: React.ReactNode }) => {
    const store = createStepsStore();
    return <StepsContext.Provider value={store}>{children}</StepsContext.Provider>;
};

export const useSteps = <T,>(selector: (store: StepsState) => T) => {
    const store = useContext(StepsContext);
    if (!store) {
        throw new Error('StepsContext not found');
    }
    return useStore(store, selector);
};
