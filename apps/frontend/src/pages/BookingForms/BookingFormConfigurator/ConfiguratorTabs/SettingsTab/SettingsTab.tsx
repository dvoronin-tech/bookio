import { type FC, useEffect } from 'react';
import type { UpdateBookingFormRequest } from '#api/bookingForms/updateBookingForm.ts';
import { useParams } from 'react-router-dom';
import { Button, Checkbox, Input, ValidatableInput } from '@bookio/ui';
import { useIsBookingFormExists } from '#api/bookingForms/isBookingFormExists.ts';

import styles from './SettingsTab.module.scss';
import { BookingFormUrlPreview } from '#components/BookingFormUrlPreview/BookingFormUrlPreview.tsx';
import { useGetOrganization } from '#api/organizations/getOrganizationData.ts';

import { useForm, useWatch } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import { Loader } from '#components/Loader/Loader.tsx';
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

    const originalName = bookingForm?.name;
    const originalSlug = bookingForm?.slug;

    const { isValid: nameIsValid } = useIsBookingFormExists(
        trimObj({
            organizationId: organizationId,
            name: currentName,
            unchangedValue: originalName,
        }),
    );
    const { isValid: slugIsValid } = useIsBookingFormExists(
        trimObj({
            organizationId: organizationId,
            slug: currentSlug,
            unchangedValue: originalSlug,
        }),
    );

    if (!bookingForm) {
        return null;
    }

    return (
        <div className={styles.settingsTab}>
            <ValidatableInput
                label="Name"
                className={styles.input}
                {...register('name')}
                isValid={nameIsValid}
                errorMessage="Booking form with this name already exists"
            />
            <Input
                label="Description"
                type="textarea"
                className={styles.textarea}
                {...register('description')}
            />
            <ValidatableInput
                label="Slug"
                className={styles.input}
                {...register('slug')}
                isValid={slugIsValid}
                errorMessage="Booking form with this slug already exists"
            />
            <BookingFormUrlPreview
                formSlug={currentSlug || originalSlug}
                organizationSlug={organizationSlug}
            />
            <Checkbox
                label="Mark required fields"
                {...register('markRequiredFields')}
            />
            <Checkbox label="Is active" {...register('isActive')} />
        </div>
    );
};

export const SettingsTab = () => {
    const { organizationId } = useParams();

    const {
        data: organization,
        isLoading: isOrganizationLoading,
        isError: isOrganizationError,
        error: organizationError,
        refetch: refetchOrganization,
    } = useGetOrganization(organizationId);

    if (isOrganizationLoading) {
        return <Loader />;
    }

    const handleRefetchOrganization = () => {
        refetchOrganization();
    };

    if (!organization) {
        if (isOrganizationError) {
            return (
                <div className={styles.errorContainer}>
                    <h2>
                        {organizationError?.message ||
                            'An error occurred while fetching the data'}
                    </h2>
                    <Button
                        variant="primary-outlined"
                        onClick={handleRefetchOrganization}
                    >
                        Retry
                    </Button>
                </div>
            );
        }

        return <Loader />;
    }

    return (
        <SettingsTabForm
            organizationId={organization.id}
            organizationSlug={organization.slug}
        />
    );
};
