import { type ChangeEvent, type FC, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { Button, Input } from '@bookio/ui';
import { useCreateBookingFormStore } from '#store/useCreateBookingFormStore.ts';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout.tsx';
import { step4Schema } from '../../schemas/createBookingFormDraft.schema.ts';
import toast from 'react-hot-toast';
import styles from './Step4Metadata.module.scss';

export const Step4Metadata: FC = () => {
    const {
        metaTitle,
        metaDescription,
        setField,
        goToNextStep,
        goToPreviousStep,
    } = useCreateBookingFormStore(
        useShallow((s) => ({
            metaTitle: s.data.metaTitle,
            metaDescription: s.data.metaDescription,
            setField: s.setField,
            goToNextStep: s.goToNextStep,
            goToPreviousStep: s.goToPreviousStep,
        })),
    );

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
                parsed.error.issues[0]?.message ?? 'Invalid metadata',
            );
        }

        setField('metaTitle', trimmed.metaTitle);
        setField('metaDescription', trimmed.metaDescription);
        goToNextStep();
    }, [metaTitle, metaDescription, setField, goToNextStep]);

    return (
        <FormWizardLayout
            stepNumber={4}
            title="Set page metadata"
            description="Title and description are required for SEO and social previews."
            onEnterComplete={handleClickNext}
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleClickNext}
                    >
                        Go to next
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={goToPreviousStep}
                    >
                        Back
                    </Button>
                </div>
            }
        >
            <Input
                label="Title"
                value={metaTitle}
                onChange={handleMetaTitleChange}
                placeholder="Title*"
                autoFocus
            />
            <Input
                label="Description"
                value={metaDescription}
                onChange={handleMetaDescriptionChange}
                placeholder="Description*"
            />
        </FormWizardLayout>
    );
};
