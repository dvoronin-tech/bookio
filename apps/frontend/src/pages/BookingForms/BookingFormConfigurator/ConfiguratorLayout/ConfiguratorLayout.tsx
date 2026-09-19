import {
    type FC,
    memo,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';

import PanelLeftCloseIcon from '#assets/icons/panel-left-close.svg?react';
import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import { Button } from '@bookio/ui';

import { useShallow } from 'zustand/shallow';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import { configuratorTabs } from '../configuratorTabs.tsx';
import styles from './ConfiguratorLayout.module.scss';
import { ConfiguratorTabs } from './ConfiguratorTabs.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { navigateToBookingForms } from '#navigation';
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
import { useScrollTabs } from '#pages/BookingForms/BookingFormConfigurator/hooks/useScrollTabs.ts';
import clsx from 'clsx';
import { useUpdateBookingFormMeta } from '#api/bookingForms/bookingFormMeta/updateBookingFormMeta.ts';

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
        useShallow(({ activeTab, setActiveTab }) => ({
            activeTab,
            setActiveTab,
        })),
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const { onScrollLeft, onScrollRight, canScrollLeft, canScrollRight } =
        useScrollTabs({
            containerRef,
            trackRef,
        });

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
                <button
                    type="button"
                    className={clsx(styles.scrollButtonLeft, {
                        [styles.disabled]: !canScrollLeft,
                    })}
                    onClick={onScrollLeft}
                    disabled={!canScrollLeft}
                    aria-label="Scroll tabs left"
                >
                    <ArrowIcon className={styles.scrollArrowLeft} />
                </button>
                <div className={styles.tabsScroll} ref={containerRef}>
                    <ConfiguratorTabs
                        tabs={configuratorTabs}
                        activeTab={activeTab}
                        onActiveTabChange={setActiveTab}
                        ref={trackRef}
                    />
                </div>
                <button
                    type="button"
                    className={clsx(styles.scrollButtonRight, {
                        [styles.disabled]: !canScrollRight,
                    })}
                    onClick={onScrollRight}
                    disabled={!canScrollRight}
                    aria-label="Scroll tabs right"
                >
                    <ArrowIcon className={styles.scrollArrowRight} />
                </button>
            </div>
        </div>
    );
});

const ConfiguratorHeader: FC = memo(() => {
    const activeTab = useBookingFormConfiguratorStore(
        (state) => state.activeTab,
    );
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>
                {
                    configuratorTabs.find((tab) => tab.value === activeTab)
                        ?.content
                }
            </h2>
            <button
                type="button"
                className={styles.collapseButton}
                aria-label="Collapse panel"
            >
                <PanelLeftCloseIcon />
            </button>
        </div>
    );
});

const ConfiguratorFooter: FC = memo(() => {
    const { bookingFormId, organizationId } = useParams();
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
        if (!bookingFormId) return [];

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
        navigateToBookingForms(navigate, organizationId);
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
