import { type FC, memo, useCallback, useMemo } from 'react';

import { Button } from '@bookio/ui';
import { useShallow } from 'zustand/shallow';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import { useNavigate } from '@tanstack/react-router';
import { configuratorRouteApi } from '#lib/routeApis';
import { useGetBookingForm } from '#api/bookingForms/getBookingForm.ts';
import isEqual from 'fast-deep-equal';
import { useUpdateBookingForm } from '#api/bookingForms/updateBookingForm.ts';
import toast from 'react-hot-toast';
import { useSyncBookingFormField } from '#api/bookingForms/bookingFormFields/syncBookingFormField.ts';
import {
    toComparableBookingForm,
    toComparableBookingFormMeta,
    toComparableBookingFormStyles,
    toSyncBookingFormFieldsRequest,
} from '#utils/dataPreparers/bookingFormPreparers.ts';
import { useUpdateBookingFormStyles } from '#api/bookingForms/bookingFormStyles/updateBookingFormStyles.ts';
import { useUpdateBookingFormMeta } from '#api/bookingForms/bookingFormMeta/updateBookingFormMeta.ts';
import styles from './ConfiguratorLayout.module.scss';

export const ConfiguratorFooter: FC = memo(() => {
    const { bookingFormId, organizationId } = configuratorRouteApi.useParams();
    const { data: baseLine } = useGetBookingForm(bookingFormId);
    const {
        bookingForm,
        bookingFormFields,
        bookingFormStyles,
        bookingFormMeta,
    } = useBookingFormConfiguratorStore(
        useShallow(
            ({
                bookingForm,
                bookingFormFields,
                bookingFormStyles,
                bookingFormMeta,
            }) => ({
                bookingForm,
                bookingFormFields,
                bookingFormStyles,
                bookingFormMeta,
            }),
        ),
    );

    const navigate = useNavigate();

    const { mutateAsync: updateBookingForm, isPending: isUpdatePending } =
        useUpdateBookingForm(bookingFormId);
    const { mutateAsync: syncBookingFormField, isPending: isSyncPending } =
        useSyncBookingFormField(bookingFormId);
    const {
        mutateAsync: updateBookingFormStyles,
        isPending: isUpdateStylesPending,
    } = useUpdateBookingFormStyles(bookingFormId);
    const {
        mutateAsync: updateBookingFormMeta,
        isPending: isUpdateMetaPending,
    } = useUpdateBookingFormMeta(bookingFormId);

    const isSaving =
        isUpdatePending ||
        isSyncPending ||
        isUpdateStylesPending ||
        isUpdateMetaPending;

    const isDirtyBookingForm = useMemo(() => {
        if (!baseLine || !bookingForm) return false;

        const baseBookingFormData = toComparableBookingForm(baseLine);

        return !isEqual(
            baseBookingFormData,
            toComparableBookingForm(bookingForm),
        );
    }, [baseLine, bookingForm]);

    const baselineSyncFields = useMemo(() => {
        if (!baseLine) return null;

        return toSyncBookingFormFieldsRequest(baseLine.id, baseLine.fields)
            .fields;
    }, [baseLine]);

    const isDirtyBookingFormFields = useMemo(() => {
        if (!baselineSyncFields || !bookingFormFields) return false;
        if (bookingFormFields.bookingFormId !== baseLine?.id) return false;

        return !isEqual(baselineSyncFields, bookingFormFields.fields);
    }, [baselineSyncFields, bookingFormFields, baseLine?.id]);

    const isDirtyBookingFormStyles = useMemo(() => {
        if (!baseLine || !bookingFormStyles) return false;
        if (bookingFormStyles.bookingFormId !== baseLine.id) return false;

        return !isEqual(
            bookingFormStyles,
            toComparableBookingFormStyles(baseLine.styles),
        );
    }, [baseLine, bookingFormStyles]);

    const isDirtyBookingFormMeta = useMemo(() => {
        if (!baseLine || !bookingFormMeta || !baseLine.metaData) return false;
        if (bookingFormMeta.bookingFormId !== baseLine.id) return false;

        return !isEqual(
            bookingFormMeta,
            toComparableBookingFormMeta(baseLine.metaData),
        );
    }, [baseLine, bookingFormMeta]);

    const saveRequestThunks = useMemo(() => {
        const thunks: Array<() => Promise<unknown>> = [];

        if (isDirtyBookingForm && bookingForm) {
            thunks.push(() =>
                updateBookingForm(toComparableBookingForm(bookingForm)),
            );
        }
        if (isDirtyBookingFormFields && bookingFormFields) {
            thunks.push(() =>
                syncBookingFormField(
                    toSyncBookingFormFieldsRequest(
                        bookingFormId,
                        bookingFormFields,
                    ),
                ),
            );
        }
        if (isDirtyBookingFormStyles && bookingFormStyles) {
            thunks.push(() =>
                updateBookingFormStyles(
                    toComparableBookingFormStyles(bookingFormStyles),
                ),
            );
        }
        if (isDirtyBookingFormMeta && bookingFormMeta) {
            thunks.push(() =>
                updateBookingFormMeta(
                    toComparableBookingFormMeta(bookingFormMeta),
                ),
            );
        }

        return thunks;
    }, [
        bookingFormId,
        isDirtyBookingForm,
        isDirtyBookingFormFields,
        isDirtyBookingFormStyles,
        isDirtyBookingFormMeta,
        bookingForm,
        bookingFormFields,
        bookingFormStyles,
        bookingFormMeta,
        updateBookingForm,
        syncBookingFormField,
        updateBookingFormStyles,
        updateBookingFormMeta,
    ]);

    const handleNavigateToBookingForms = useCallback(() => {
        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId },
        });
    }, [organizationId, navigate]);

    const handleSave = useCallback(() => {
        if (saveRequestThunks.length === 0 || isSaving) return;

        const savePromises = Promise.all(
            saveRequestThunks.map((request) => request()),
        );

        void toast.promise(savePromises, {
            loading: 'Saving booking form...',
            success: () => {
                handleNavigateToBookingForms();
                return 'Booking form saved successfully';
            },
            error: (err) =>
                err instanceof Error
                    ? err.message
                    : 'Failed to save booking form',
        });
    }, [saveRequestThunks, handleNavigateToBookingForms, isSaving]);

    const hasSomethingToSave = useMemo(
        () =>
            isDirtyBookingForm ||
            isDirtyBookingFormFields ||
            isDirtyBookingFormStyles ||
            isDirtyBookingFormMeta,
        [
            isDirtyBookingForm,
            isDirtyBookingFormFields,
            isDirtyBookingFormStyles,
            isDirtyBookingFormMeta,
        ],
    );

    return (
        <div className={styles.footer}>
            <Button
                type="button"
                variant="simple-clean"
                onClick={handleNavigateToBookingForms}
            >
                Back
            </Button>
            <Button
                variant="green-filled"
                className={styles.saveButton}
                onClick={handleSave}
                disabled={!hasSomethingToSave || isSaving}
            >
                {isSaving ? 'Saving…' : 'Save booking form'}
            </Button>
        </div>
    );
});
