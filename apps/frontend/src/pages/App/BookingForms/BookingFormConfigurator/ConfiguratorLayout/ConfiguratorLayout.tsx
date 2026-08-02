import { memo, type FC, type ReactNode, useMemo, useCallback, useEffect } from 'react';

import PanelLeftCloseIcon from '#assets/icons/panel-left-close.svg?react';
import { Button } from '@bookio/ui';

import { useShallow } from 'zustand/shallow';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { configuratorTabs } from '../configuratorTabs';
import styles from './ConfiguratorLayout.module.scss';
import { ConfiguratorTabs } from './ConfiguratorTabs';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetEntireBookingFormById } from '#api/bookingForms/getEntireBookingFormById';
import isEqual from 'fast-deep-equal';
import { useUpdateBookingForm } from '#api/bookingForms/updateBookingForm';
import toast from 'react-hot-toast';
import { useSyncBookingFormField } from '#api/bookingForms/bookingFormFields/syncBookingFormField';
import {
    toComparableBookingForm,
    toSaveFieldsPayload,
    toSyncBookingFormFieldsRequest,
} from '#utils/dataPreparers/bookingFormPreparers';

export const ConfiguratorLayout = memo(function ConfiguratorLayout({
    children,
}: {
    children?: ReactNode;
}) {
    const reset = useBookingFormConfiguratorStore((state) => state.reset);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    return (
        <div className={styles.configuratorContainer}>
            <ConfiguratorTabsSection />
            <ConfiguratorHeader />
            <div className={styles.content}>{children}</div>
            <ConfiguratorFooter />
        </div>
    );
});

const ConfiguratorTabsSection: FC = memo(() => {
    const { activeTab, setActiveTab } = useBookingFormConfiguratorStore(
        useShallow(({ activeTab, setActiveTab }) => ({ activeTab, setActiveTab })),
    );

    return (
        <div className={styles.tabs}>
            <ConfiguratorTabs
                tabs={configuratorTabs}
                activeTab={activeTab}
                onActiveTabChange={setActiveTab}
            />
        </div>
    );
});

const ConfiguratorHeader: FC = memo(() => {
    const activeTab = useBookingFormConfiguratorStore((state) => state.activeTab);
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>
                {configuratorTabs.find((tab) => tab.value === activeTab)?.content}
            </h2>
            <button type="button" className={styles.collapseButton} aria-label="Collapse panel">
                <PanelLeftCloseIcon />
            </button>
        </div>
    );
});

const ConfiguratorFooter: FC = memo(() => {
    const { bookingFormId, id } = useParams<{ id: string; bookingFormId: string }>();
    const { data: baseLine } = useGetEntireBookingFormById(bookingFormId);
    const { bookingForm, bookingFormFields } = useBookingFormConfiguratorStore(
        useShallow(({ bookingForm, bookingFormFields }) => ({
            bookingForm,
            bookingFormFields,
        })),
    );

    const navigate = useNavigate();

    const { mutateAsync: updateBookingForm, isPending: isUpdatePending } =
        useUpdateBookingForm(bookingFormId);
    const { mutateAsync: syncBookingFormField, isPending: isSyncPending } =
        useSyncBookingFormField(bookingFormId);

    const isSaving = isUpdatePending || isSyncPending;

    const isDirtyBookingForm = useMemo(() => {
        if (!baseLine || !bookingForm) return false;

        const baseBookingFormData = toComparableBookingForm({
            bookingFormId: baseLine.id,
            name: baseLine.name,
            description: baseLine.description,
            isActive: baseLine.isActive,
            slug: baseLine.slug,
        });

        return !isEqual(baseBookingFormData, toComparableBookingForm(bookingForm));
    }, [baseLine, bookingForm]);

    const baselineSyncFields = useMemo(() => {
        if (!baseLine) return null;

        return toSyncBookingFormFieldsRequest(baseLine.id, baseLine.fields).fields;
    }, [baseLine]);

    const isDirtyBookingFormFields = useMemo(() => {
        if (!baselineSyncFields || !bookingFormFields) return false;
        if (bookingFormFields.bookingFormId !== baseLine?.id) return false;

        return !isEqual(baselineSyncFields, bookingFormFields.fields);
    }, [baselineSyncFields, bookingFormFields, baseLine?.id]);

    const saveRequestThunks = useMemo(() => {
        if (!bookingFormId) return [];

        const thunks: Array<() => Promise<unknown>> = [];

        if (isDirtyBookingForm && bookingForm) {
            thunks.push(() => updateBookingForm(toComparableBookingForm(bookingForm)));
        }
        if (isDirtyBookingFormFields && bookingFormFields) {
            thunks.push(() =>
                syncBookingFormField(toSaveFieldsPayload(bookingFormId, bookingFormFields)),
            );
        }

        return thunks;
    }, [
        bookingFormId,
        isDirtyBookingForm,
        isDirtyBookingFormFields,
        bookingForm,
        bookingFormFields,
        updateBookingForm,
        syncBookingFormField,
    ]);

    const navigateToBookingForms = useCallback(() => {
        if (id) {
            navigate(`/${id}/booking-forms`);
        } else {
            navigate('/organizations/list');
        }
    }, [id, navigate]);

    const handleSave = useCallback(() => {
        if (saveRequestThunks.length === 0 || isSaving) return;

        toast.promise(Promise.all(saveRequestThunks.map((request) => request())), {
            loading: 'Saving booking form...',
            success: () => {
                navigateToBookingForms();
                return 'Booking form saved successfully';
            },
            error: 'Failed to save booking form',
        });
    }, [saveRequestThunks, navigateToBookingForms, isSaving]);

    const hasSomethingToSave = useMemo(
        () => isDirtyBookingForm || isDirtyBookingFormFields,
        [isDirtyBookingForm, isDirtyBookingFormFields],
    );

    return (
        <div className={styles.footer}>
            <Button type="button" variant="simple-clean" onClick={navigateToBookingForms}>
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
