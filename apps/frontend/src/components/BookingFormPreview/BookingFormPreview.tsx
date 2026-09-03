import { type CSSProperties, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import { BookingForm } from '@bookio/booking-form-ui';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import {
    DEFAULT_DARK_BOOKING_FORM_STYLES,
    type BookingFormStyles,
} from '#utils/defaultBookingFormStyles';
import styles from './BookingFormPreview.module.scss';

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
    const { bookingFormId } = useParams<{ bookingFormId: string }>();
    const { bookingForm, bookingFormFields, bookingFormStyles } = useBookingFormConfiguratorStore(
        useShallow(({ bookingForm, bookingFormFields, bookingFormStyles }) => ({
            bookingForm,
            bookingFormFields,
            bookingFormStyles,
        })),
    );



    const draftForm = bookingForm?.bookingFormId === bookingFormId ? bookingForm : null;
    const draftFields =
        bookingFormFields?.bookingFormId === bookingFormId ? bookingFormFields?.fields : null;
    const draftStyles =
        bookingFormStyles?.bookingFormId === bookingFormId ? bookingFormStyles : null;

    if (!draftForm || !draftFields || !draftStyles) {
        return null;
    }

    const name = draftForm.name ?? '';
    const description = draftForm.description ?? null;

    const previewColors: BookingFormStyles = {
        primary: draftStyles.primary ?? DEFAULT_DARK_BOOKING_FORM_STYLES.primary,
        bgMain: draftStyles.bgMain ?? DEFAULT_DARK_BOOKING_FORM_STYLES.bgMain,
        bgSecondary: draftStyles.bgSecondary ?? DEFAULT_DARK_BOOKING_FORM_STYLES.bgSecondary,
        borderColor: draftStyles.borderColor ?? DEFAULT_DARK_BOOKING_FORM_STYLES.borderColor,
        textMain: draftStyles.textMain ?? DEFAULT_DARK_BOOKING_FORM_STYLES.textMain,
        textSecondary: draftStyles.textSecondary ?? DEFAULT_DARK_BOOKING_FORM_STYLES.textSecondary,
    };

    if (!name && draftFields.length === 0) {
        return <div className={styles.preview} />;
    }

    return (
        <div className={styles.preview} style={toPreviewCssVars(previewColors)}>
            <BookingForm bookingForm={{ name, description, fields: draftFields }} />
        </div>
    );
};
