import { type FC, useCallback, useEffect } from 'react';
import styles from './ConnectOrganization.module.scss';
import { Button, Input } from '@bookio/ui';
import {
    useConnectToOrganization,
    type ConnectToOrganizationRequest,
} from '#api/organizations/connectToOrganization';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useNavigate } from '@tanstack/react-router';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout';
import { m } from '../../../paraglide/messages.js';
import { ApiError } from '#i18n/apiError';

const formSchema = z.object({
    slug: z.string().min(1).max(255),
    password: z.string().min(6).max(255),
}) satisfies z.ZodType<Omit<ConnectToOrganizationRequest, 'userId'>>;

type FormData = z.infer<typeof formSchema>;

export const ConnectOrganization: FC = () => {
    const navigate = useNavigate();
    const { mutateAsync, isSuccess, isPending } = useConnectToOrganization();

    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { slug: '', password: '' },
    });

    const onSubmit = useCallback(
        async (data: FormData) => {
            await toast.promise(mutateAsync(data), {
                loading: m.org_connect_loading(),
                success: m.org_connect_success(),
                error: (error: Error) => {
                    if (ApiError.isApiError(error)) {
                        error.applyValidationIssues(
                            setError as (
                                name: string,
                                error: { type: string; message: string },
                            ) => void,
                        );
                    }
                    return error.message;
                },
            });
        },
        [mutateAsync, setError],
    );

    const onInvalid = useCallback((errors: FieldErrors<FormData>) => {
        toast.error(getFirstFieldError(errors) ?? m.invalid_form_data());
    }, []);

    const handleSubmitForm = useCallback(() => {
        handleSubmit(onSubmit, onInvalid)();
    }, [handleSubmit, onSubmit, onInvalid]);

    const handleGoToCreate = useCallback(() => {
        void navigate({ to: '/organizations/create' });
    }, [navigate]);

    useEffect(() => {
        if (isSuccess) {
            void navigate({ to: '/organizations/list', replace: true });
        }
    }, [isSuccess, navigate]);

    const isDisabled = isPending || isSubmitting;

    return (
        <FormWizardLayout
            stepNumber={1}
            title={m.org_connect_title()}
            description={m.org_connect_description()}
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
                        {m.org_connect_submit()}
                    </Button>
                    <Button
                        type="button"
                        variant="simple-outlined"
                        className={styles.actionButton}
                        onClick={handleGoToCreate}
                        disabled={isDisabled}
                    >
                        {m.org_connect_as_owner()}
                    </Button>
                </div>
            }
        >
            <Input
                placeholder={m.org_connect_slug_placeholder()}
                disabled={isDisabled}
                autoFocus
                {...register('slug')}
            />
            <Input
                type="password"
                placeholder={m.org_password_placeholder()}
                disabled={isDisabled}
                {...register('password')}
            />
        </FormWizardLayout>
    );
};
