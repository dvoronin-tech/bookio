import type {
    BookingFormField,
    BookingFormType,
} from '#api/bookingForms/getBookingForm';
import type { SyncBookingFormFieldRequest } from '#api/bookingForms/bookingFormFields/syncBookingFormField';
import type { UpdateBookingFormRequest } from '#api/bookingForms/updateBookingForm';
import type { UpdateBookingFormMetaRequest } from '#api/bookingForms/bookingFormMeta/updateBookingFormMeta';
import type { UpdateBookingFormStylesRequest } from '#api/bookingForms/bookingFormStyles/updateBookingFormStyles';
import { DEFAULT_DARK_BOOKING_FORM_STYLES } from '#utils/defaultBookingFormStyles';
import type { BookingFormConfiguratorDefaults } from '#store/useBookingFormConfiguratorStore';
import type { BookingFormData } from '@bookio/booking-form-ui';

export type SyncBookingFormFieldItem =
    SyncBookingFormFieldRequest['fields'][number];

/** Maps a flat field list (DB rows) to the sync-fields API payload. */
export function toSyncBookingFormFieldsRequest(
    bookingFormId: string,
    fields: SyncBookingFormFieldRequest,
): SyncBookingFormFieldRequest;
export function toSyncBookingFormFieldsRequest(
    bookingFormId: string,
    fields: BookingFormField[],
): SyncBookingFormFieldRequest;
export function toSyncBookingFormFieldsRequest(
    bookingFormId: string,
    fields: BookingFormField[] | SyncBookingFormFieldRequest,
): SyncBookingFormFieldRequest {
    const baseObj = { bookingFormId };

    if (!Array.isArray(fields)) {
        return {
            ...baseObj,
            fields: fields.fields,
        };
    }

    return {
        bookingFormId,
        fields: fields.map(
            ({ bookingFormId, ...field }) => field,
        ) as SyncBookingFormFieldRequest['fields'],
    };
}

export type ConfiguratorBookingFormData = {
    [K in keyof UpdateBookingFormRequest]-?: UpdateBookingFormRequest[K];
};

export const toComparableBookingForm = (
    data: Partial<UpdateBookingFormRequest>,
): ConfiguratorBookingFormData => ({
    id: data.id ?? '',
    name: data.name?.trim() ?? '',
    description: data.description?.trim() || null,
    slug: data.slug?.trim() ?? '',
    isActive: data.isActive ?? false,
    markRequiredFields: data.markRequiredFields ?? true,
});

export const toComparableBookingFormStyles = (
    data?: Partial<UpdateBookingFormStylesRequest> | null,
): UpdateBookingFormStylesRequest => {
    const fallback = DEFAULT_DARK_BOOKING_FORM_STYLES;
    return {
        bookingFormId: data?.bookingFormId ?? '',
        primary: data?.primary ?? fallback.primary,
        bgMain: data?.bgMain ?? fallback.bgMain,
        bgSecondary: data?.bgSecondary ?? fallback.bgSecondary,
        borderColor: data?.borderColor ?? fallback.borderColor,
        textMain: data?.textMain ?? fallback.textMain,
        textSecondary: data?.textSecondary ?? fallback.textSecondary,
    };
};

export const toComparableBookingFormMeta = (
    data?: Partial<UpdateBookingFormMetaRequest> | null,
): UpdateBookingFormMetaRequest => ({
    bookingFormId: data?.bookingFormId ?? '',
    title: data?.title?.trim() ?? '',
    description: data?.description?.trim() ?? '',
    additionalMetaData: data?.additionalMetaData ?? {},
});

export const toDefaultBookingFormData = (
    bookingForm: BookingFormType,
): BookingFormConfiguratorDefaults => ({
    bookingForm: toComparableBookingForm(bookingForm),
    bookingFormFields: toSyncBookingFormFieldsRequest(
        bookingForm.id,
        bookingForm.fields,
    ),
    bookingFormStyles: toComparableBookingFormStyles(bookingForm.styles),
    bookingFormMeta: toComparableBookingFormMeta(bookingForm.metaData),
});

export const toBookingFormSettings = (
    data: UpdateBookingFormRequest,
): Omit<BookingFormData, 'fields'> => ({
    name: data.name ?? '',
    description: data.description ?? '',
});
