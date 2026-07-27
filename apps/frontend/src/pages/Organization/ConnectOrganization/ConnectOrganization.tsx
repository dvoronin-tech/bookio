import { type FC } from 'react';
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

    const onSubmit = async (data: FormData) => {
        await toast.promise(mutateAsync(data), {
            loading: 'Connecting to organization...',
            success: 'Connected to organization successfully',
            error: (error: Error) => error.message,
        });
    };

    const onInvalid = (errors: FieldErrors<FormData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    };

    if (isSuccess) {
        navigate('/organizations/list', { replace: true });
    }

    const isDisabled = isPending || isSubmitting;

    return (
        <div className={styles.connectOrganization}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit, onInvalid)}>
                <h2 className={styles.title}>Lets connect to organization</h2>
                <div className={styles.formGroup}>
                    <Input
                        placeholder="Organization slug"
                        disabled={isDisabled}
                        {...register('slug')}
                    />
                    <Input
                        type="password"
                        placeholder="Organization password"
                        disabled={isDisabled}
                        {...register('password')}
                    />
                </div>
                <Button
                    className={styles.button}
                    variant="primary-filled"
                    type="submit"
                    disabled={isDisabled}
                >
                    Connect to Organization
                </Button>
            </form>
        </div>
    );
};
