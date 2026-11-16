import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DEFAULT_DARK_BOOKING_FORM_STYLES } from '#utils/defaultBookingFormStyles';

export type CreateBookingFormStep = number;

export type CreateBookingFormAdditionalMetaItem = {
    key: string;
    value: string;
};

export type CreateBookingFormDraft = {
    organizationId: string;
    name: string;
    description: string;
    slug: string;
    primary: string;
    bgMain: string;
    bgSecondary: string;
    borderColor: string;
    textMain: string;
    textSecondary: string;
    metaTitle: string;
    metaDescription: string;
    additionalMeta: CreateBookingFormAdditionalMetaItem[];
};

const INITIAL_DRAFT: CreateBookingFormDraft = {
    organizationId: '',
    name: '',
    description: '',
    slug: '',
    ...DEFAULT_DARK_BOOKING_FORM_STYLES,
    metaTitle: '',
    metaDescription: '',
    additionalMeta: [],
};

interface CreateBookingFormStore {
    step: CreateBookingFormStep;
    data: CreateBookingFormDraft;
    createdBookingFormId: string | null;
    /** First and last steps of an edit opened from review. Null in linear navigation. */
    reviewEditFromStep: CreateBookingFormStep | null;
    reviewEditThroughStep: CreateBookingFormStep | null;

    goToNextStep: () => void;
    goToPreviousStep: () => void;
    setStep: (step: CreateBookingFormStep) => void;
    editFromReview: (
        step: CreateBookingFormStep,
        throughStep: CreateBookingFormStep,
    ) => void;
    setField: <K extends keyof CreateBookingFormDraft>(
        key: K,
        value: CreateBookingFormDraft[K],
    ) => void;
    setOrganizationId: (organizationId: string) => void;
    setCreatedBookingFormId: (createdBookingFormId: string) => void;
    reset: () => void;
}

const INITIAL_STEP: CreateBookingFormStep = 1;
const REVIEW_STEP: CreateBookingFormStep = 5;

const clampStep = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

export const shouldReturnToReview = (
    step: CreateBookingFormStep,
    throughStep: CreateBookingFormStep | null,
) => throughStep != null && step >= throughStep && step < REVIEW_STEP;

const noReviewEdit = {
    reviewEditFromStep: null,
    reviewEditThroughStep: null,
};

export const useCreateBookingFormStore = create<CreateBookingFormStore>()(
    devtools(
        (set) => ({
            step: INITIAL_STEP,
            data: INITIAL_DRAFT,
            createdBookingFormId: null,
            reviewEditFromStep: null,
            reviewEditThroughStep: null,

            goToNextStep: () =>
                set(
                    (state) => {
                        if (shouldReturnToReview(state.step, state.reviewEditThroughStep)) {
                            return { step: REVIEW_STEP, ...noReviewEdit };
                        }

                        return { step: state.step + 1 };
                    },
                    false,
                    'goToNextStep',
                ),
            goToPreviousStep: () =>
                set(
                    (state) => {
                        const step = state.step - 1;
                        const keepEdit =
                            state.reviewEditFromStep != null &&
                            step >= state.reviewEditFromStep;

                        return {
                            step,
                            reviewEditFromStep: keepEdit ? state.reviewEditFromStep : null,
                            reviewEditThroughStep: keepEdit ? state.reviewEditThroughStep : null,
                        };
                    },
                    false,
                    'goToPreviousStep',
                ),
            setStep: (step) => set({ step, ...noReviewEdit }, false, 'setStep'),
            editFromReview: (step, throughStep) =>
                set(
                    () => {
                        const target = clampStep(step, INITIAL_STEP, REVIEW_STEP - 1);
                        const through = clampStep(throughStep, target, REVIEW_STEP - 1);

                        return {
                            step: target,
                            reviewEditFromStep: target,
                            reviewEditThroughStep: through,
                        };
                    },
                    false,
                    'editFromReview',
                ),
            setField: (key, value) =>
                set((state) => ({ data: { ...state.data, [key]: value } }), false, 'setField'),
            setOrganizationId: (organizationId) =>
                set(
                    (state) => ({ data: { ...state.data, organizationId } }),
                    false,
                    'setOrganizationId',
                ),
            setCreatedBookingFormId: (createdBookingFormId) =>
                set({ createdBookingFormId }, false, 'setCreatedBookingFormId'),
            reset: () =>
                set(
                    {
                        step: INITIAL_STEP,
                        data: INITIAL_DRAFT,
                        createdBookingFormId: null,
                        ...noReviewEdit,
                    },
                    false,
                    'reset',
                ),
        }),
        { name: 'CreateBookingFormStore' },
    ),
);
