import { useNavigate, useParams } from 'react-router-dom';
import {
    useGetEntireBookingFormById,
    type EntireBookingFormType,
} from '#api/bookingForms/getEntireBookingFormById';
import { useGetOrganization } from '#api/organizations/getOrganizationData';
import { Spinner } from '#components/Spinner/Spinner';
import { StyleColorField } from '#components/BookingFormStyles/StyleColorField/StyleColorField';
import { StyleColorGroup } from '#components/BookingFormStyles/StyleColorGroup/StyleColorGroup';
import { ThemeCard } from '#components/BookingFormStyles/ThemeCard/ThemeCard';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { DEFAULT_BOOKING_FORM_STYLES } from '#utils/defaultBookingFormStyles';
import { Button } from '@bookio/ui';
import { useEffect, useMemo, type FC } from 'react';
import { useShallow } from 'zustand/shallow';

import styles from './StylesTab.module.scss';

const COLOR_SECTIONS = [
    {
        heading: 'Accent',
        fields: [{ key: 'primary', label: 'Primary' }],
    },
    {
        heading: 'Surfaces',
        fields: [
            { key: 'bgMain', label: 'Background' },
            { key: 'bgSecondary', label: 'Surface' },
            { key: 'borderColor', label: 'Border' },
        ],
    },
    {
        heading: 'Text',
        fields: [
            { key: 'textMain', label: 'Primary text' },
            { key: 'textSecondary', label: 'Secondary text' },
        ],
    },
] as const;

interface StylesTabFormProps {
    bookingFormId: string;
    formStyles: EntireBookingFormType['styles'];
}

const StylesTabForm: FC<StylesTabFormProps> = ({ bookingFormId, formStyles }) => {
    const { bookingFormStyles, setBookingFormStyles } = useBookingFormConfiguratorStore(
        useShallow(({ bookingFormStyles, setBookingFormStyles }) => ({
            bookingFormStyles,
            setBookingFormStyles,
        })),
    );

    useEffect(() => {
        if (bookingFormStyles?.bookingFormId === bookingFormId) return;

        const source = formStyles ?? DEFAULT_BOOKING_FORM_STYLES;

        setBookingFormStyles({
            bookingFormId,
            primary: source.primary,
            bgMain: source.bgMain,
            bgSecondary: source.bgSecondary,
            borderColor: source.borderColor,
            textMain: source.textMain,
            textSecondary: source.textSecondary,
        });
    }, [bookingFormId, formStyles, bookingFormStyles, setBookingFormStyles]);

    const colors = useMemo(
        () =>
            bookingFormStyles?.bookingFormId === bookingFormId
                ? {
                      primary: bookingFormStyles.primary ?? DEFAULT_BOOKING_FORM_STYLES.primary,
                      bgMain: bookingFormStyles.bgMain ?? DEFAULT_BOOKING_FORM_STYLES.bgMain,
                      bgSecondary:
                          bookingFormStyles.bgSecondary ?? DEFAULT_BOOKING_FORM_STYLES.bgSecondary,
                      borderColor:
                          bookingFormStyles.borderColor ?? DEFAULT_BOOKING_FORM_STYLES.borderColor,
                      textMain: bookingFormStyles.textMain ?? DEFAULT_BOOKING_FORM_STYLES.textMain,
                      textSecondary:
                          bookingFormStyles.textSecondary ??
                          DEFAULT_BOOKING_FORM_STYLES.textSecondary,
                  }
                : { ...DEFAULT_BOOKING_FORM_STYLES },
        [bookingFormId, bookingFormStyles],
    );

    if (!bookingFormId) {
        return null;
    }

    return (
        <div className={styles.stylesTab}>
            <div className={styles.themesSection}>
                <span className={styles.themesLabel}>Theme</span>
                <div className={styles.themesRow}>
                    <ThemeCard name="Dark" variant="dark" selected />
                    <ThemeCard name="Light" variant="light" />
                </div>
            </div>

            <div className={styles.colorsSection}>
                <span className={styles.colorsLabel}>Colors</span>
                {COLOR_SECTIONS.map(({ heading, fields }) => (
                    <StyleColorGroup key={heading} heading={heading}>
                        {fields.map(({ key, label }) => {
                            const handleColorChange = (color: string) => {
                                setBookingFormStyles({
                                    bookingFormId,
                                    ...colors,
                                    [key]: color,
                                });
                            };

                            return (
                                <StyleColorField
                                    key={key}
                                    id={`styles-tab-${key}`}
                                    label={label}
                                    value={colors[key]}
                                    onChange={handleColorChange}
                                />
                            );
                        })}
                    </StyleColorGroup>
                ))}
            </div>
        </div>
    );
};

export const StylesTab = () => {
    const { bookingFormId, id } = useParams();
    const navigate = useNavigate();

    const {
        data: organization,
        isLoading: isOrganizationLoading,
        isError: isOrganizationError,
        error: organizationError,
        refetch: refetchOrganization,
    } = useGetOrganization(id);
    const {
        data: bookingForm,
        isLoading: isBookingFormLoading,
        isError: isBookingFormError,
        error: bookingFormError,
        refetch: refetchBookingForm,
    } = useGetEntireBookingFormById(bookingFormId);

    if (!id) {
        navigate('/organizations/list');
        return null;
    }

    if (!bookingFormId) {
        navigate(`/${id}/booking-forms`);
        return null;
    }

    if (isOrganizationLoading || isBookingFormLoading)
        return (
            <div className={styles.loadingContainer}>
                <Spinner />
            </div>
        );

    if (!organization || !bookingForm) {
        if (isOrganizationError || isBookingFormError) {
            console.error({ organizationError }, { bookingFormError });
            const refetchData = () => {
                if (isOrganizationError) {
                    void refetchOrganization();
                }
                if (isBookingFormError) {
                    void refetchBookingForm();
                }
            };

            return (
                <div className={styles.errorContainer}>
                    <h2>
                        {organizationError?.message ||
                            bookingFormError?.message ||
                            'An error occurred while fetching the data'}
                    </h2>
                    <Button variant="primary-outlined" onClick={refetchData}>
                        Retry
                    </Button>
                </div>
            );
        }
        return (
            <div className={styles.loadingContainer}>
                <Spinner />
            </div>
        );
    }

    return <StylesTabForm bookingFormId={bookingFormId} formStyles={bookingForm.styles} />;
};
