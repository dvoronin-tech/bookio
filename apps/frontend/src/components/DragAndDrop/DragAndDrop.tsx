import type { FC, ReactElement, HTMLAttributes, RefObject, ReactNode, SetStateAction, Dispatch } from 'react';
import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';

type Axis = 'x' | 'y';
type ItemId = string | number;

interface ReorderProps extends HTMLAttributes<HTMLDivElement> {
    axis: Axis;
    children: ReactElement<ItemProps>[];
}

interface ReorderContextType {
    axis: Axis;
    containerRef: RefObject<HTMLDivElement | null>;
    itemIds: ItemId[];
    setItemIds: Dispatch<SetStateAction<ItemId[]>>;
}

const ReorderContext = createContext<ReorderContextType | null>(null);

export const useReorderContext = () => {
    const context = useContext(ReorderContext);
    if (!context) {
        throw new Error('useReorderContext must be used within a Reorder component');
    }
    return context;
};

const ContextProvider: FC<ReorderContextType & { children: ReactNode }> = ({
    children,
    ...props
}) => {
    return <ReorderContext.Provider value={props}>{children}</ReorderContext.Provider>;
};

const Reorder: FC<ReorderProps> = ({ axis, children, ...props }) => {
    const [itemIds, setItemIds] = useState<ItemId[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <ContextProvider
            axis={axis}
            containerRef={containerRef}
            itemIds={itemIds}
            setItemIds={setItemIds}
        >
            <div ref={containerRef} {...props}>
                {children}
            </div>
        </ContextProvider>
    );
};

interface ItemProps {
    id: ItemId;
    children: React.ReactNode;
}

export const Item: FC<ItemProps> = ({ children, id }) => {
    const { setItemIds } = useReorderContext();

    useLayoutEffect(() => {
        setItemIds((prev) => [...prev, id]);
    }, [id, setItemIds]);

    return <div>{children}</div>;
};
