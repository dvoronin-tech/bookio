import { type FC, useEffect } from 'react';
import type { UpdateBookingFormRequest } from '#api/bookingForms/updateBookingForm.ts';
import { configuratorRouteApi } from '#lib/routeApis';
import {
    Button,
    Checkbox,
    Input,
    PageLoader,
    ValidatableInput,
} from '@bookio/ui';
import { useIsBookingFormExists } from '#api/bookingForms/isBookingFormExists.ts';
import { useGetBookingForm } from '#api/bookingForms/getBookingForm.ts';
import { slugSchema } from '@bookio/backend/schemas';

import styles from './SettingsTab.module.scss';
import { BookingFormUrlPreview } from '#components/BookingFormUrlPreview/BookingFormUrlPreview.tsx';
import { useGetOrganization } from '#api/organizations/getOrganizationData.ts';

import { useForm, useWatch } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { m } from '#i18n/messages';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import { trimObj } from '#utils/trimObj.ts';

type SettingsTabFormData = Omit<UpdateBookingFormRequest, 'id'>;

type SettingsTabFormProps = {
    organizationId: string;
    organizationSlug: string;
};

const SettingsTabForm: FC<SettingsTabFormProps> = ({
    organizationId,
    organizationSlug,
}) => {
    const { setBookingForm, bookingForm } = useBookingFormConfiguratorStore(
        useShallow(({ setBookingForm, bookingForm }) => ({
            setBookingForm,
            bookingForm,
        })),
    );

    const { register, control } = useForm<SettingsTabFormData>({
        defaultValues: {
            name: bookingForm?.name ?? '',
            description: bookingForm?.description ?? '',
            markRequiredFields: bookingForm?.markRequiredFields ?? true,
            slug: bookingForm?.slug ?? '',
            isActive: bookingForm?.isActive ?? false,
        },
    });

    const formValues = useWatch({ control });
    const id = bookingForm?.id;

    useEffect(() => {
        if (!id) return;

        setBookingForm({
            id,
            name: formValues?.name ?? '',
            description: formValues?.description ?? '',
            slug: formValues?.slug ?? '',
            isActive: formValues?.isActive ?? false,
            markRequiredFields: formValues?.markRequiredFields ?? true,
        });
    }, [formValues, id, setBookingForm]);

    const currentName = formValues?.name ?? '';
    const currentSlug = formValues?.slug ?? '';
    const trimmedSlug = currentSlug.trim();
    const slugFormatResult = slugSchema.safeParse(trimmedSlug);
    const slugFormatError = slugFormatResult.success
        ? undefined
        : (slugFormatResult.error.issues[0]?.message ?? m.step2_invalid_slug());

    const { data: savedBookingForm } = useGetBookingForm(id);

    const { isValid: nameIsValid } = useIsBookingFormExists(
        trimObj({
            organizationId: organizationId,
            name: currentName,
            unchangedValue: bookingForm?.name,
        }),
    );
    const { isValid: slugExistsIsValid } = useIsBookingFormExists(
        trimObj({
            organizationId: organizationId,
            slug: slugFormatResult.success ? trimmedSlug : '',
            unchangedValue: savedBookingForm?.slug,
        }),
    );

    const slugIsTaken =
        Boolean(savedBookingForm) && slugExistsIsValid === false;
    const slugIsValid = slugFormatError
        ? false
        : savedBookingForm
          ? slugExistsIsValid
          : undefined;
    const slugErrorMessage = slugFormatError
        ? slugFormatError
        : slugIsTaken
          ? m.step2_slug_taken()
          : undefined;

    if (!bookingForm) {
        return null;
    }

    return (
        <div className={styles.settingsTab}>
            <ValidatableInput
                label={m.name()}
                className={styles.input}
                {...register('name')}
                isValid={nameIsValid}
                errorMessage={m.step1_name_taken()}
            />
            <Input
                label={m.description()}
                type="textarea"
                className={styles.textarea}
                {...register('description')}
            />
            <ValidatableInput
                label={m.slug()}
                className={styles.input}
                {...register('slug')}
                isValid={slugIsValid}
                errorMessage={slugErrorMessage}
            />
            <BookingFormUrlPreview
                formSlug={trimmedSlug}
                organizationSlug={organizationSlug}
            />
            <Checkbox
                label={m.settings_mark_required()}
                {...register('markRequiredFields')}
            />
            <Checkbox label={m.settings_is_active()} {...register('isActive')} />
        </div>
    );
};

export const SettingsTab = () => {
    const { organizationId } = configuratorRouteApi.useParams();

    const {
        data: organization,
        isLoading: isOrganizationLoading,
        isError: isOrganizationError,
        error: organizationError,
        refetch: refetchOrganization,
    } = useGetOrganization(organizationId);

    if (isOrganizationLoading) {
        return <PageLoader />;
    }

    const handleRefetchOrganization = () => {
        void refetchOrganization();
    };

    if (!organization) {
        if (isOrganizationError) {
            return (
                <div className={styles.errorContainer}>
                    <h2>
                        {organizationError?.message || m.settings_fetch_error()}
                    </h2>
                    <Button
                        variant="primary-outlined"
                        onClick={handleRefetchOrganization}
                    >
                        {m.retry()}
                    </Button>
                </div>
            );
        }

        return <PageLoader />;
    }

    return (
        <SettingsTabForm
            organizationId={organization.id}
            organizationSlug={organization.slug}
        />
    );
};
