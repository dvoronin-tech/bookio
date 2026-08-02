import { type FC, useCallback } from 'react';
import styles from './CreateOrganization.module.scss';
import { Button, Input, HiddenField } from '@bookio/ui';
import { ValidatableInput } from '#components/ValidatableInput/ValidatableInput';
import {
    useCreateOrganization,
    type CreateOrganizationResponse,
} from '#api/organizations/createOrganization';
import { useSession } from '#api/auth';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { type CreateOrganizationRequest } from '#api/organizations/createOrganization';
import { useIsOrganizationExists } from '#api/organizations/isOrganizationExists';
import { Controller, useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';

const formSchema = z.object({
    name: z.string().min(3).max(255),
    slug: z
        .string()
        .min(1)
        .max(255)
        .regex(/^[a-zA-Z0-9]/, {
            message: 'Slug must start with a letter or number',
        }),
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

    const onSubmit = async (data: FormData) => {
        if (slugIsValid === false) {
            toast.error('Organization slug is already taken');
            return;
        }

        await toast.promise(mutateAsync({ ...data, userId: session!.user.id }), {
            loading: 'Creating organization...',
            success: 'Organization created successfully',
            error: (error: Error) => error.message,
        });
    };

    const onInvalid = (errors: FieldErrors<FormData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    };

    if (isSuccess && organization) {
        return <SuccessfulOrganizationCreation data={organization} />;
    }

    const isDisabled = isPending || isSubmitting;

    return (
        <div className={styles.createOrganization}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit, onInvalid)}>
                <h2 className={styles.title}>Lets create your organization</h2>
                <div className={styles.formGroup}>
                    <Input
                        placeholder="Organization name"
                        disabled={isDisabled}
                        {...register('name')}
                    />
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <ValidatableInput
                                {...field}
                                placeholder="Unique organization slug"
                                isValid={slugIsValid}
                                errorMessage="Organization slug is already taken"
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
                </div>
                <Button
                    className={styles.button}
                    variant="primary-filled"
                    type="submit"
                    disabled={isDisabled}
                >
                    Create Organization
                </Button>
            </form>
        </div>
    );
};

const SuccessfulOrganizationCreation: FC<{ data: CreateOrganizationResponse['data'] }> = ({
    data,
}) => {
    const handleCopy = useCallback(() => {
        toast.success('Secret key copied to clipboard');
    }, []);

    return (
        <div className={styles.createOrganization}>
            <div className={styles.content}>
                <h2 className={styles.title}>
                    Organization {data.organization.name} created successfully
                </h2>
                <p className={styles.description}>
                    Your organization has been created successfully. Bellow, in the hidden field,
                    you can find the organization secret key. Copy and keep it in a safe place.
                </p>
                <HiddenField value={data.organization.secretKey} onCopy={handleCopy} />
                <Button
                    type="link"
                    to="/organizations/list"
                    className={styles.button}
                    variant="primary-filled"
                >
                    Go to organizations
                </Button>
            </div>
        </div>
    );
};
