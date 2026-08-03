import { type FC, useCallback } from 'react';
import styles from './ConnectOrganization.module.scss';
import { Button, Input } from '@bookio/ui';
import {
    useConnectToOrganization,
    type ConnectToOrganizationRequest,
} from '#api/organizations/connectToOrganization';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout';

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
        formState: { isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { slug: '', password: '' },
    });

    const onSubmit = useCallback(async (data: FormData) => {
        await toast.promise(mutateAsync(data), {
            loading: 'Connecting to organization...',
            success: 'Connected to organization successfully',
            error: (error: Error) => error.message,
        });
    }, [mutateAsync]);

    const onInvalid = useCallback((errors: FieldErrors<FormData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    }, []);

    const handleSubmitForm = useCallback(() => {
        handleSubmit(onSubmit, onInvalid)();
    }, [handleSubmit, onSubmit, onInvalid]);

    const handleClose = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    if (isSuccess) {
        navigate('/organizations/list', { replace: true });
    }

    const isDisabled = isPending || isSubmitting;

    return (
        <FormWizardLayout
            stepNumber={1}
            title="Let's connect to an organization"
            description="Enter the organization slug and password you received from the organization owner."
            onEnterComplete={isDisabled ? undefined : handleSubmitForm}
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleSubmitForm}
                        disabled={isDisabled}
                    >
                        Connect to Organization
                    </Button>
                    <Button type="button" variant="simple-clean" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            }
        >
            <Input
                placeholder="Organization slug"
                disabled={isDisabled}
                autoFocus
                {...register('slug')}
            />
            <Input
                type="password"
                placeholder="Organization password"
                disabled={isDisabled}
                {...register('password')}
            />
        </FormWizardLayout>
    );
};
