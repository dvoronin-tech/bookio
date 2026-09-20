import { type ChangeEvent, type FC, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { Button, Input, ValidatableInput } from '@bookio/ui';
import { useIsBookingFormExists } from '#api/bookingForms/isBookingFormExists.ts';
import { useCreateBookingFormStore } from '#store/useCreateBookingFormStore.ts';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout.tsx';
import toast from 'react-hot-toast';
import { useRouter } from '@tanstack/react-router';
import styles from './Step1NameDescription.module.scss';

export const Step1NameDescription: FC = () => {
    const router = useRouter();
    const { data, name, description, organizationId, setField, goToNextStep } =
        useCreateBookingFormStore(
            useShallow((s) => ({
                data: s.data,
                name: s.data.name,
                description: s.data.description,
                organizationId: s.data.organizationId,
                setField: s.setField,
                goToNextStep: s.goToNextStep,
            })),
        );

    const { isValid: nameIsValid } = useIsBookingFormExists({
        organizationId,
        name: name.trim(),
    });

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setField('name', event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setField('description', event.target.value);
    };

    const handleClickNext = useCallback(() => {
        if (!data.name) return toast.error('Name is required');

        goToNextStep();
    }, [data.name, goToNextStep]);

    const handleClose = useCallback(() => {
        router.history.back();
    }, [router]);

    return (
        <FormWizardLayout
            stepNumber={1}
            title="Enter name and description of booking form"
            description="The name must be unique within your organization. The description should explain the purpose of this booking form."
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
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </div>
            }
        >
            <ValidatableInput
                value={name}
                onChange={handleNameChange}
                placeholder="Name*"
                isValid={nameIsValid}
                errorMessage={'Booking form with this name already exists'}
                autoFocus
            />
            <Input
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Description"
            />
        </FormWizardLayout>
    );
};
