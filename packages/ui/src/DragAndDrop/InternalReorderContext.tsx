import type { FC, ReactNode, RefObject } from 'react';
import { createContext, useContext } from 'react';

export type Axis = 'x' | 'y';
export type ItemId = string | number;
export type ItemsMap = Map<ItemId, RefObject<HTMLElement | null>>;

export interface InternalReorderContextType {
    axis: Axis;
    containerRef: RefObject<HTMLDivElement | null>;
    registerItem: (id: ItemId, ref: RefObject<HTMLElement | null>) => void;
    unregisterItem: (id: ItemId) => void;
}

const InternalReorderContext = createContext<InternalReorderContextType | null>(null);

export const useInternalReorderContext = () => {
    const context = useContext(InternalReorderContext);
    if (!context) {
        throw new Error('useInternalReorderContext must be used within a Reorder component');
    }
    return context;
};

export const InternalReorderProvider: FC<InternalReorderContextType & { children: ReactNode }> = ({
    children,
    ...props
}) => {
    return <InternalReorderContext.Provider value={props}>{children}</InternalReorderContext.Provider>;
};
