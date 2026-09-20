import { type FC, useEffect } from 'react';
import { organizationRouteApi } from '#lib/routeApis';
import { useShallow } from 'zustand/shallow';
import {
    type CreateBookingFormStep,
    useCreateBookingFormStore,
} from '#store/useCreateBookingFormStore.ts';
import { FormWizardLayoutProvider } from '#components/FormWizardLayout/FormWizardLayoutContext.tsx';
import { Step1NameDescription } from './Steps/Step1NameDescription/Step1NameDescription.tsx';
import { Step2UrlSlug } from './Steps/Step2UrlSlug/Step2UrlSlug.tsx';
import { Step3Styles } from './Steps/Step3Styles/Step3Styles.tsx';
import { Step4Metadata } from './Steps/Step4Metadata/Step4Metadata.tsx';
import { Step5Review } from './Steps/Step5Review/Step5Review.tsx';
import { Step6Success } from './Steps/Step6Success/Step6Success.tsx';

const STEPS: Record<CreateBookingFormStep, FC> = {
    1: Step1NameDescription,
    2: Step2UrlSlug,
    3: Step3Styles,
    4: Step4Metadata,
    5: Step5Review,
    6: Step6Success,
};

export const CreateBookingForm: FC = () => {
    const { organizationId } = organizationRouteApi.useParams();
    const { step, setOrganizationId, reset } = useCreateBookingFormStore(
        useShallow((s) => ({
            step: s.step,
            setOrganizationId: s.setOrganizationId,
            reset: s.reset,
        })),
    );

    useEffect(() => {
        setOrganizationId(organizationId);
        return () => reset();
    }, [organizationId, setOrganizationId, reset]);

    const CurrentStep = STEPS[step];

    return (
        <FormWizardLayoutProvider totalSteps={6}>
            <CurrentStep />
        </FormWizardLayoutProvider>
    );
};
