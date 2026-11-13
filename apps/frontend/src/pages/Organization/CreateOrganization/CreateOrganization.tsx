import { type FC, useCallback, useState } from 'react';
import styles from './CreateOrganization.module.scss';
import { Button, Dialog, Input, HiddenField, ValidatableInput } from '@bookio/ui';
import {
    useCreateOrganization,
    type CreateOrganizationResponse,
} from '#api/organizations/createOrganization';
import { useSession, useSignOut } from '#api/auth';
import { slugSchema } from '@bookio/backend/schemas';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { type CreateOrganizationRequest } from '#api/organizations/createOrganization';
import { useIsOrganizationExists } from '#api/organizations/isOrganizationExists';
import { Controller, useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';
import { useNavigate } from '@tanstack/react-router';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout';
import { FormWizardLayoutProvider } from '#components/FormWizardLayout/FormWizardLayoutContext';
import { useDebouncedValidation } from '#utils/useDebouncedValidation';
import { formatZodError } from '#utils/parseError';
import { copyToClipboard } from '#utils/copyToClipboard.ts';

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

    const handleGoToConnect = useCallback(() => {
        void navigate({ to: '/organizations/connect' });
    }, [navigate]);

    const isDisabled = isPending || isSubmitting;

    return (
        <FormWizardLayoutProvider totalSteps={2}>
            {isSuccess && organization ? (
                <SuccessfulOrganizationCreation data={organization} />
            ) : (
                <FormWizardLayout
                    stepNumber={1}
                    title="Создайте организацию"
                    description="Так появится рабочее пространство для формы записи."
                    onEnterComplete={isDisabled ? undefined : handleSubmitForm}
                    footer={
                        <div className={styles.footerActions}>
                            <Button
                                type="button"
                                variant="primary-filled"
                                className={styles.actionButton}
                                onClick={handleSubmitForm}
                                disabled={isDisabled}
                            >
                                Create Organization
                            </Button>
                            <Button
                                type="button"
                                variant="simple-outlined"
                                className={styles.actionButton}
                                onClick={handleGoToConnect}
                                disabled={isDisabled}
                            >
                                Я сотрудник — подключиться к организации
                            </Button>
                            <AccountSignOut />
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

const SuccessfulOrganizationCreation: FC<{
    data: CreateOrganizationResponse['data'];
}> = ({ data }) => {
    const navigate = useNavigate();

    const handleOpenBookingForms = useCallback(() => {
        void navigate({
            to: '/$organizationId/booking-forms/create',
            params: { organizationId: data.organization.id },
            search: { guided: true },
        });
    }, [data.organization.id, navigate]);

    return (
        <FormWizardLayout
            stepNumber={2}
            title={`Organization ${data.organization.name} created successfully`}
            description="Your organization has been created successfully. Below, in the hidden field, you can find the organization secret key. Copy and keep it in a safe place."
            footer={
                <div className={styles.footerActions}>
                    <Button
                        variant="primary-filled"
                        className={styles.actionButton}
                        onClick={handleOpenBookingForms}
                    >
                        Открыть формы записи
                    </Button>
                    <AccountSignOut />
                </div>
            }
        >
            <HiddenField
                value={data.organization.secretKey}
                onCopy={(value) => copyToClipboard(value, 'Secret key')}
            />
        </FormWizardLayout>
    );
};

const AccountSignOut: FC = () => {
    const navigate = useNavigate();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const { mutateAsync, isPending } = useSignOut();

    const handleLogout = async () => {
        const logoutRes = mutateAsync();

        await toast.promise(logoutRes, {
            loading: 'Trying to logout',
            error: (error) =>
                `Something went wrong during logout, error: ${error}`,
            success: "You've been logged out successfully",
        });

        const logoutData = await logoutRes;
        if (logoutData.success) {
            setIsLogoutDialogOpen(false);
            await navigate({ to: '/auth/sign-in' });
        }
    };

    return (
        <>
            <button
                type="button"
                className={styles.signOut}
                onClick={() => setIsLogoutDialogOpen(true)}
                disabled={isPending}
            >
                Не тот аккаунт? Выйти
            </button>
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <Dialog.Title>Are you sure that you want to log out?</Dialog.Title>
                <Dialog.Description>
                    If you continue, you will be logged out.
                </Dialog.Description>
                <Dialog.Actions>
                    <Dialog.Button
                        variant="simple-clean"
                        onClick={() => setIsLogoutDialogOpen(false)}
                    >
                        Go back
                    </Dialog.Button>
                    <Dialog.Button variant="red-filled" onClick={handleLogout}>
                        Выйти
                    </Dialog.Button>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};
