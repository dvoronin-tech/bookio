import { type ChangeEvent, type FC, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { Button, ValidatableInput } from '@bookio/ui';
import { BookingFormUrlPreview } from '#components/BookingFormUrlPreview/BookingFormUrlPreview.tsx';
import { useIsBookingFormExists } from '#api/bookingForms/isBookingFormExists.ts';
import { useGetOrganization } from '#api/organizations/getOrganizationData.ts';
import { useCreateBookingFormStore } from '#store/useCreateBookingFormStore.ts';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout.tsx';
import { slugSchema } from '@bookio/backend/schemas';
import toast from 'react-hot-toast';
import styles from './Step2UrlSlug.module.scss';
import { m } from '#i18n/messages';

export const Step2UrlSlug: FC = () => {
    const { slug, organizationId, setField, goToNextStep, goToPreviousStep } =
        useCreateBookingFormStore(
            useShallow((s) => ({
                slug: s.data.slug,
                organizationId: s.data.organizationId,
                setField: s.setField,
                goToNextStep: s.goToNextStep,
                goToPreviousStep: s.goToPreviousStep,
            })),
        );

    const { data: organization } = useGetOrganization(
        organizationId || undefined,
    );

    const trimmedSlug = slug.trim();
    const formatResult =
        trimmedSlug.length > 0 ? slugSchema.safeParse(trimmedSlug) : null;
    const isFormatValid = formatResult?.success === true;

    const { isValid: slugExistsIsValid } = useIsBookingFormExists({
        organizationId,
        slug: isFormatValid ? trimmedSlug : '',
    });

    const slugIsValid =
        trimmedSlug.length === 0
            ? undefined
            : !isFormatValid
              ? false
              : slugExistsIsValid;

    const slugErrorMessage =
        slugIsValid !== false
            ? undefined
            : !isFormatValid
              ? (formatResult?.error.issues[0]?.message ?? m.step2_invalid_slug())
              : m.step2_slug_taken();

    const organizationSlug = organization?.slug ?? m.url_org_fallback();
    const previewSlug = trimmedSlug || m.url_form_fallback();

    const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
        setField('slug', event.target.value);
    };

    const handleClickNext = useCallback(() => {
        const parsed = slugSchema.safeParse(trimmedSlug);
        if (!parsed.success) {
            return toast.error(
                parsed.error.issues[0]?.message ?? m.step2_invalid_slug(),
            );
        }

        if (slugExistsIsValid === false) {
            return toast.error(m.step2_slug_taken());
        }

        if (slugExistsIsValid === undefined && trimmedSlug.length > 0) {
            return toast.error(
                m.step2_slug_pending(),
            );
        }

        setField('slug', trimmedSlug);
        goToNextStep();
    }, [trimmedSlug, slugExistsIsValid, setField, goToNextStep]);

    return (
        <FormWizardLayout
            stepNumber={2}
            title={m.step2_title()}
            description={m.step2_description()}
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
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={goToPreviousStep}
                    >
                        {m.back()}
                    </Button>
                </div>
            }
        >
            <ValidatableInput
                value={slug}
                onChange={handleSlugChange}
                placeholder={m.step2_slug_placeholder()}
                isValid={slugIsValid}
                errorMessage={slugErrorMessage}
                autoFocus
            />
            <BookingFormUrlPreview
                organizationSlug={organizationSlug}
                formSlug={previewSlug}
            />
        </FormWizardLayout>
    );
};
