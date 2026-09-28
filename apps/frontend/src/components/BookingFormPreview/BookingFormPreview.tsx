import { type CSSProperties, type FC, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { configuratorRouteApi } from '#lib/routeApis';
import { useShallow } from 'zustand/shallow';
import { BookingForm } from '@bookio/booking-form-ui';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import {
    type BookingFormStyles,
    DEFAULT_DARK_BOOKING_FORM_STYLES,
} from '#utils/defaultBookingFormStyles';
import scssStyles from './BookingFormPreview.module.scss';
import { toBookingFormSettings } from '#utils/dataPreparers/bookingFormPreparers.ts';

const toPreviewCssVars = (colors: BookingFormStyles): CSSProperties =>
    ({
        '--color-primary': colors.primary,
        '--color-bg-main': colors.bgMain,
        '--color-bg-ui': colors.bgSecondary,
        '--color-border': colors.borderColor,
        '--color-text-main': colors.textMain,
        '--color-text-secondary': colors.textSecondary,
    }) as CSSProperties;

export const BookingFormPreview: FC = () => {
    const { bookingFormId } = configuratorRouteApi.useParams();
    const { bookingForm, bookingFormFields, bookingFormStyles } =
        useBookingFormConfiguratorStore(
            useShallow(
                ({ bookingForm, bookingFormFields, bookingFormStyles }) => ({
                    bookingForm,
                    bookingFormFields,
                    bookingFormStyles,
                }),
            ),
        );

    const data = useMemo(() => {
        if (bookingForm?.id === bookingFormId && bookingForm) {
            return {
                settings: toBookingFormSettings(bookingForm),
                fields: bookingFormFields?.fields,
                styles: bookingFormStyles,
            };
        }

        return null;
    }, [
        bookingForm,
        bookingFormFields?.fields,
        bookingFormId,
        bookingFormStyles,
    ]);

    const handlePreviewSuccess = useCallback(() => {
        toast.success('Form submitted successfully');
    }, []);

    if (!data?.settings || !data?.fields || !data?.styles) {
        return null;
    }

    const { settings, fields, styles } = data;

    const previewColors: BookingFormStyles = {
        primary: styles.primary ?? DEFAULT_DARK_BOOKING_FORM_STYLES.primary,
        bgMain: styles.bgMain ?? DEFAULT_DARK_BOOKING_FORM_STYLES.bgMain,
        bgSecondary:
            styles.bgSecondary ?? DEFAULT_DARK_BOOKING_FORM_STYLES.bgSecondary,
        borderColor:
            styles.borderColor ?? DEFAULT_DARK_BOOKING_FORM_STYLES.borderColor,
        textMain: styles.textMain ?? DEFAULT_DARK_BOOKING_FORM_STYLES.textMain,
        textSecondary:
            styles.textSecondary ??
            DEFAULT_DARK_BOOKING_FORM_STYLES.textSecondary,
    };

    return (
        <div
            className={scssStyles.preview}
            style={toPreviewCssVars(previewColors)}
        >
            <BookingForm
                isPreview
                bookingFormData={{
                    ...settings,
                    fields,
                }}
                onSuccess={handlePreviewSuccess}
            />
        </div>
    );
};
