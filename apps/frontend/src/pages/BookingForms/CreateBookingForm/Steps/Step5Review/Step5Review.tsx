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
import { m } from '../../../../../paraglide/messages.js';
import { getLocale } from '../../../../../paraglide/runtime.js';
import { COLOR_KEYS, colorLabel } from '../../colorLabels.ts';

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

const buildReviewSections = (data: CreateBookingFormDraft): ReviewSection[] => [
    {
        id: 'general',
        title: m.step5_general(),
        step: 1,
        // Name and description are edited on step 1; slug is step 2.
        throughStep: 2,
        cells: [
            { label: m.name(), value: data.name },
            {
                label: m.description(),
                value: data.description || m.step5_no_description(),
                empty: !data.description,
            },
            { label: m.slug(), value: data.slug },
        ],
    },
    {
        id: 'colors',
        title: m.step5_colors(),
        step: 3,
        throughStep: 3,
        cells: COLOR_KEYS.map((key) => ({
            label: colorLabel(key),
            value: data[key],
            color: data[key],
        })),
    },
    {
        id: 'metadata',
        title: m.step5_metadata(),
        step: 4,
        throughStep: 4,
        cells: [
            { label: m.title(), value: data.metaTitle },
            { label: m.description(), value: data.metaDescription },
            ...(data.additionalMeta.length === 0
                ? [{ label: m.step5_additional(), value: m.step5_none(), empty: true }]
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

    const locale = getLocale();
    const sections = useMemo(() => buildReviewSections(data), [data, locale]);

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
                    loading: m.step5_creating(),
                    success: m.step5_created(),
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
            title={m.step5_title()}
            description={m.step5_description()}
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleCreate}
                        disabled={isPending}
                    >
                        {m.step5_create()}
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={goToPreviousStep}
                        disabled={isPending}
                    >
                        {m.back()}
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
                        aria-label={m.step5_edit_section({
                            title: section.title,
                        })}
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
                            <span className={styles.editHint}>
                                {m.step5_edit()}
                            </span>
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
