import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UpdateBookingFormRequest } from '#api/bookingForms/updateBookingForm';
import type { UpdateBookingFormStylesRequest } from '#api/bookingForms/bookingFormStyles/updateBookingFormStyles';
import type { UpdateBookingFormMetaRequest } from '#api/bookingForms/bookingFormMeta/updateBookingFormMeta';

import {
    DEFAULT_CONFIGURATOR_TAB,
    type ConfiguratorTabValue,
} from '#pages/App/BookingForms/BookingFormConfigurator/configuratorTabs';
import type { SyncBookingFormFieldRequest } from '#api/bookingForms/bookingFormFields/syncBookingFormField';

interface BookingFormConfiguratorForm {
    bookingForm: UpdateBookingFormRequest | null;
    bookingFormStyles: UpdateBookingFormStylesRequest | null;
    bookingFormMeta: UpdateBookingFormMetaRequest | null;
    bookingFormFields: SyncBookingFormFieldRequest | null;
}

interface BookingFormConfiguratorState extends BookingFormConfiguratorForm {
    activeTab: ConfiguratorTabValue;
    isCollapsed: boolean;
    setActiveTab: (tab: ConfiguratorTabValue) => void;
    setIsCollapsed: (collapsed: boolean) => void;
    setBookingForm: (bookingForm: UpdateBookingFormRequest) => void;
    setBookingFormStyles: (bookingFormStyles: UpdateBookingFormStylesRequest) => void;
    setBookingFormMeta: (bookingFormMeta: UpdateBookingFormMetaRequest) => void;
    setBookingFormFields: (bookingFormFields: SyncBookingFormFieldRequest) => void;
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
            setActiveTab: (activeTab) => set({ activeTab }, false, 'setActiveTab'),
            setIsCollapsed: (isCollapsed) => set({ isCollapsed }, false, 'setIsCollapsed'),
            setBookingForm: (bookingForm) => set({ bookingForm }, false, 'setBookingForm'),
            setBookingFormStyles: (bookingFormStyles) =>
                set({ bookingFormStyles }, false, 'setBookingFormStyles'),
            setBookingFormMeta: (bookingFormMeta) =>
                set({ bookingFormMeta }, false, 'setBookingFormMeta'),
            setBookingFormFields: (bookingFormFields) =>
                set({ bookingFormFields }, false, 'setBookingFormFields'),
        }),
        { name: 'BookingFormConfiguratorStore' },
    ),
);
