import { type FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styles from '#layouts/AuthLayout/AuthLayout.module.scss';
import { useSignUp } from '#api/auth';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { type FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';

const passwordSchema = z
    .string()
    .min(6, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: 'Password must contain at least one special character',
    });

const signUpSchema = z
    .object({
        email: z.email(),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type SignUpData = z.infer<typeof signUpSchema>;

export const SignUp: FC = () => {
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useSignUp();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: SignUpData) => {
        await toast.promise(mutateAsync(data), {
            loading: 'Signing up...',
            success: 'Signed up successfully',
            error: (error: Error) => error.message,
        });
        await navigate({ to: '/organizations/list' });
    };

    const onInvalid = (errors: FieldErrors<SignUpData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    };

    const isDisabled = isPending || isSubmitting;

    return (
        <div className={styles.formBlock}>
            <p className={styles.eyebrow}>Get started</p>
            <h1 className={styles.title}>Create account</h1>
            <p className={styles.support}>
                Set up access for your organization in a few steps.
            </p>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit, onInvalid)}
            >
                <label className={styles.field}>
                    <span className={styles.label}>Email</span>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="you@organization.com"
                        autoComplete="email"
                        disabled={isDisabled}
                        {...register('email')}
                    />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Password</span>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        disabled={isDisabled}
                        {...register('password')}
                    />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Confirm password</span>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        disabled={isDisabled}
                        {...register('confirmPassword')}
                    />
                </label>
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={isDisabled}
                >
                    {isPending ? 'Signing up…' : 'Create account'}
                </button>
            </form>
            <div className={styles.switchRow}>
                Already have an account?{' '}
                <button
                    type="button"
                    className={styles.textControl}
                    onClick={() => void navigate({ to: '/auth/sign-in' })}
                >
                    Sign in
                </button>
            </div>
        </div>
    );
};
