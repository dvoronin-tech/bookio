import { createContext, useContext, type FC, type ReactNode } from 'react';

interface ExternalReorderContextType {
    onDragStart: (fieldId: string, e: React.PointerEvent<HTMLDivElement>) => void;
}

const ExternalReorderContext = createContext<ExternalReorderContextType | null>(null);

export const useReorderContext = () => {
    const context = useContext(ExternalReorderContext);
    if (!context) {
        throw new Error('useReorderContext must be used inside a Reorder component');
    }
    return context;
};

export const ExternalReorderProvider: FC<ExternalReorderContextType & { children: ReactNode }> = ({
    children,
    ...props
}) => {
    return <ExternalReorderContext.Provider value={props}>{children}</ExternalReorderContext.Provider>;
};
