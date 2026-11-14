import { type FC, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { Button } from '@bookio/ui';
import { useCreateBookingForm } from '#api/bookingForms/createBookingForm.ts';
import {
    type CreateBookingFormDraft,
    type CreateBookingFormStep,
    useCreateBookingFormStore,
} from '#store/useCreateBookingFormStore.ts';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout.tsx';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import styles from './Step5Review.module.scss';

type ReviewCell = {
    label: string;
    value: string;
    empty?: boolean;
    color?: string;
};

type ReviewSection = {
    id: string;
    title: string;
    step: CreateBookingFormStep;
    throughStep: CreateBookingFormStep;
    cells: ReviewCell[];
};

const COLOR_FIELDS = [
    { key: 'primary', label: 'Primary' },
    { key: 'bgMain', label: 'Background main' },
    { key: 'bgSecondary', label: 'Background secondary' },
    { key: 'borderColor', label: 'Border' },
    { key: 'textMain', label: 'Text main' },
    { key: 'textSecondary', label: 'Text secondary' },
] as const;

const buildReviewSections = (data: CreateBookingFormDraft): ReviewSection[] => [
    {
        id: 'general',
        title: 'General',
        step: 1,
        // Name and description are edited on step 1; slug is step 2.
        throughStep: 2,
        cells: [
            { label: 'Name', value: data.name },
            {
                label: 'Description',
                value: data.description || 'No description',
                empty: !data.description,
            },
            { label: 'Slug', value: data.slug },
        ],
    },
    {
        id: 'colors',
        title: 'Colors',
        step: 3,
        throughStep: 3,
        cells: COLOR_FIELDS.map(({ key, label }) => ({
            label,
            value: data[key],
            color: data[key],
        })),
    },
    {
        id: 'metadata',
        title: 'Metadata',
        step: 4,
        throughStep: 4,
        cells: [
            { label: 'Title', value: data.metaTitle },
            { label: 'Description', value: data.metaDescription },
            ...(data.additionalMeta.length === 0
                ? [{ label: 'Additional', value: 'None', empty: true }]
                : data.additionalMeta.map((item) => ({
                      label: item.key,
                      value: item.value,
                  }))),
        ],
    },
];

export const Step5Review: FC = () => {
    const {
        data,
        goToPreviousStep,
        goToNextStep,
        editFromReview,
        setCreatedBookingFormId,
    } = useCreateBookingFormStore(
        useShallow((s) => ({
            data: s.data,
            goToPreviousStep: s.goToPreviousStep,
            goToNextStep: s.goToNextStep,
            editFromReview: s.editFromReview,
            setCreatedBookingFormId: s.setCreatedBookingFormId,
        })),
    );

    const { mutateAsync: createBookingForm, isPending } =
        useCreateBookingForm();

    const sections = useMemo(() => buildReviewSections(data), [data]);

    const handleCreate = useCallback(async () => {
        try {
            const created = await toast.promise(
                createBookingForm({
                    organizationId: data.organizationId,
                    name: data.name,
                    description: data.description || null,
                    slug: data.slug,
                    primary: data.primary,
                    bgMain: data.bgMain,
                    bgSecondary: data.bgSecondary,
                    borderColor: data.borderColor,
                    textMain: data.textMain,
                    textSecondary: data.textSecondary,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    additionalMeta: data.additionalMeta,
                }),
                {
                    loading: 'Creating booking form...',
                    success: 'Booking form created successfully',
                    error: (error: Error) => error.message,
                },
            );

            setCreatedBookingFormId(created.id);
            goToNextStep();
        } catch {
            // toast.promise already surfaces the error
        }
    }, [createBookingForm, data, goToNextStep, setCreatedBookingFormId]);

    return (
        <FormWizardLayout
            stepNumber={5}
            title="Review your booking form"
            description="Please confirm that all information is correct. Click a section to edit that step, or create the booking form."
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleCreate}
                        disabled={isPending}
                    >
                        Create booking form
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={goToPreviousStep}
                        disabled={isPending}
                    >
                        Back
                    </Button>
                </div>
            }
        >
            <div className={styles.summary}>
                {sections.map((section, sectionIndex) => (
                    <button
                        key={section.id}
                        type="button"
                        className={styles.section}
                        disabled={isPending}
                        aria-label={`Edit ${section.title}`}
                        onClick={() =>
                            editFromReview(section.step, section.throughStep)
                        }
                    >
                        <header className={styles.sectionHeader}>
                            <span className={styles.sectionIndex}>
                                {String(sectionIndex + 1).padStart(2, '0')}
                            </span>
                            <h3 className={styles.sectionTitle}>
                                {section.title}
                            </h3>
                            <span className={styles.editHint}>Edit</span>
                        </header>

                        <div className={styles.elements}>
                            {section.cells.map((cell, cellIndex) => (
                                <div
                                    key={`${section.id}-${cellIndex}`}
                                    className={styles.element}
                                >
                                    <span className={styles.label}>
                                        {cell.label}
                                    </span>
                                    <span
                                        className={clsx(
                                            styles.value,
                                            cell.empty && styles.emptyValue,
                                            cell.color && styles.colorValue,
                                        )}
                                    >
                                        {cell.color ? (
                                            <span
                                                className={styles.swatch}
                                                style={{
                                                    backgroundColor: cell.color,
                                                }}
                                                aria-hidden
                                            />
                                        ) : null}
                                        {cell.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>
        </FormWizardLayout>
    );
};
