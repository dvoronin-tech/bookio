import { useEffect, type FC } from 'react';
import type { EntireBookingFormType } from '#api/bookingForms/getEntireBookingFormById';
import type { UpdateBookingFormRequest } from '#api/bookingForms/updateBookingForm';
import { useNavigate, useParams } from 'react-router-dom';
import { guardConfiguratorRoute } from '#navigation';
import { Button, Checkbox, Input } from '@bookio/ui';
import { ValidatableInput } from '#components/ValidatableInput/ValidatableInput';
import { useIsBookingFormExists } from '#api/bookingForms/isBookingFormExists';

import styles from './SettingsTab.module.scss';
import { BookingFormUrlPreview } from '#components/BookingFormUrlPreview/BookingFormUrlPreview';
import { useGetOrganization, type OrganizationData } from '#api/organizations/getOrganizationData';

import { useForm, useWatch } from 'react-hook-form';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { useGetEntireBookingFormById } from '#api/bookingForms/getEntireBookingFormById';
import { Spinner } from '#components/Spinner/Spinner';

type SettingsTabFormData = Omit<UpdateBookingFormRequest, 'bookingFormId'>;

type SettingsTabFormProps = {
    bookingForm: EntireBookingFormType;
    organization: OrganizationData;
};

const SettingsTabForm: FC<SettingsTabFormProps> = ({ bookingForm, organization }) => {
    const setBookingForm = useBookingFormConfiguratorStore((state) => state.setBookingForm);

    const { register, control } = useForm<SettingsTabFormData>({
        defaultValues: {
            name: bookingForm.name ?? '',
            description: bookingForm.description ?? '',
            slug: bookingForm.slug ?? '',
            isActive: bookingForm.isActive ?? false,
        },
    });

    const formValues = useWatch({ control });

    useEffect(() => {
        setBookingForm({
            bookingFormId: bookingForm.id,
            name: formValues?.name ?? '',
            description: formValues?.description ?? '',
            slug: formValues?.slug ?? '',
            isActive: formValues?.isActive ?? false,
        });
    }, [formValues, bookingForm.id, setBookingForm]);

    const name = formValues?.name ?? '';
    const slug = formValues?.slug ?? '';

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();
    const originalName = (bookingForm.name ?? '').trim();
    const originalSlug = (bookingForm.slug ?? '').trim();

    const { isValid: nameIsValid } = useIsBookingFormExists({
        organizationId: organization.id,
        name: trimmedName,
        unchangedValue: originalName,
    });
    const { isValid: slugIsValid } = useIsBookingFormExists({
        organizationId: organization.id,
        slug: trimmedSlug,
        unchangedValue: originalSlug,
    });

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
                formSlug={trimmedSlug || originalSlug}
                organizationSlug={organization.slug}
            />
            <Checkbox label="Is active" {...register('isActive')} />
        </div>
    );
};

export const SettingsTab = () => {
    const { bookingFormId, id } = useParams();
    const navigate = useNavigate();

    const {
        data: organization,
        isLoading: isOrganizationLoading,
        isError: isOrganizationError,
        error: organizationError,
        refetch: refetchOrganization,
    } = useGetOrganization(id);
    const {
        data: bookingForm,
        isLoading: isBookingFormLoading,
        isError: isBookingFormError,
        error: bookingFormError,
        refetch: refetchBookingForm,
    } = useGetEntireBookingFormById(bookingFormId);

    const routeParams = guardConfiguratorRoute(navigate, id, bookingFormId);

    if (!routeParams) {
        return null;
    }

    if (isOrganizationLoading || isBookingFormLoading)
        return (
            <div className={styles.loadingContainer}>
                <Spinner />
            </div>
        );

    if (!organization || !bookingForm) {
        if (isOrganizationError || isBookingFormError) {
            console.error({ organizationError }, { bookingFormError });
            const refetchData = () => {
                if (isOrganizationError) {
                    void refetchOrganization();
                }
                if (isBookingFormError) {
                    void refetchBookingForm();
                }
            };

            return (
                <div className={styles.errorContainer}>
                    <h2>
                        {organizationError?.message ||
                            bookingFormError?.message ||
                            'An error occurred while fetching the data'}
                    </h2>
                    <Button variant="primary-outlined" onClick={refetchData}>
                        Retry
                    </Button>
                </div>
            );
        }
        return (
            <div className={styles.loadingContainer}>
                <Spinner />
            </div>
        );
    }

    return <SettingsTabForm bookingForm={bookingForm} organization={organization} />;
};
