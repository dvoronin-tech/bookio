import { type FC, useCallback, useMemo } from 'react';
import styles from './CreateOrganization.module.scss';
import { Button, Input, HiddenField } from '@bookio/ui';
import { ValidatableInput } from '#components/ValidatableInput/ValidatableInput';
import {
    useCreateOrganization,
    type CreateOrganizationResponse,
} from '#api/organizations/createOrganization';
import { useSession } from '#api/auth';
import { slugSchema } from '@bookio/backend/schemas';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { type CreateOrganizationRequest } from '#api/organizations/createOrganization';
import { useIsOrganizationExists } from '#api/organizations/isOrganizationExists';
import { Controller, useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';
import { useNavigate } from 'react-router-dom';
import { navigateBack } from '#navigation';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout';
import { FormWizardLayoutProvider } from '#components/FormWizardLayout/FormWizardLayoutContext';
import { useDebouncedValidation } from '#utils/useDebouncedValidation';
import { formatZodError } from '#utils/parseError';

const formSchema = z.object({
    name: z.string().min(3).max(255),
    slug: slugSchema,
    password: z
        .string()
        .min(6)
        .max(255)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        }),
}) satisfies z.ZodType<Omit<CreateOrganizationRequest, 'userId'>>;

type FormData = z.infer<typeof formSchema>;

export const CreateOrganization: FC = () => {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const { data: organization, mutateAsync, isPending, isSuccess } = useCreateOrganization();

    const {
        register,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', slug: '', password: '' },
    });

    const slug = useWatch({ control, name: 'slug', defaultValue: '' });
    const { isValid: slugIsValid } = useIsOrganizationExists({ slug });

    const slugFormatError = useDebouncedValidation(
        slug,
        (value) => {
            return formatZodError(slugSchema.safeParse(value).error) ?? undefined;
        },
        500,
    );

    const onSubmit = useCallback(
        async (data: FormData) => {
            if (slugIsValid === false) {
                toast.error('Organization slug is already taken');
                return;
            }

            await toast.promise(mutateAsync({ ...data, userId: session!.user.id }), {
                loading: 'Creating organization...',
                success: 'Organization created successfully',
                error: (error: Error) => error.message,
            });
        },
        [mutateAsync, session, slugIsValid],
    );

    const onInvalid = useCallback((errors: FieldErrors<FormData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    }, []);

    const handleSubmitForm = useCallback(() => {
        handleSubmit(onSubmit, onInvalid)();
    }, [handleSubmit, onSubmit, onInvalid]);

    const handleClose = useCallback(() => {
        navigateBack(navigate);
    }, [navigate]);

    const isDisabled = isPending || isSubmitting;

    return (
        <FormWizardLayoutProvider totalSteps={2}>
            {isSuccess && organization ? (
                <SuccessfulOrganizationCreation data={organization} />
            ) : (
                <FormWizardLayout
                    stepNumber={1}
                    title="Let's create your organization"
                    description="Choose a name and unique slug for your organization. You'll also set a password to protect access."
                    onEnterComplete={isDisabled ? undefined : handleSubmitForm}
                    footer={
                        <div className={styles.footerActions}>
                            <Button
                                type="button"
                                variant="primary-filled"
                                onClick={handleSubmitForm}
                                disabled={isDisabled}
                            >
                                Create Organization
                            </Button>
                            <Button type="button" variant="simple-clean" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    }
                >
                    <Input
                        placeholder="Organization name"
                        disabled={isDisabled}
                        autoFocus
                        {...register('name')}
                    />
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <ValidatableInput
                                {...field}
                                placeholder="Unique organization slug"
                                isValid={slugIsValid && !slugFormatError}
                                errorMessage={
                                    !slugIsValid
                                        ? 'Organization slug is already taken'
                                        : slugFormatError
                                }
                                disabled={isDisabled}
                            />
                        )}
                    />
                    <Input
                        type="password"
                        placeholder="Organization password"
                        autoComplete="new-password"
                        disabled={isDisabled}
                        {...register('password')}
                    />
                </FormWizardLayout>
            )}
        </FormWizardLayoutProvider>
    );
};

const SuccessfulOrganizationCreation: FC<{ data: CreateOrganizationResponse['data'] }> = ({
    data,
}) => {
    const handleCopy = useCallback(() => {
        toast.success('Secret key copied to clipboard');
    }, []);

    return (
        <FormWizardLayout
            stepNumber={2}
            title={`Organization ${data.organization.name} created successfully`}
            description="Your organization has been created successfully. Below, in the hidden field, you can find the organization secret key. Copy and keep it in a safe place."
            footer={
                <div className={styles.footerActions}>
                    <Button type="link" to="/organizations/list" variant="primary-filled">
                        Go to organizations
                    </Button>
                </div>
            }
        >
            <HiddenField value={data.organization.secretKey} onCopy={handleCopy} />
        </FormWizardLayout>
    );
};
