import { type ChangeEvent, type FC, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { Button, Input } from '@bookio/ui';
import {
    shouldReturnToReview,
    useCreateBookingFormStore,
} from '#store/useCreateBookingFormStore.ts';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout.tsx';
import { step4Schema } from '../../schemas/createBookingFormDraft.schema.ts';
import toast from 'react-hot-toast';
import styles from './Step4Metadata.module.scss';
import { m } from '../../../../../paraglide/messages.js';
import { CreateBookingFormCloseButton } from '../../CreateBookingFormCloseButton.tsx';

export const Step4Metadata: FC = () => {
    const {
        metaTitle,
        metaDescription,
        setField,
        goToNextStep,
        goToPreviousStep,
        reviewEditThroughStep,
    } = useCreateBookingFormStore(
        useShallow((s) => ({
            metaTitle: s.data.metaTitle,
            metaDescription: s.data.metaDescription,
            setField: s.setField,
            goToNextStep: s.goToNextStep,
            goToPreviousStep: s.goToPreviousStep,
            reviewEditThroughStep: s.reviewEditThroughStep,
        })),
    );
    const returnsToReview = shouldReturnToReview(4, reviewEditThroughStep);

    const handleMetaTitleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('metaTitle', event.target.value);
        },
        [setField],
    );

    const handleMetaDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('metaDescription', event.target.value);
        },
        [setField],
    );

    const handleClickNext = useCallback(() => {
        const trimmed = {
            metaTitle: metaTitle.trim(),
            metaDescription: metaDescription.trim(),
        };

        const parsed = step4Schema.safeParse(trimmed);
        if (!parsed.success) {
            return toast.error(
                parsed.error.issues[0]?.message ?? m.step4_invalid(),
            );
        }

        setField('metaTitle', trimmed.metaTitle);
        setField('metaDescription', trimmed.metaDescription);
        goToNextStep();
    }, [metaTitle, metaDescription, setField, goToNextStep]);

    return (
        <FormWizardLayout
            stepNumber={4}
            title={m.step4_title()}
            description={m.step4_description()}
            onEnterComplete={handleClickNext}
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleClickNext}
                    >
                        {returnsToReview
                            ? m.wizard_back_to_review()
                            : m.wizard_next()}
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={goToPreviousStep}
                    >
                        {m.back()}
                    </Button>
                    <CreateBookingFormCloseButton />
                </div>
            }
        >
            <Input
                label={m.title()}
                value={metaTitle}
                onChange={handleMetaTitleChange}
                placeholder={m.step4_title_placeholder()}
                autoFocus
            />
            <Input
                label={m.description()}
                value={metaDescription}
                onChange={handleMetaDescriptionChange}
                placeholder={m.step4_description_placeholder()}
            />
        </FormWizardLayout>
    );
};
