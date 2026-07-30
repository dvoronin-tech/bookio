import { createContext, useContext } from 'react';
import type { UseDragAndDropReturn } from '#hooks/useDragAndDrop';
import type { SyncBookingFormFieldItem } from '#utils/dataPreparers/bookingFormPreparers';

export interface ConfiguratorFieldContextValue {
    draggingProps?: UseDragAndDropReturn;
    onEdit?: (fieldId: string) => void;
    onDelete?: (fieldId: string) => void;
    onDragStart?: (e: React.PointerEvent<HTMLDivElement>) => void;
    fields?: SyncBookingFormFieldItem[];
}

export const ConfiguratorFieldContext = createContext<ConfiguratorFieldContextValue | null>(null);

export const useConfiguratorFieldContext = (): ConfiguratorFieldContextValue => {
    return useContext(ConfiguratorFieldContext) ?? {};
};
