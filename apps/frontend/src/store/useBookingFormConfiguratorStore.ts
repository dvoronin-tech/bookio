import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UpdateBookingFormRequest } from '#api/bookingForms/updateBookingForm';
import type { UpdateBookingFormStylesRequest } from '#api/bookingForms/bookingFormStyles/updateBookingFormStyles';
import type { UpdateBookingFormMetaRequest } from '#api/bookingForms/bookingFormMeta/updateBookingFormMeta';

import {
    DEFAULT_CONFIGURATOR_TAB,
    type ConfiguratorTabValue,
} from '#pages/App/BookingForms/BookingFormConfigurator/configuratorTabs';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';

interface BookingFormConfiguratorForm {
    bookingForm: UpdateBookingFormRequest | null;
    bookingFormStyles: UpdateBookingFormStylesRequest | null;
    bookingFormMeta: UpdateBookingFormMetaRequest | null;
    bookingFormFields: EntireBookingFormField[] | null;
    createBookingFormField: Partial<EntireBookingFormField> | null;
}

interface BookingFormConfiguratorState extends BookingFormConfiguratorForm {
    activeTab: ConfiguratorTabValue;
    isCollapsed: boolean;
    setActiveTab: (tab: ConfiguratorTabValue) => void;
    setIsCollapsed: (collapsed: boolean) => void;
    setBookingForm: (bookingForm: UpdateBookingFormRequest) => void;
    setBookingFormStyles: (bookingFormStyles: UpdateBookingFormStylesRequest) => void;
    setBookingFormMeta: (bookingFormMeta: UpdateBookingFormMetaRequest) => void;
    setBookingFormFields: (bookingFormFields: EntireBookingFormField[]) => void;
    setCreateBookingFormField: (createBookingFormField: Partial<EntireBookingFormField> | null) => void;
}

export const useBookingFormConfiguratorStore = create<BookingFormConfiguratorState>()(
    devtools(
        (set) => ({
            activeTab: DEFAULT_CONFIGURATOR_TAB,
            isCollapsed: false,
            bookingForm: null,
            bookingFormStyles: null,
            bookingFormMeta: null,
            bookingFormFields: null,
            createBookingFormField: null,
            setActiveTab: (activeTab) => set({ activeTab }, false, 'setActiveTab'),
            setIsCollapsed: (isCollapsed) => set({ isCollapsed }, false, 'setIsCollapsed'),
            setBookingForm: (bookingForm) => set({ bookingForm }, false, 'setBookingForm'),
            setBookingFormStyles: (bookingFormStyles) =>
                set({ bookingFormStyles }, false, 'setBookingFormStyles'),
            setBookingFormMeta: (bookingFormMeta) =>
                set({ bookingFormMeta }, false, 'setBookingFormMeta'),
            setBookingFormFields: (bookingFormFields) =>
                set({ bookingFormFields }, false, 'setBookingFormFields'),
            setCreateBookingFormField: (createBookingFormField) =>
                set({ createBookingFormField }, false, 'setCreateBookingFormField'),
        }),
        { name: 'BookingFormConfiguratorStore' },
    ),
);
