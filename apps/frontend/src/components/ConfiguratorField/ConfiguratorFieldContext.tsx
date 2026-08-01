import { createContext, useContext } from 'react';
import type { SyncBookingFormFieldItem } from '#utils/dataPreparers/bookingFormPreparers';

export interface ConfiguratorFieldContextValue {
    onEdit?: (fieldId: string) => void;
    onDelete?: (fieldId: string) => void;
    fields?: SyncBookingFormFieldItem[];
}

export const ConfiguratorFieldContext = createContext<ConfiguratorFieldContextValue | null>(null);

export const useConfiguratorFieldContext = (): ConfiguratorFieldContextValue => {
    return useContext(ConfiguratorFieldContext) ?? {};
};
