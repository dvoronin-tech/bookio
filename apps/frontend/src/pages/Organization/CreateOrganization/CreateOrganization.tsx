import { type FC, useCallback, useMemo, useState } from 'react';
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
import { goToOrganizationWorkspace } from '#lib/bookingFormEntry';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout';
import { FormWizardLayoutProvider } from '#components/FormWizardLayout/FormWizardLayoutContext';
import { useDebouncedValidation } from '#utils/useDebouncedValidation';
import { formatZodError } from '#utils/parseError';
import { copyToClipboard } from '#utils/copyToClipboard.ts';
import { m } from '../../../paraglide/messages.js';
import { getLocale } from '../../../paraglide/runtime.js';
import { applyValidationIssues } from '#i18n/apiError';

function createFormSchema() {
    return z.object({
        name: z.string().min(3).max(255),
        slug: slugSchema,
        password: z
            .string()
            .min(6)
            .max(255)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
                message: m.org_password_rules(),
            }),
    }) satisfies z.ZodType<Omit<CreateOrganizationRequest, 'userId'>>;
}

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

export const CreateOrganization: FC = () => {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const { data: organization, mutateAsync, isPending, isSuccess } = useCreateOrganization();
    const locale = getLocale();
    const formSchema = useMemo(() => createFormSchema(), [locale]);

    const {
        register,
        control,
        handleSubmit,
        setError,
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
                toast.error(m.org_slug_taken());
                return;
            }

            await toast.promise(mutateAsync({ ...data, userId: session!.user.id }), {
                loading: m.org_create_loading(),
                success: m.org_create_success(),
                error: (error: Error) => {
                    applyValidationIssues(
                        error,
                        setError as (
                            name: string,
                            error: { type: string; message: string },
                        ) => void,
                    );
                    return error.message;
                },
            });
        },
        [mutateAsync, session, setError, slugIsValid],
    );

    const onInvalid = useCallback((errors: FieldErrors<FormData>) => {
        toast.error(getFirstFieldError(errors) ?? m.invalid_form_data());
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
                    title={m.org_create_title()}
                    description={m.org_create_description()}
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
                                {m.org_create_submit()}
                            </Button>
                            <Button
                                type="button"
                                variant="simple-outlined"
                                className={styles.actionButton}
                                onClick={handleGoToConnect}
                                disabled={isDisabled}
                            >
                                {m.org_create_as_member()}
                            </Button>
                            <AccountSignOut />
                        </div>
                    }
                >
                    <Input
                        placeholder={m.org_name_placeholder()}
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
                                placeholder={m.org_slug_placeholder()}
                                isValid={slugIsValid && !slugFormatError}
                                errorMessage={
                                    !slugIsValid
                                        ? m.org_slug_taken()
                                        : slugFormatError
                                }
                                disabled={isDisabled}
                            />
                        )}
                    />
                    <Input
                        type="password"
                        placeholder={m.org_password_placeholder()}
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
        void goToOrganizationWorkspace(data.organization.id, navigate);
    }, [data.organization.id, navigate]);

    return (
        <FormWizardLayout
            stepNumber={2}
            title={m.org_created_title({ name: data.organization.name })}
            description={m.org_created_description()}
            footer={
                <div className={styles.footerActions}>
                    <Button
                        variant="primary-filled"
                        className={styles.actionButton}
                        onClick={handleOpenBookingForms}
                    >
                        {m.org_open_forms()}
                    </Button>
                    <AccountSignOut />
                </div>
            }
        >
            <HiddenField
                value={data.organization.secretKey}
                onCopy={(value) => copyToClipboard(value, m.org_secret_key())}
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
            loading: m.header_logout_loading(),
            error: (error) => m.header_logout_error({ error: String(error) }),
            success: m.header_logout_success(),
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
                {m.org_wrong_account()}
            </button>
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <Dialog.Title>{m.header_logout_confirm_title()}</Dialog.Title>
                <Dialog.Description>
                    {m.header_logout_confirm_description()}
                </Dialog.Description>
                <Dialog.Actions>
                    <Dialog.Button
                        variant="simple-clean"
                        onClick={() => setIsLogoutDialogOpen(false)}
                    >
                        {m.go_back()}
                    </Dialog.Button>
                    <Dialog.Button variant="red-filled" onClick={handleLogout}>
                        {m.logout()}
                    </Dialog.Button>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};
