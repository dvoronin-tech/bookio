import { type ChangeEvent, type FC, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { Button, Input, ValidatableInput } from '@bookio/ui';
import { useGetBookingForms } from '#api/bookingForms/getBookingForms.ts';
import { useIsBookingFormExists } from '#api/bookingForms/isBookingFormExists.ts';
import { useCreateBookingFormStore } from '#store/useCreateBookingFormStore.ts';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout.tsx';
import toast from 'react-hot-toast';
import { useNavigate } from '@tanstack/react-router';
import {
    createBookingFormRouteApi,
    organizationRouteApi,
} from '#lib/routeApis';
import styles from './Step1NameDescription.module.scss';
import { m } from '../../../../../paraglide/messages.js';

export const Step1NameDescription: FC = () => {
    const navigate = useNavigate();
    const { guided } = createBookingFormRouteApi.useSearch();
    const { organizationId: routeOrganizationId } =
        organizationRouteApi.useParams();
    const { data: bookingForms } = useGetBookingForms(routeOrganizationId);
    const isGuidedFirstForm = guided === true || bookingForms?.length === 0;
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
        if (!data.name) return toast.error(m.step1_name_required());

        goToNextStep();
    }, [data.name, goToNextStep]);

    const handleClose = useCallback(() => {
        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId: routeOrganizationId },
        });
    }, [navigate, routeOrganizationId]);

    return (
        <FormWizardLayout
            stepNumber={1}
            title={m.step1_title()}
            description={m.step1_description()}
            onEnterComplete={handleClickNext}
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleClickNext}
                    >
                        {m.wizard_next()}
                    </Button>
                    {isGuidedFirstForm ? null : (
                        <Button
                            type="button"
                            variant="simple-clean"
                            onClick={handleClose}
                        >
                            {m.close()}
                        </Button>
                    )}
                </div>
            }
        >
            <ValidatableInput
                value={name}
                onChange={handleNameChange}
                placeholder={m.step1_name_placeholder()}
                isValid={nameIsValid}
                errorMessage={m.step1_name_taken()}
                autoFocus
            />
            <Input
                value={description}
                onChange={handleDescriptionChange}
                placeholder={m.step1_description_placeholder()}
            />
        </FormWizardLayout>
    );
};
