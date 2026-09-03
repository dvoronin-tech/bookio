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

export interface BookingFormConfiguratorDefaults {
    bookingForm: UpdateBookingFormRequest;
    bookingFormStyles: UpdateBookingFormStylesRequest;
    bookingFormMeta: UpdateBookingFormMetaRequest;
    bookingFormFields: SyncBookingFormFieldRequest;
}

interface BookingFormConfiguratorForm {
    bookingForm: UpdateBookingFormRequest | null;
    bookingFormStyles: UpdateBookingFormStylesRequest | null;
    bookingFormMeta: UpdateBookingFormMetaRequest | null;
    bookingFormFields: SyncBookingFormFieldRequest | null;
}

const initialFormState: BookingFormConfiguratorForm = {
    bookingForm: null,
    bookingFormStyles: null,
    bookingFormMeta: null,
    bookingFormFields: null,
};

interface BookingFormConfiguratorState extends BookingFormConfiguratorForm {
    activeTab: ConfiguratorTabValue;
    isCollapsed: boolean;
    setActiveTab: (tab: ConfiguratorTabValue) => void;
    setIsCollapsed: (collapsed: boolean) => void;
    setDefaultBookingFormData: (data: BookingFormConfiguratorDefaults) => void;
    setBookingForm: (bookingForm: UpdateBookingFormRequest) => void;
    setBookingFormStyles: (bookingFormStyles: UpdateBookingFormStylesRequest) => void;
    setBookingFormMeta: (bookingFormMeta: UpdateBookingFormMetaRequest) => void;
    setBookingFormFields: (bookingFormFields: SyncBookingFormFieldRequest) => void;
    deleteBookingFormField: (fieldId: string) => void;
    reset: () => void;
}

export const useBookingFormConfiguratorStore = create<BookingFormConfiguratorState>()(
    devtools(
        (set) => ({
            activeTab: DEFAULT_CONFIGURATOR_TAB,
            isCollapsed: false,
            ...initialFormState,
            setActiveTab: (activeTab) => set({ activeTab }, false, 'setActiveTab'),
            setIsCollapsed: (isCollapsed) => set({ isCollapsed }, false, 'setIsCollapsed'),
            setDefaultBookingFormData: (data) =>
                set(
                    (state) => {
                        if (state.bookingForm?.bookingFormId === data.bookingForm.bookingFormId) {
                            return {};
                        }

                        return data;
                    },
                    false,
                    'setDefaultBookingFormData',
                ),
            setBookingForm: (bookingForm) => set({ bookingForm }, false, 'setBookingForm'),
            setBookingFormStyles: (bookingFormStyles) =>
                set({ bookingFormStyles }, false, 'setBookingFormStyles'),
            setBookingFormMeta: (bookingFormMeta) =>
                set({ bookingFormMeta }, false, 'setBookingFormMeta'),
            setBookingFormFields: (bookingFormFields) =>
                set({ bookingFormFields }, false, 'setBookingFormFields'),
            deleteBookingFormField: (fieldId) =>
                set(
                    (state) => {
                        if (!state.bookingFormFields) return {};

                        return {
                            bookingFormFields: {
                                ...state.bookingFormFields,
                                fields: state.bookingFormFields.fields.filter(
                                    (field) => field.id !== fieldId && field.parentId !== fieldId,
                                ),
                            },
                        };
                    },
                    false,
                    'deleteBookingFormField',
                ),
            reset: () =>
                set(
                    {
                        activeTab: DEFAULT_CONFIGURATOR_TAB,
                        isCollapsed: false,
                        ...initialFormState,
                    },
                    false,
                    'reset',
                ),
        }),
        { name: 'BookingFormConfiguratorStore' },
    ),
);
